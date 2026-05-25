# Architektur-Übersicht — Leadmaschine Liegenschaften

## Aktueller Stand (Phase 1 — Prototyp)

```
┌─────────────────────────────────────────────┐
│              Browser (Client)                │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Leaflet  │  │   UI     │  │ localStorage│ │
│  │  Karte    │  │  Sidebar │  │   (Leads)  │ │
│  └────┬─────┘  └────┬─────┘  └───────────┘  │
│       │              │                        │
│       └──────┬───────┘                        │
│              │                                │
└──────────────┼────────────────────────────────┘
               │ HTTPS (öffentliche APIs)
               ▼
┌──────────────────────────────────────────────┐
│           Öffentliche Datenquellen            │
│                                               │
│  geo.admin.ch    geodienste.ch   sonnendach.ch│
│  (GWR, Parzelle) (Zonenplan)    (Solar)      │
│                                               │
│  ld.admin.ch                                  │
│  (Zefix/SPARQL)                               │
└───────────────────────────────────────────────┘
```

**Merkmale Phase 1:**
- Alles im Browser (kein Backend)
- Daten in localStorage (geht verloren bei Browser-Wechsel)
- Keine Authentifizierung
- Single-User
- Einzel-HTML-Datei (2740 Zeilen)

## Phase 2 — Professionalisierung (aktuell)

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (SPA)                      │
│                                                      │
│  Vite + React + TypeScript + Tailwind CSS            │
│                                                      │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │   Map   │ │ Details  │ │  Scan  │ │   Leads   │  │
│  │Component│ │  Panel   │ │ Engine │ │ CRM Panel │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └─────┬─────┘  │
│       │           │           │             │         │
│       └─────┬─────┴───────────┴─────────────┘         │
│             │                                         │
│       ┌─────┴──────┐  ┌─────────────┐                │
│       │  Services  │  │   Zustand   │                │
│       │  (API)     │  │   Store     │                │
│       └─────┬──────┘  └─────────────┘                │
└─────────────┼─────────────────────────────────────────┘
              │ HTTPS
              ▼
┌──────────────────────────────────────────────┐
│           Öffentliche Datenquellen            │
└───────────────────────────────────────────────┘
```

**Merkmale Phase 2:**
- Modulare React-Komponenten
- TypeScript für Typsicherheit
- Zustand für State Management
- Tailwind CSS für konsistentes Design
- Daten weiterhin in localStorage
- Kein Backend (noch)

## Zielarchitektur (Phase 3 — Produktion)

```
┌───────────────────────────────────────────────────────────┐
│                    Kunde (Browser)                         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (SPA)                     │  │
│  │  Map │ Details │ Scan │ Leads/CRM │ Reports │ Admin  │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                   │
│                   CH-Hosting (z.B. Infomaniak, Swisscom)     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Auth   │  │   API    │  │  Scan    │  │  Export    │  │
│  │  (Login) │  │ Routes   │  │  Worker  │  │  (CSV/PDF) │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Datenbank                     │   │
│  │  Leads │ Scans │ Notizen │ Benutzer │ Mandanten      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬───────────────────────────────────────────────────┘
           │ HTTPS
           ▼
┌───────────────────────────────────────────────┐
│           Öffentliche Datenquellen             │
└────────────────────────────────────────────────┘
```

**Merkmale Phase 3:**
- CH-Hosting (Daten bleiben in der Schweiz)
- Multi-Mandant (mehrere Kunden möglich)
- Authentifizierung (Login pro Mandant)
- Server-seitige Datenhaltung (PostgreSQL)
- Background-Scan-Jobs (Worker)
- Test- und Produktionsumgebung getrennt
- API für Drittsysteme

## Technologie-Stack

| Schicht | Phase 2 (aktuell) | Phase 3 (geplant) |
|---------|-------------------|---------------------|
| Frontend | React + TypeScript + Tailwind | React + TypeScript + Tailwind |
| Build | Vite | Vite |
| State | Zustand | Zustand + React Query |
| Karte | Leaflet + Swisstopo WMS | Leaflet + Swisstopo WMS |
| Backend | Keins (Client-only) | Node.js + Express |
| Datenbank | localStorage | PostgreSQL |
| Auth | Keine | JWT / Session-basiert |
| Hosting | Devin Apps / GitHub Pages | CH-Host (Infomaniak o.ä.) |
| CI/CD | GitHub Actions | GitHub Actions |

## Modulstruktur (Phase 2)

```
src/
├── types/           # TypeScript-Typdefinitionen
│   └── index.ts     # Lead, Building, Zone, Solar, Owner, etc.
├── data/            # Statische Daten und Konfiguration
│   ├── gemeinden.ts # Gemeinde-Koordinaten und Bounding Boxes
│   ├── az-lookup.ts # Ausnützungsziffer-Tabellen (Bauordnung)
│   └── marktdaten.ts# Preise (RealAdvisor, Comparis, Boden)
├── services/        # API-Clients
│   ├── geo-admin.ts # geo.admin.ch (GWR, Parzellen, Suche)
│   ├── zefix.ts     # Zefix SPARQL (Firmensuche)
│   ├── geodienste.ts# geodienste.ch (Zonenplan)
│   └── solar.ts     # sonnendach.ch (Solarpotenzial)
├── utils/           # Hilfsfunktionen
│   ├── coordinates.ts# WGS84 ↔ LV95 Konvertierung
│   ├── decoders.ts  # GWR-Code Decoder (Gkat, Heizung, etc.)
│   └── scoring.ts   # Lead-Score Berechnung
├── store/           # State Management (Zustand)
│   └── useStore.ts  # Globaler App-State
├── components/      # React-Komponenten
│   ├── layout/      # Header, Sidebar, Layout
│   ├── map/         # Kartenkomponente
│   ├── details/     # Detail-Ansicht (Parzelle, Gebäude, AZ)
│   ├── leads/       # Lead-Liste, Filter, Status, Export
│   ├── scan/        # Scan-Konfiguration und -Steuerung
│   └── common/      # Buttons, Badges, Toast, etc.
└── App.tsx          # Hauptkomponente
```
