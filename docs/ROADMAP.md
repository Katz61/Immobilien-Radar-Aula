# Roadmap — Leadmaschine Liegenschaften

## Phase 1 — Prototyp (abgeschlossen)

**Zeitraum:** 14.04. — 08.05.2026
**Kosten:** $9.38
**Ergebnis:** Funktionierender Prototyp als Single-Page HTML-App

| Feature | Status |
|---------|--------|
| Swisstopo-Karte mit Parzellengrenzen | Erledigt |
| Klick auf Karte → Gebäude-/Parzellendaten | Erledigt |
| Adress-Suche (geo.admin.ch) | Erledigt |
| Gebiet-Scan (Raster-basiert, Multi-Gemeinde) | Erledigt |
| AZ-Berechnung (Bauordnung Zug §36) | Erledigt |
| Eigentümer-Typ (Zefix + Heuristik) | Erledigt |
| Lead-Status / Mini-CRM (6 Stufen) | Erledigt |
| Notizen pro Objekt | Erledigt |
| Score-System (0-100) | Erledigt |
| Renditekalkulator (3 Szenarien) | Erledigt |
| CSV-Export | Erledigt |
| PDF-Report | Erledigt |
| Sonnendach-Integration | Erledigt |
| Klientenpitch (9 Slides) | Erledigt |

---

## Phase 2 — Professionalisierung (in Arbeit)

**Zeitraum:** ab 25.05.2026
**Ziel:** Vom Prototyp zum wartbaren, erweiterbaren Produkt

| Feature | Status |
|---------|--------|
| Vite + React + TypeScript Setup | In Arbeit |
| Modulare Komponentenstruktur | In Arbeit |
| Tailwind CSS Design-System | In Arbeit |
| Zustand State Management | In Arbeit |
| TypeScript-Typdefinitionen | In Arbeit |
| API-Services modular (geo.admin, Zefix, etc.) | In Arbeit |
| Projekt-Logbuch | Erledigt |
| Projekt-Steckbrief | Erledigt |
| Architektur-Dokumentation | Erledigt |
| Roadmap | Erledigt |
| Alle Features aus Phase 1 migrieren | In Arbeit |

---

## Phase 3 — Kundenfähig machen (geplant)

**Zeitraum:** Q3 2026
**Ziel:** Tool einer Immobilien AG zur Verfügung stellen

| Feature | Priorität |
|---------|-----------|
| Backend (Node.js/Express) | Hoch |
| Datenbank (PostgreSQL) für Leads/Scans | Hoch |
| Benutzer-Login (Authentifizierung) | Hoch |
| CH-Hosting (Infomaniak, Swisscom o.ä.) | Hoch |
| Test- vs. Produktionsumgebung | Hoch |
| Geographische Erweiterung (Zentralschweiz) | Mittel |
| Automatische Marktdaten-Aktualisierung | Mittel |
| Echte Parzellenfläche (amtl. Vermessung) | Mittel |
| Mandantenspezifische Konfiguration | Mittel |

---

## Phase 4 — Skalierung (Zukunft)

**Zeitraum:** ab 2027
**Ziel:** Multi-Mandant Plattform

| Feature | Priorität |
|---------|-----------|
| Multi-Mandant (mehrere Kunden) | Hoch |
| Kanton Zürich hinzufügen | Hoch |
| Handänderungen-Daten (wo verfügbar) | Mittel |
| PowerPoint-Export Klientenpitch | Mittel |
| API für Drittsysteme | Niedrig |
| Mobile App / PWA | Niedrig |
| KI-basierte Lead-Priorisierung | Niedrig |

---

## Entscheidungslog

| Datum | Entscheidung | Begründung |
|-------|-------------|------------|
| 14.04.2026 | Kanton Zug als Pilotregion | Zielkunde sitzt in Zug, überschaubare Grösse |
| 14.04.2026 | Statische HTML-App (Prototyp) | Schnellster Weg zum funktionierenden MVP |
| 25.05.2026 | React + TypeScript + Tailwind | Professioneller Stack, wartbar, erweiterbar |
| 25.05.2026 | Projektname "K AG" | Platzhalter bis Firmengründung 1.10.2026 |
| 25.05.2026 | Kein Backend in Phase 2 | Frontend-Professionalisierung zuerst |
