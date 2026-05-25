# Architektur: K AG Foresight Radar

## Ist-Zustand (Prototyp)

### Übersicht

```
Browser
  ├── index.html (5 Tabs, statisch)
  ├── css/style.css (Styling, Light/Dark Mode)
  ├── data/fields.js (19 Felder, Cluster, Scores)
  ├── js/app.js (Scoring-Engine, Charts, Navigation)
  ├── js/radar.js (D3.js Radar-Visualisierung)
  └── CDN
        ├── D3.js v7.9.0
        └── Chart.js v4.4.1
```

### Datenfluss

1. `fields.js` definiert FIELDS, CLUSTERS, DIMENSIONS, ZONES als globale Konstanten
2. `app.js` berechnet Scores beim Laden (`enrichFields()`)
3. `app.js` rendert Dashboard, Cluster-View, Tabelle, Methodik
4. `radar.js` rendert D3.js SVG mit Zone-Ringen und Feld-Punkten
5. Interaktionen (Hover, Click) navigieren zur Detail-Ansicht

### Scoring-Engine

```
Gesamtscore = Σ (Dimension_i × Gewicht_i)

Dimensionen:
  velocity  × 0.20
  impact    × 0.25
  market    × 0.20
  talent    × 0.15
  readiness × 0.20
  ─────────────────
  Total     = 1.00

Zone = Score ≥ 75 → ACT
       Score ≥ 50 → PREPARE
       Score ≥ 25 → MONITOR
       Score <  25 → SCAN
```

### Kein Backend

Der Prototyp hat kein Backend. Alle Daten sind in `data/fields.js` hartcodiert. Das ist beabsichtigt für Phase 1.

## Zielarchitektur (Phase 2+)

### Geplante Komponenten

```
Browser (SPA)
  ├── Frontend (wie heute, erweitert)
  └── REST API Calls
        │
        ▼
API Server (Node.js oder Python)
  ├── /api/fields — Handlungsfelder + Scores
  ├── /api/scores/update — Score-Aktualisierung
  └── /api/trends — Zeitverlaufsdaten
        │
        ▼
Datenquellen (automatisiert)
  ├── Google Trends API → Velocity
  ├── arXiv API → Velocity
  ├── GDELT / News API → Impact Depth
  ├── LinkedIn / Indeed → Talent Signal
  └── Crunchbase → Market Pull
        │
        ▼
Datenbank (PostgreSQL)
  ├── fields (id, name, cluster, ...)
  ├── scores (field_id, dimension, value, date)
  ├── trends (field_id, score, timestamp)
  └── sources (field_id, source, raw_value, date)
```

### Hosting (geplant)

- Schweizer Hosting (Datenschutz)
- Static Hosting für Frontend (z.B. Vercel, Netlify, oder CH-Provider)
- Backend: containerisiert (Docker)
- Datenbank: Managed PostgreSQL

### Authentifizierung (Phase 3)

- Für interne Nutzung: kein Login nötig
- Für Kundenworkshops: einfacher Link-basierter Zugang
- Für Mandanten-Portale: Auth0 oder ähnlich
