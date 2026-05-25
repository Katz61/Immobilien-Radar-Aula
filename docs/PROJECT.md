# Projektsteckbrief: K AG Foresight Radar

## Überblick

| Feld | Wert |
|------|------|
| Projektname | K AG Foresight Radar |
| Projektleiter | Michael Katzlberger |
| Firma | K AG (Gründung 1.10.2026) |
| Status | Prototyp (Phase 1) |
| Start | 25. Mai 2026 |
| Repository | Immobilien-Radar-Aula |

## Projektziel

Ein interaktives Foresight-Tool, das 19 organisatorische Handlungsfelder analysiert und auf einem Radar visualisiert. Das Tool dient als:

1. Einstieg in Beratungsmandate (Conversation Opener)
2. Keynote-Visualisierung
3. Workshop-Instrument für Kunden
4. Thought-Leadership-Plattform (LinkedIn, Vorträge)

## Abgrenzung

- Kein ERP, kein CRM, kein Projektmanagement-Tool
- Kein Konkurrenzprodukt zu Gartner oder McKinsey (anderer Scope: Organisationen, nicht Technologie)
- Unabhängig vom Risikomanagement-Tool (separate Anwendung)
- Phase 1 = Prototyp mit Demo-Daten (kein Live-Backend)

## Rollen

| Rolle | Person | Verantwortung |
|-------|--------|---------------|
| Projektleiter | Michael Katzlberger | Inhaltliche Steuerung, Abnahme |
| Entwicklung | Devin (AI) | Implementation, Dokumentation |

## Methodik

Eigene K AG Methodik mit 5 Bewertungsdimensionen:
- Velocity (20%) — Veränderungsgeschwindigkeit
- Impact Depth (25%) — Strukturelle Tiefe
- Market Pull (20%) — Nachfrage und Investitionen
- Talent Signal (15%) — Arbeitsmarkt-Dynamik
- Readiness Gap (20%) — Umsetzungslücke

4 Handlungszonen: ACT / PREPARE / MONITOR / SCAN

5 Cluster: Intelligent Enterprise, Workforce Evolution, Governance & Trust, Organizational Agility, Human Centricity

Inspirationsquellen: Gartner Hype Cycle, McKinsey Technology Trends Outlook, IFTF Signals & Drivers, WEF Future of Jobs, Kairos Future TAIDA.

Alleinstellungsmerkmal: Schweizer Perspektive, KMU-Fokus, Readiness Gap als 5. Dimension.

## Technische Rahmenbedingungen

- Frontend-only (Vanilla HTML/CSS/JS)
- D3.js für Radar, Chart.js für Dashboards
- Kein Build-Prozess, kein Framework
- Light + Dark Mode
- Responsive Design
- CDN für Libraries (D3, Chart.js)

## Qualitätskriterien

- Alle 19 Felder korrekt bewertet und visualisiert
- Scoring-Engine rechnet korrekt (gewichteter Durchschnitt)
- Radar-Visualisierung interaktiv (Hover, Click)
- 5 Tabs funktional (Dashboard, Radar, Cluster, Alle Felder, Methodik)
- Dark Mode funktioniert
- Mobile-tauglich (Responsive)
