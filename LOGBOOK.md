# Projekt-Logbuch — Leadmaschine Liegenschaften

> Eigentümer: K AG (Projektname, wird vor 1.10.2026 finalisiert)
> Zielkunde: Immobilien AG (Entwicklung, Ausführung, Bewirtschaftung)
> Repository: https://github.com/Katz61/Immobilien-Radar-Aula

---

## Eintrag #1 — 14.04.2026

**Aktivität:** Prototyp v1.0 erstellt (Session 1)
**Session:** https://app.devin.ai/sessions/6c9e3cd0ea3646458157c02b9e680a94
**Branch:** `devin/1776171175-integralis-lead-engine`
**Status:** Abgeschlossen

**Was wurde gebaut:**
- Single-Page HTML-App (2740 Zeilen, kein Framework)
- Swisstopo-Karte mit Parzellengrenzen (Leaflet + WMS)
- Klick auf Karte: EGRID, Parzelle, Gebäudedaten (GWR)
- Adress-Suche (geo.admin.ch)
- Gebiet-Scan über ganze Gemeinden (Raster-basiert)
- AZ-Berechnung (Ausnützungsziffer, Bauordnung Stadt Zug §36)
- Eigentümer-Typ Erkennung (Zefix SPARQL + Heuristik)
- Lead-Status / Mini-CRM (6 Stufen)
- Notizen pro Objekt
- Score-System (0-100, Farbkodierung)
- Renditekalkulator (3 Szenarien: Sanierung, Aufstockung, Neubau)
- CSV-Export, PDF-Report
- Sonnendach-Integration, ÖREB-Links, Grundbuch-Links
- Klientenpitch (pitch.html, 9 Slides PwC-Style)

**Datenquellen:** geo.admin.ch, Zefix (ld.admin.ch), geodienste.ch, sonnendach.ch, RealAdvisor, Comparis, immobilienindex.ch

**Geographischer Scope:** Kanton Zug (11 Gemeinden)

**Kosten:** $9.38 / ca. 9.5 Stunden / 15 Commits

**Entscheidungen:**
- Kanton Zug als Pilotregion gewählt
- AZ-Lookup basiert auf Bauordnung Stadt Zug (§36), nicht auf amtlicher Vermessung
- Parzellenfläche geschätzt (Gebäudefläche x 4 als Fallback)
- Marktdaten manuell eingepflegt (RealAdvisor Mai 2026, Comparis Mär 2024)

---

## Eintrag #2 — 25.05.2026

**Aktivität:** Projekt-Neustart als professionelles IT-Projekt
**Session:** https://app.devin.ai/sessions/cb43e0712003408b94e1e3bae899f8a6
**Branch:** `devin/1779703082-leadmaschine-v2`
**Status:** In Arbeit

**Entscheidungen:**
- Projektname: "K AG" (Platzhalter bis Firmengründung 1.10.2026)
- Zielkunde: Immobilien AG (Entwicklung, Ausführung, Bewirtschaftung)
- Alle Features aus Prototyp übernehmen
- Tech-Stack professionalisieren: Vite + React + TypeScript + Tailwind CSS + Zustand
- Code modular aufteilen (statt 1 HTML-Datei)
- Projekt-Logbuch führen (LOGBOOK.md + Devin Knowledge Note)
- Projektdokumentation erstellen (Steckbrief, Architektur, Roadmap)
- Devin arbeitet auf Test-Umgebung (ohne Kundendaten)
- Tool soll einer Firma zur Verfügung gestellt werden können

**Was wird gebaut:**
- Professionelle Projektstruktur mit Vite + React + TypeScript
- Modulare Architektur (Services, Components, Store, Types)
- Tailwind CSS für konsistentes Design
- Zustand für State Management
- Dokumentation: Steckbrief, Architektur, Roadmap

---

*Dieses Logbuch wird bei jeder Session fortgeführt.*
