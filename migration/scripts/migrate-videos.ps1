param(
  [ValidateSet('Analyze', 'Run', 'Validate')]
  [string]$Mode = 'Analyze'
)

$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$envFile = Join-Path $workspace '.env.local'
$extractedDir = Join-Path $workspace 'migration\extracted'
$reportsDir = Join-Path $workspace 'migration\reports'
$snapshotPath = Join-Path $extractedDir 'videos.json'
$reportPath = Join-Path $reportsDir 'videos-validation.json'
$sourceUrl = 'https://www.denisealesi.com/video/'

function Ensure-Directories {
  @($extractedDir, $reportsDir) | ForEach-Object {
    if (!(Test-Path -LiteralPath $_)) { New-Item -ItemType Directory -Path $_ | Out-Null }
  }
}

function Read-EnvValue([string]$name) {
  $line = Get-Content -LiteralPath $envFile | Where-Object {$_ -match "^$([regex]::Escape($name))="} | Select-Object -Last 1
  if (!$line) { return $null }
  return ($line.Substring($line.IndexOf('=') + 1)).Trim().Trim('"').Trim("'")
}

function Extract-Videos {
  $html = (Invoke-WebRequest -Uri $sourceUrl -UseBasicParsing).Content
  $embed = [regex]::Match($html, 'https://www\.youtube\.com/embed/([^"''?<> ]+)', 'IgnoreCase')
  $titles = @([regex]::Matches($html, '<h1[^>]*>(.*?)</h1>', 'IgnoreCase,Singleline') | ForEach-Object {
    [Net.WebUtility]::HtmlDecode(($_.Groups[1].Value -replace '<[^>]+>', '' -replace '\s+', ' ').Trim())
  } | Where-Object {$_ -and $_ -ne 'Denise Alesi'})
  $dateMatch = [regex]::Match($html, '<small>\s*(\d{2})/(\d{2})/(\d{4})\s*</small>', 'IgnoreCase')
  if (!$embed.Success -or !$titles.Count -or !$dateMatch.Success) { throw 'Video pubblico non riconosciuto nella pagina sorgente.' }
  $title = $titles[0]
  $record = [ordered]@{
    legacyId = 8
    sanityId = 'legacy-video-8'
    legacyUrl = 'https://www.denisealesi.com/video/8-Silenzio-ProgettoartisticodiDeniseAlesi'
    title = $title
    date = "$($dateMatch.Groups[3].Value)-$($dateMatch.Groups[2].Value)-$($dateMatch.Groups[1].Value)"
    url = "https://www.youtube.com/watch?v=$($embed.Groups[1].Value)"
  }
  ConvertTo-Json -InputObject @($record) -Depth 5 | Set-Content -LiteralPath $snapshotPath -Encoding UTF8
  return ,$record
}

function Get-SanityVideos {
  $query = [uri]::EscapeDataString('*[_type == "video" && defined(legacyId)]{_id,legacyId,data,url,"title":traduzioni[language == "it"][0].titolo}')
  return @((Invoke-RestMethod -Uri "https://f7yyl8n6.api.sanity.io/v2026-08-14/data/query/production?query=$query").result)
}

function Validate-Import {
  $items = @(Get-SanityVideos)
  $video = $items | Where-Object {$_.legacyId -eq 8} | Select-Object -First 1
  $valid = [bool]($video -and $video._id -eq 'legacy-video-8' -and $video.data -eq '2019-08-01' -and $video.url -match 'OmRxqa3OfiA')
  $report = [ordered]@{generatedAt=(Get-Date).ToUniversalTime().ToString('o'); expected=1; actual=$items.Count; valid=$valid; document=$video}
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8
  $report | ConvertTo-Json -Depth 6
  if (!$valid) { throw 'Validazione video fallita.' }
}

Ensure-Directories
if ($Mode -eq 'Analyze') {
  $records = @(Extract-Videos)
  Write-Host "Inventario completato: $($records.Count) video."
  exit 0
}
if ($Mode -eq 'Validate') { Validate-Import; exit 0 }

$token = Read-EnvValue 'SANITY_API_WRITE_TOKEN'
if (!$token) { throw 'SANITY_API_WRITE_TOKEN non trovato in .env.local.' }
$record = if (Test-Path -LiteralPath $snapshotPath) {@(Get-Content -Raw -LiteralPath $snapshotPath | ConvertFrom-Json)[0]} else {@(Extract-Videos)[0]}
$document = [ordered]@{
  _id = $record.sanityId
  _type = 'video'
  traduzioni = @([ordered]@{_key='it'; _type='object'; language='it'; titolo=$record.title})
  data = $record.date
  url = $record.url
  inEvidenza = $true
  legacyId = [int]$record.legacyId
  legacyUrl = $record.legacyUrl
  migratedAt = (Get-Date).ToUniversalTime().ToString('o')
}
$payload = @{mutations=@(@{createOrReplace=$document})} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri 'https://f7yyl8n6.api.sanity.io/v2026-08-14/data/mutate/production?returnIds=true' -Method Post -Headers @{Authorization="Bearer $token"} -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($payload)) | Out-Null
Validate-Import
