# Roadmap: K AG Foresight Radar

## Phase 1 — Prototyp (aktuell)

**Status:** In Arbeit | **Aufwand:** ~3 Tage

| Schritt | Beschreibung | Status |
|---------|-------------|--------|
| 1.1 | D3.js Radar-Visualisierung (19 Felder, 4 Zonen, 5 Cluster) | Fertig |
| 1.2 | Scoring-Engine (5 Dimensionen, gewichteter Durchschnitt) | Fertig |
| 1.3 | Dashboard mit KPIs und Charts | Fertig |
| 1.4 | Cluster-Ansicht | Fertig |
| 1.5 | Handlungsfeld-Detailseiten | Fertig |
| 1.6 | Methodik-Tab | Fertig |
| 1.7 | Light + Dark Mode | Fertig |
| 1.8 | Projektdokumentation (4 Docs) | Fertig |
| 1.9 | PR und Review | In Arbeit |

**Ergebnis:** Funktionsfähiger Prototyp mit Demo-Daten. Einsetzbar für Präsentationen und erste Kundengespräche.

## Phase 2 — Realtime-Daten (~8–12 Tage)

| Schritt | Beschreibung | Aufwand |
|---------|-------------|---------|
| 2.1 | Backend-API (Node.js oder Python) | 2–3 Tage |
| 2.2 | Google Trends Integration (Velocity) | 1–2 Tage |
| 2.3 | arXiv API Integration (Velocity) | 1 Tag |
| 2.4 | News/GDELT API Integration (Impact Depth) | 1–2 Tage |
| 2.5 | LinkedIn/Indeed Scraping (Talent Signal) | 1–2 Tage |
| 2.6 | Automatische Score-Berechnung | 1 Tag |
| 2.7 | PostgreSQL für Zeitverlaufsdaten | 1 Tag |

**Ergebnis:** Scores werden automatisch aus öffentlichen Datenquellen berechnet. Manuelle Bewertung bleibt als Fallback.

## Phase 3 — Produktionsreife (~5–7 Tage)

| Schritt | Beschreibung | Aufwand |
|---------|-------------|---------|
| 3.1 | Schweizer Hosting (Datenschutzkonform) | 1–2 Tage |
| 3.2 | Crunchbase/PitchBook Integration (Market Pull) | 1–2 Tage |
| 3.3 | Eigene Umfrage-Integration (Readiness Gap) | 1 Tag |
| 3.4 | PDF-Export für Kunden-Reports | 1 Tag |
| 3.5 | Branding und finale UI-Anpassungen | 1 Tag |

**Ergebnis:** Produktionsreifes Tool mit vollem Daten-Pipeline. Einsetzbar für Mandanten.

## Phase 4 — Mandanten-Portal (optional, ~10–15 Tage)

| Schritt | Beschreibung | Aufwand |
|---------|-------------|---------|
| 4.1 | Mandanten-Login (Auth0) | 2–3 Tage |
| 4.2 | Mandanten-spezifische Radar-Ansichten | 3–4 Tage |
| 4.3 | Vergleichsfunktion (Branche vs. Mandant) | 2–3 Tage |
| 4.4 | Workshop-Modus (interaktive Bewertung) | 3–4 Tage |

**Ergebnis:** Kunden können ihr eigenes Radar sehen und sich mit der Branche vergleichen. Workshop-Modus für Beratungsmandate.

## Gesamtaufwand

| Phase | Aufwand | Abhängigkeit |
|-------|---------|-------------|
| Phase 1 | ~3 Tage | Keine |
| Phase 2 | ~8–12 Tage | API-Keys für Datenquellen |
| Phase 3 | ~5–7 Tage | Hosting-Entscheid, Phase 2 |
| Phase 4 | ~10–15 Tage | Phase 3, Mandanten-Anforderungen |
| **Total** | **~26–37 Tage** | |
