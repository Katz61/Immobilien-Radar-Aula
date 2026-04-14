# Integralis — Liegenschafts-Lead Engine

Vollautomatisierte Maschine zur Entdeckung von Immobilien-Leads mit echten Schweizer Geodaten.

## Features

- **Interaktive Swisstopo-Karte** — Offizielle Schweizer Landeskarte mit Parzellengrenzen
- **Echte Gebäudedaten** — Direkt aus dem Gebäude- und Wohnungsregister (GWR) via geo.admin.ch
- **Parzellendaten** — Amtliche Vermessung mit EGRID, Parzellennummer, Kanton
- **Gebäude-Details** — Baujahr, Fläche, Geschosse, Wohnungen, Heizung, Energieträger
- **Automatischer Gebiet-Scan** — Alle 11 Gemeinden im Kanton Zug systematisch scannen
- **Lead-Scoring** — Automatische Bewertung nach Alter, Fläche, Potenzial
- **CSV-Export** — Alle Leads als CSV exportieren (Semikolon-getrennt, Excel-kompatibel)
- **Direkt-Links** — ZugMap, ÖREB-Kataster, Zefix (Firmensuche), map.geo.admin.ch

## Datenquellen (alle öffentlich & kostenlos)

| Quelle | API | Daten |
|--------|-----|-------|
| [geo.admin.ch](https://api3.geo.admin.ch) | REST/WMS | Parzellen, Gebäude, Karten |
| [GWR](https://www.housing-stat.ch) | via geo.admin.ch | Baujahr, Fläche, Heizung, etc. |
| [Swisstopo](https://www.swisstopo.admin.ch) | WMS | Landeskarte (Hintergrundkarte) |
| [Zefix](https://www.zefix.admin.ch) | Web-Link | Firmen-Eigentümer |
| [ÖREB-Kataster](https://www.cadastre.ch) | Web-Link | Öffentlich-rechtliche Eigentumsbeschränkungen |
| [ZugMap](https://zugmap.ch) | Web-Link | Kantonale Geodaten Zug |

## Verwendung

1. **Adresse suchen** — Tippe eine Adresse ein und wähle ein Ergebnis
2. **Auf Karte klicken** — Klicke auf ein beliebiges Grundstück auf der Karte
3. **Gebiet scannen** — Wähle eine Gemeinde und starte den automatischen Scan
4. **Leads speichern** — Speichere interessante Objekte als Leads
5. **CSV exportieren** — Exportiere alle Leads für die Weiterverarbeitung

## Technologie

Reine Frontend-Anwendung (HTML/CSS/JavaScript) — kein Backend nötig. Alle Daten werden direkt von den öffentlichen Schweizer APIs abgerufen.

- [Leaflet](https://leafletjs.com) — Interaktive Karte
- [Swisstopo WMS](https://wms.geo.admin.ch) — Kartendarstellung
- [geo.admin.ch API](https://api3.geo.admin.ch) — Geodaten-Abfragen

## Fokus

Kanton Zug (Pilot) — alle 11 Gemeinden: Zug, Baar, Cham, Steinhausen, Risch, Hünenberg, Menzingen, Neuheim, Oberägeri, Unterägeri, Walchwil.
