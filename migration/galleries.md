# Migrazione gallerie fotografiche

## Origine e destinazione

- Origine: `https://www.denisealesi.com/gallerie/` (solo contenuti pubblicati)
- Destinazione: Sanity, progetto `f7yyl8n6`, dataset `production`
- Tipo documento: `galleriaFotografica`

## Mapping

| Origine | Documento Sanity | Titolo | Immagini attese |
| --- | --- | --- | ---: |
| `14-Silenzio` | `legacy-gallery-14` | Silenzio | 63 |
| `17-IlSognoelaMateria` | `legacy-gallery-17` | Il Sogno e la Materia | 5 |
| `19-Immaginieparole` | `legacy-gallery-19` | Immagini e parole | 7 |
| `20-Firenzetu` | `legacy-gallery-20` | Firenze, tu | 13 |
| `22-Lucieombre` | `legacy-gallery-22` | Luci e ombre | 3 |

Il sito sorgente non pubblica date o descrizioni affidabili. La migrazione non le inventa. Titoli e immagini vengono importati; `legacyId`, `legacyUrl` e `migratedAt` conservano la provenienza.

## Esecuzione

```powershell
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-galleries.ps1 -Mode Analyze
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-galleries.ps1 -Mode Run
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-galleries.ps1 -Mode Validate
```

Lo script usa `SANITY_API_WRITE_TOKEN` da `.env.local`, mantiene uno snapshot locale ignorato da Git ed è rieseguibile grazie a ID documento deterministici e alla cache degli asset caricati.
