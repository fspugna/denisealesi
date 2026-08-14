param(
  [ValidateSet('Analyze', 'Run', 'Validate')]
  [string]$Mode = 'Analyze'
)

$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$envFile = Join-Path $workspace '.env.local'
$extractedDir = Join-Path $workspace 'migration\extracted'
$sourceDir = Join-Path $workspace 'migration\source\galleries'
$transformedDir = Join-Path $workspace 'migration\transformed'
$reportsDir = Join-Path $workspace 'migration\reports'
$snapshotPath = Join-Path $extractedDir 'galleries.json'
$assetMapPath = Join-Path $transformedDir 'gallery-assets.json'
$reportPath = Join-Path $reportsDir 'galleries-validation.json'

$galleries = @(
  [ordered]@{id='14'; slug='14-Silenzio'; title='Silenzio'; expected=63},
  [ordered]@{id='17'; slug='17-IlSognoelaMateria'; title='Il Sogno e la Materia'; expected=5},
  [ordered]@{id='19'; slug='19-Immaginieparole'; title='Immagini e parole'; expected=7},
  [ordered]@{id='20'; slug='20-Firenzetu'; title='Firenze, tu'; expected=13},
  [ordered]@{id='22'; slug='22-Lucieombre'; title='Luci e ombre'; expected=3}
)

function Read-EnvValue([string]$name) {
  if (!(Test-Path -LiteralPath $envFile)) { return $null }
  $line = Get-Content -LiteralPath $envFile | Where-Object { $_ -match "^$([regex]::Escape($name))=" } | Select-Object -Last 1
  if (!$line) { return $null }
  return ($line.Substring($line.IndexOf('=') + 1)).Trim().Trim('"').Trim("'")
}

function Ensure-Directories {
  @($extractedDir, $sourceDir, $transformedDir, $reportsDir) | ForEach-Object {
    if (!(Test-Path -LiteralPath $_)) { New-Item -ItemType Directory -Path $_ | Out-Null }
  }
}

function Get-GallerySnapshot {
  $records = foreach ($gallery in $galleries) {
    $url = "https://www.denisealesi.com/gallerie/$($gallery.slug)"
    Write-Host "Analisi: $($gallery.title)"
    $html = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
    $pattern = 'https://www\.denisealesi\.com/images/gallerie/{0}/(?!thumbs/)[^"''?<> ]+\.(?:jpg|jpeg|png)' -f $gallery.id
    $images = @([regex]::Matches($html, $pattern, 'IgnoreCase') | ForEach-Object {$_.Value} | Select-Object -Unique)
    if ($images.Count -ne $gallery.expected) {
      throw "Conteggio inatteso per $($gallery.title): trovate $($images.Count), attese $($gallery.expected)."
    }
    [ordered]@{
      legacyId = $gallery.id
      legacyUrl = $url
      sanityId = "legacy-gallery-$($gallery.id)"
      title = $gallery.title
      images = $images
    }
  }
  $records | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $snapshotPath -Encoding UTF8
  return @($records)
}

function Get-AssetMap {
  $map = @{}
  if (Test-Path -LiteralPath $assetMapPath) {
    $saved = Get-Content -Raw -LiteralPath $assetMapPath | ConvertFrom-Json
    $saved.psobject.Properties | ForEach-Object {$map[$_.Name] = $_.Value}
  }
  return $map
}

function Save-AssetMap($map) {
  $ordered = [ordered]@{}
  $map.Keys | Sort-Object | ForEach-Object {$ordered[$_] = $map[$_]}
  $ordered | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $assetMapPath -Encoding UTF8
}

function Upload-Image([string]$url, [string]$galleryId, [string]$token, $assetMap) {
  if ($assetMap.ContainsKey($url)) { return $assetMap[$url] }
  $imageUri = [uri]$url
  $filename = [IO.Path]::GetFileName($imageUri.AbsolutePath)
  $galleryDir = Join-Path $sourceDir $galleryId
  if (!(Test-Path -LiteralPath $galleryDir)) { New-Item -ItemType Directory -Path $galleryDir | Out-Null }
  $filePath = Join-Path $galleryDir $filename
  if (!(Test-Path -LiteralPath $filePath)) { Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing }
  $uploadUrl = "https://f7yyl8n6.api.sanity.io/v2026-08-14/assets/images/production?filename=$([uri]::EscapeDataString($filename))"
  try {
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers @{Authorization="Bearer $token"} -ContentType 'image/jpeg' -InFile $filePath
  } catch {
    Write-Warning "File locale non valido, nuovo download: $filename"
    Remove-Item -LiteralPath $filePath -Force
    Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers @{Authorization="Bearer $token"} -ContentType 'image/jpeg' -InFile $filePath
  }
  if (!$response.document._id) { throw "Upload fallito: $url" }
  $assetMap[$url] = $response.document._id
  Save-AssetMap $assetMap
  return $response.document._id
}

