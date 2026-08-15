# Migrazione video

## Inventario

- Origine: `https://www.denisealesi.com/video/`
- Contenuti pubblici trovati: 1
- Destinazione: Sanity `f7yyl8n6/production`, tipo `video`

| ID legacy | Documento Sanity | Titolo | Data | URL video |
| ---: | --- | --- | --- | --- |
| 8 | `legacy-video-8` | “Silenzio” - Progetto artistico di Denise Alesi | 2019-08-01 | YouTube `OmRxqa3OfiA` |

Lo script conserva l’URL della pagina sorgente, usa `createOrReplace` e può essere rieseguito senza generare duplicati.

```powershell
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-videos.ps1 -Mode Analyze
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-videos.ps1 -Mode Run
powershell -ExecutionPolicy Bypass -File migration/scripts/migrate-videos.ps1 -Mode Validate
```
