# Projekt-Steckbrief — Leadmaschine Liegenschaften

## Übersicht

| Feld | Wert |
|------|------|
| Projektname | Leadmaschine Liegenschaften |
| Arbeitstitel Firma | K AG (wird vor 1.10.2026 finalisiert) |
| Eigentümer | Michael Katzlberger |
| Zielkunde | Immobilien AG (Entwicklung, Ausführung, Bewirtschaftung) |
| Projektstart | 14.04.2026 |
| Repository | https://github.com/Katz61/Immobilien-Radar-Aula |
| Aktueller Status | Phase 2 — Professionalisierung |

## Zweck

Die Leadmaschine identifiziert Liegenschaften mit Entwicklungspotenzial im Kanton Zug. Das Tool generiert eine priorisierte Lead-Liste für Immobilienentwickler, basierend auf öffentlich verfügbaren Daten.

## Kernfunktionen

1. **Gebiet-Scan** — Systematische Suche über ganze Gemeinden (Raster-basiert)
2. **Ausnützungsziffer (AZ)** — Berechnung der genutzten vs. erlaubten Geschossfläche
3. **Eigentümer-Analyse** — Zefix-Firmenabfrage + Heuristik (Erbengemeinschaft, Privatperson)
4. **Scoring** — Automatische Priorisierung (0-100 Punkte)
5. **Lead-Management** — Status-Tracking (Neu bis Erledigt), Notizen, Filterfunktionen
6. **Renditekalkulator** — 3 Szenarien (Sanierung, Aufstockung, Neubau)
7. **Export** — CSV mit allen Feldern, PDF-Report pro Objekt

## Zielgruppe

| Rolle | Nutzen |
|-------|--------|
| Immobilienentwickler | Grundstücke mit ungenutzter Ausnützung finden |
| Akquisiteur | Lead-Liste mit Eigentümer-Hinweisen bearbeiten |
| Geschäftsleitung | Marktanalysen und Renditeberechnungen für Investitionsentscheide |

## Datenquellen

| Quelle | Daten | Zugang |
|--------|-------|--------|
| geo.admin.ch | Gebäuderegister (GWR), Parzellen, amtliche Vermessung | Öffentlich, API |
| Zefix (ld.admin.ch) | Firmensuche (CHE-UID, Rechtsform) | Öffentlich, SPARQL |
| geodienste.ch | Zonenplan-Daten (Nutzungsplanung) | Öffentlich, OGC API |
| sonnendach.ch | Solarpotenzial Dachflächen | Öffentlich, API |
| RealAdvisor | Immobilienpreise pro Gemeinde | Manuell erfasst |
| Comparis | Verkaufspreise pro Gemeinde | Manuell erfasst |
| immobilienindex.ch | Bauland-/Bodenpreise | Manuell erfasst |

## Geographischer Scope

- **Aktuell:** Kanton Zug (11 Gemeinden)
- **Geplant:** Zentralschweiz + Kanton Zürich (nach Kundenfeedback)
- Kernquellen (geo.admin.ch, Zefix, sonnendach.ch) funktionieren schweizweit

## Bekannte Einschränkungen

- Eigentümerdaten nicht bulk-abrufbar (Schweizer Grundbuch: pro Objekt, gegen Gebühr)
- Zefix identifiziert nur juristische Personen, nicht Privatpersonen
- AZ-Berechnung basiert auf Gebäudegrundfläche (echte Parzellenfläche wäre präziser)
- Marktdaten manuell gepflegt (kein automatischer Datenabzug)

## Wettbewerb

| Anbieter | Positionierung | Abgrenzung |
|----------|---------------|------------|
| Popety.io | Schweizer Startup, Fokus Romandie | Kein Fokus Zentralschweiz |
| Wüest Partner / IAZI | Bewertungstools, 5-stellige Lizenzen | Kein Lead-Fokus |
| Fahrländer Partner | Marktanalysen | Kein operatives Lead-Tool |
| ReMatch360 | Marktanalysen | Kein Fokus auf ungenutzte Ausnützung |

Die Leadmaschine ist in der Nische "Kanton Zug + AZ-basierte Lead-Generierung" einzigartig positioniert.

## Betriebsmodell

- **Entwicklung:** Devin (Test-Umgebung, ohne Kundendaten)
- **Hosting:** Schweizer Hosting (geplant)
- **Bereitstellung:** Tool wird dem Zielkunden (Immobilien AG) zur Verfügung gestellt
- **Datenhaltung:** Aktuell localStorage (Browser), geplant: Server-seitige Datenbank
