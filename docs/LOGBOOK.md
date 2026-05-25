# Logbuch: K AG Foresight Radar

## 25. Mai 2026

### Session-Start und Anforderungsklärung

- Michael gibt Auftrag: "K AG - Trendradar"
- Klärung: Standalone-Web-App, analog Risikomanagement-Projekt
- Referenzdokument: `TRENDRADAR-PROJECT.md` aus dem Risikomanagement-Repo
- Anforderung: Strukturiertes Projekt mit lückenloser Dokumentation

### Erster Prototyp (Haufe-basiert)

- Prototyp erstellt mit 15 Haufe-Handlungsfeldern + 4 Blind Spots
- 4 Bewertungskriterien (Tempo, Impact, Stakeholder, Aufwand)
- 4 Zonen (ACT/CREATE/DEVELOP/DISCOVER)
- D3.js Radar-Visualisierung, Chart.js Dashboard
- Tabs: Dashboard, Radar, Handlungsfelder, Methodik

### Methodenwechsel

- Michael: "Haufe ist nur eine Idee, hier gibt es sicher besseres"
- Entscheidung: Eigene K AG Methodik entwickeln, nicht Haufe kopieren
- Michael will sich als Futurist positionieren

### Recherche

8 Frameworks analysiert:
1. Gartner Hype Cycle — Technologie-Reifegradmodell (5 Phasen)
2. McKinsey Technology Trends Outlook — 6 quantitative Indikatoren
3. IFTF Signals & Drivers — Signal-basierte Zukunftsanalyse
4. Kairos Future TAIDA — Europäischer Foresight-Ansatz (5 Schritte)
5. Deloitte Tech Trends — 6 Macro-Kräfte-Framework
6. WEF Future of Jobs — CEO-Umfrage zu Arbeitsmarkt-Trends
7. Stanford Foresight Framework — 15 Methoden, 3 Phasen
8. Kommerzielle Tools (Valona, FIBRES, 4strat) — Markt-Überblick

Ergebnis dokumentiert in `docs/RESEARCH-METHODIK.md`.

### Methodik-Entscheid

Michael wählt: "K AG Foresight Radar" als Name.
Weitere Entscheidungen (durch Devin, basierend auf Recherche):
- Keine Buzzword-Methodiknamen (kein "Signal-to-Strategy")
- Zonen: ACT / PREPARE / MONITOR / SCAN (handlungsorientiert)
- 5 Dimensionen: Velocity, Impact Depth, Market Pull, Talent Signal, Readiness Gap
- 5 Cluster statt Haufe-Liste + Blind Spots
- Cluster-Ansicht und Einzelfelder parallel

Michael fordert: Keine Schmeichelei, keine Buzzwords, kritische Beurteilung.

### Kompletter Umbau

Alle Dateien neu geschrieben:
- `data/fields.js` — 19 Felder in 5 Clustern, 5 Dimensionen, neue Zonen
- `js/app.js` — Neue Scoring-Engine (5 Dimensionen, gewichtet), Cluster-View
- `js/radar.js` — Cluster-Segmente, neue Zone-Ringe
- `css/style.css` — Neue Zone-Farben (PREPARE/MONITOR/SCAN statt CREATE/DEVELOP/DISCOVER), Cluster-Styles
- `index.html` — 5 Tabs (Dashboard, Radar, Cluster, Alle Felder, Methodik)

### Browser-Test

Alle 5 Tabs getestet:
- Dashboard: 19 Felder, KPIs korrekt (2 ACT, 8 PREPARE, 9 MONITOR, 0 SCAN)
- Radar: 19 Punkte in 4 Zonen, 5 Cluster-Segmente, interaktiv
- Cluster: 5 Cluster mit Durchschnitts-Score und Einzel-Feldern
- Alle Felder: Sortierte Tabelle mit allen 5 Dimensionen
- Methodik: Dimensionen, Zonen, Datenquellen, Inspirationsquellen
- Detail-Ansicht: Score-Ring, 5 Dimensions-Karten, Insight, Trend-Chart

### Dokumentation

- `README.md` — Projektübersicht
- `docs/PROJECT.md` — Projektsteckbrief
- `docs/ARCHITECTURE.md` — Ist- und Zielarchitektur
- `docs/ROADMAP.md` — 4 Phasen mit Aufwandschätzungen
- `docs/LOGBOOK.md` — Dieses Dokument
- `docs/RESEARCH-METHODIK.md` — Recherche-Ergebnisse (8 Frameworks)

### Commits und PR

- Branch: `devin/1779704487-k-ag-trendradar`
- PR erstellt mit vollständiger Beschreibung
