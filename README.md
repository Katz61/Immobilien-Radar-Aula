# Risikomanagement-Tool — KMU Schweiz

Interaktives Risikomanagement-Tool für ein Schweizer Bauunternehmen, basierend auf dem originalen Risikoregister «Übersicht Risikomanagement — Überprüfung und Beurteilung der Geschäftsrisiken».

## Live-Demo

👉 [GitHub Pages Link nach Deployment einfügen]

## Features

- **Dashboard** — KPI-Übersicht, Konsequenz-Verteilung, schwere Risiken auf einen Blick
- **Externe Aspekte (1.1–1.5)** — Staat, Wirtschaft, Markt, Interessensgruppen, Existenzrisiken
- **Interne Aspekte (2.1–2.6)** — Organisation, Mitarbeiter, Akquisition, Qualität, Recht, Finanzen
- **Marktlage** — UBS SREBI Q3/2025 & The Market Chart Pack #271 (Mai 2026) integriert
- **KI-Analyse** — Claude analysiert das Risikoprofil mit aktuellen Marktdaten (eigener API-Key erforderlich)

## Projektstruktur

```
risikomanagement/
├── index.html          # Hauptdatei
├── css/
│   └── style.css       # Stylesheet (Light + Dark Mode)
├── js/
│   └── app.js          # Logik, Charts, KI-Analyse
├── data/
│   └── risks.js        # Risikoregister (alle 51 Risiken)
└── README.md
```

## Deployment auf GitHub Pages

### Option A — Automatisch (empfohlen)

1. Repository auf GitHub erstellen (z.B. `risikomanagement`)
2. Alle Dateien hochladen
3. `Settings` → `Pages` → Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Nach ~1 Minute ist das Tool unter `https://[username].github.io/risikomanagement` erreichbar

### Option B — Mit GitHub CLI

```bash
git init
git add .
git commit -m "Initial commit: Risikomanagement-Tool"
git remote add origin https://github.com/[username]/risikomanagement.git
git push -u origin main
```

Dann GitHub Pages wie oben aktivieren.

## KI-Analyse einrichten

Die KI-Analyse benötigt einen Anthropic API-Key:

1. Account unter [console.anthropic.com](https://console.anthropic.com) erstellen
2. API-Key generieren (`sk-ant-...`)
3. Im Tool unter «KI-Analyse» einfügen

Der Key wird **nur lokal** im Browser verwendet und nicht gespeichert.

## Marktdaten aktualisieren

Die Marktdaten befinden sich in `index.html` (Market Banner) und `js/app.js` (AI-Prompt).  
Für Updates einfach die Werte im entsprechenden Abschnitt anpassen.

## Technologie

- **Vanilla HTML/CSS/JavaScript** — keine Build-Tools, keine Dependencies
- **Chart.js 4.4.1** — via CDN (cdnjs.cloudflare.com)
- **Anthropic Claude API** — für KI-Analyse (claude-sonnet-4-20250514)
- **Light + Dark Mode** — automatisch via `prefers-color-scheme`

## Risikodaten

Das Register basiert auf dem originalen Dokument «Übersicht Risikomanagement» und enthält:

| Bereich | Anzahl Risiken |
|---------|---------------|
| 1. Externe Aspekte | 29 |
| 2. Interne Aspekte | 22 |
| **Total** | **51** |

Konsequenz-Verteilung: **Schwer** (orange) · **Mittel** (gelb) · **Gering** (grün)

---

*Letzte Aktualisierung: Mai 2026*
