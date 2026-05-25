# K AG Foresight Radar

Strategische Analyse organisatorischer Handlungsfelder. 19 Felder, 5 Cluster, 5 Bewertungsdimensionen, 4 Handlungszonen.

## Was ist das?

Ein interaktives Analyse-Tool, das organisatorische Trends und Handlungsfelder auf einem Radar visualisiert. Jedes Feld wird anhand von 5 Dimensionen bewertet und einer Handlungszone zugeordnet (ACT / PREPARE / MONITOR / SCAN).

Einsatz: Keynotes, Beratungseinstieg, Workshops, Thought Leadership.

## Methodik

Eigene K AG Methodik, inspiriert von Gartner Hype Cycle, McKinsey Technology Trends Outlook, IFTF Signals & Drivers, WEF Future of Jobs Report und Kairos Future TAIDA. Unterscheidungsmerkmale: Schweizer Perspektive, KMU-Fokus, explizite Messung der Readiness Gap.

**5 Bewertungsdimensionen:**

| Dimension | Gewicht | Beschreibung |
|-----------|---------|-------------|
| Velocity | 20% | Veränderungsgeschwindigkeit (Suchvolumen, Paper-Frequenz) |
| Impact Depth | 25% | Strukturelle Tiefe der Veränderung |
| Market Pull | 20% | Nachfrage und Investitionen |
| Talent Signal | 15% | Skill-Nachfrage auf dem Arbeitsmarkt |
| Readiness Gap | 20% | Kluft zwischen Dringlichkeit und Umsetzung |

**4 Handlungszonen:**

| Zone | Score | Bedeutung |
|------|-------|-----------|
| ACT | 75–100 | Sofort handeln |
| PREPARE | 50–74 | Strategisch vorbereiten |
| MONITOR | 25–49 | Aktiv beobachten |
| SCAN | 0–24 | Auf dem Radar behalten |

**5 Cluster:**

- Intelligent Enterprise (AI Strategy, Data-Driven Decisions, Digital Transformation)
- Workforce Evolution (Future of Work, Talent, Employee Experience, L&D)
- Governance & Trust (Cybersecurity, Regulatory Compliance, Sustainability & ESG)
- Organizational Agility (Change Management, Innovation, Operating Model, Agile Org)
- Human Centricity (Leadership, Wellbeing, DEI, Ecosystem Management, Human-AI Collaboration)

## Technologie

- Vanilla HTML/CSS/JS (kein Build-Prozess)
- D3.js v7 für Radar-Visualisierung
- Chart.js v4 für Dashboard-Charts
- Light + Dark Mode (CSS Custom Properties, `prefers-color-scheme`)

## Struktur

```
index.html          — Hauptseite mit 5 Tabs
css/style.css       — Styling, Farben, Responsive
data/fields.js      — 19 Handlungsfelder, Cluster, Dimensionen, Zonen
js/app.js           — Scoring-Engine, Navigation, Charts, Detail-Ansichten
js/radar.js         — D3.js Radar-Visualisierung
docs/               — Projektdokumentation
```

## Lokal starten

```bash
# Beliebiger lokaler Server, z.B.:
python3 -m http.server 8000
# Dann http://localhost:8000 öffnen
```

Oder einfach `index.html` direkt im Browser öffnen.

## Status

Prototyp (Phase 1). Demo-Daten, kein Backend. Siehe `docs/ROADMAP.md` für geplante Phasen.

## K AG

Placeholder bis zur Firmengründung am 1.10.2026.