function Write-GalleryDocument($record, [string]$token, $assetMap) {
  $photos = @()
  $position = 0
  foreach ($url in $record.images) {
    $position++
    Write-Host "  [$position/$($record.images.Count)] $([IO.Path]::GetFileName(([uri]$url).AbsolutePath))"
    $assetId = Upload-Image $url $record.legacyId $token $assetMap
    $photos += [ordered]@{
      _key = "legacy-$($record.legacyId)-$position"
      _type = 'image'
      asset = [ordered]@{_type='reference'; _ref=$assetId}
      alt = $record.title
    }
  }
  $document = [ordered]@{
    _id = $record.sanityId
    _type = 'galleriaFotografica'
    traduzioni = @([ordered]@{_key='it'; _type='object'; language='it'; titolo=$record.title})
    fotografie = $photos
    legacyId = $record.legacyId
    legacyUrl = $record.legacyUrl
    migratedAt = (Get-Date).ToUniversalTime().ToString('o')
  }
  $payload = @{mutations=@(@{createOrReplace=$document})} | ConvertTo-Json -Depth 12
  Invoke-RestMethod -Uri 'https://f7yyl8n6.api.sanity.io/v2026-08-14/data/mutate/production?returnIds=true' -Method Post -Headers @{Authorization="Bearer $token"} -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($payload)) | Out-Null
}

function Validate-Migration {
  $query = [uri]::EscapeDataString('*[_type == "galleriaFotografica" && defined(legacyId)] | order(legacyId asc){_id,legacyId,"title":traduzioni[language == "it"][0].titolo,"images":count(fotografie)}')
  $response = Invoke-RestMethod -Uri "https://f7yyl8n6.api.sanity.io/v2026-08-14/data/query/production?query=$query"
  $actual = @($response.result)
  $checks = foreach ($gallery in $galleries) {
    $item = $actual | Where-Object {$_.legacyId -eq $gallery.id} | Select-Object -First 1
    [ordered]@{legacyId=$gallery.id; title=$gallery.title; expectedImages=$gallery.expected; actualImages=if($item){$item.images}else{0}; valid=[bool]($item -and $item.images -eq $gallery.expected)}
  }
  $report = [ordered]@{generatedAt=(Get-Date).ToUniversalTime().ToString('o'); expectedGalleries=5; actualGalleries=$actual.Count; expectedImages=91; actualImages=($actual | Measure-Object -Property images -Sum).Sum; checks=$checks}
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8
  $report | ConvertTo-Json -Depth 6
  if (@($checks | Where-Object {!$_.valid}).Count -gt 0) { throw 'Validazione fallita. Consulta il report.' }
}

Ensure-Directories

if ($Mode -eq 'Analyze') {
  $snapshot = Get-GallerySnapshot
  $total = ($snapshot | ForEach-Object {$_.images.Count} | Measure-Object -Sum).Sum
  Write-Host "Inventario completato: $($snapshot.Count) gallerie, $total immagini."
  exit 0
}

if ($Mode -eq 'Validate') {
  Validate-Migration
  exit 0
}

$token = Read-EnvValue 'SANITY_API_WRITE_TOKEN'
if (!$token) { throw 'SANITY_API_WRITE_TOKEN non trovato in .env.local.' }
$snapshot = if (Test-Path -LiteralPath $snapshotPath) {@(Get-Content -Raw -LiteralPath $snapshotPath | ConvertFrom-Json)} else {@(Get-GallerySnapshot)}
$assetMap = Get-AssetMap
foreach ($record in $snapshot) {
  Write-Host "Importazione: $($record.title)"
  Write-GalleryDocument $record $token $assetMap
}
Validate-Migration
