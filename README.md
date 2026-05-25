# Leadmaschine Liegenschaften

Liegenschafts-Lead Engine zur systematischen Identifikation von Grundstücken mit Entwicklungspotenzial im Kanton Zug. Fokus auf Objekte mit tiefer Ausnützungsziffer, hohem Alter oder Sanierungsbedarf.

## Funktionen

- **Gebiet-Scan** — Systematische Suche über Gemeinden (Raster-basiert, konfigurierbar)
- **AZ-Berechnung** — Ausnützungsziffer aus Zonenplan vs. aktuelle Nutzung
- **Eigentümer-Analyse** — Zefix-Firmenabfrage + Heuristik
- **Lead-Scoring** — Automatische Priorisierung (0-100 Punkte)
- **Lead-Management** — Status, Notizen, Filter, Sortierung
- **Renditekalkulator** — 3 Szenarien (Sanierung, Aufstockung, Neubau)
- **Export** — CSV und PDF-Reports
- **Karte** — Swisstopo mit Parzellengrenzen und Score-Markern

## Tech-Stack

| Technologie | Zweck |
|-------------|-------|
| React + TypeScript | Frontend |
| Vite | Build-Tool |
| Tailwind CSS | Styling |
| Zustand | State Management |
| Leaflet | Karte (Swisstopo WMS) |

## Datenquellen

Alle Daten stammen aus öffentlichen Schweizer Quellen:

- [geo.admin.ch](https://api3.geo.admin.ch) — Gebäuderegister (GWR), Parzellen
- [geodienste.ch](https://geodienste.ch) — Zonenplan (Nutzungsplanung)
- [Zefix](https://www.zefix.admin.ch) — Firmenregister (SPARQL)
- [sonnendach.ch](https://www.sonnendach.ch) — Solarpotenzial

## Setup

```bash
npm install
npm run dev
```

## Projektdokumentation

- [Projekt-Steckbrief](docs/PROJECT.md)
- [Architektur](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Logbuch](LOGBOOK.md)

## Eigentümer

K AG (Projektname)
