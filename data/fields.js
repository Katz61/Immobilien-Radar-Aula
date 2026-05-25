/* =============================================================
   fields.js — K AG Foresight Radar
   19 Handlungsfelder in 5 Clustern
   5 Bewertungsdimensionen, 4 Zonen
   ============================================================= */

/* ── Cluster-Definitionen ─────────────────────────────────────── */
const CLUSTERS = [
  { key: 'intelligent-enterprise', label: 'Intelligent Enterprise', desc: 'KI, Daten und digitale Geschäftsmodelle', color: '#6A1B9A' },
  { key: 'workforce-evolution',    label: 'Workforce Evolution',    desc: 'Arbeitswelt, Talente und Kompetenzen',     color: '#00838F' },
  { key: 'governance-trust',       label: 'Governance & Trust',     desc: 'Sicherheit, Regulierung, Nachhaltigkeit', color: '#2E7D32' },
  { key: 'org-agility',            label: 'Organizational Agility', desc: 'Veränderungsfähigkeit und Strukturen',    color: '#E65100' },
  { key: 'human-centricity',       label: 'Human Centricity',       desc: 'Führung, Gesundheit, Vielfalt',           color: '#AD1457' }
];

/* ── Handlungsfelder ──────────────────────────────────────────── */
const FIELDS = [
  // ── Cluster: Intelligent Enterprise ───────────────────────────
  {
    id: 1,
    name: 'AI Strategy',
    desc: 'Künstliche Intelligenz strategisch einsetzen',
    cluster: 'intelligent-enterprise',
    scores: {
      velocity:  92,
      impact:    95,
      market:    88,
      talent:    90,
      readiness: 78
    },
    trend: [65, 72, 78, 84, 89, 92],
    insight: 'Generative AI hat 2025/26 alle Branchen erfasst. Unternehmen ohne KI-Strategie verlieren messbar an Wettbewerbsfähigkeit. Google Trends: +340% Suchvolumen seit 2023. Gleichzeitig fehlt es an Umsetzungskompetenz — die Readiness Gap ist erheblich.'
  },
  {
    id: 2,
    name: 'Data-Driven Decision Making',
    desc: 'Datenbasierte Entscheidungen treffen',
    cluster: 'intelligent-enterprise',
    scores: {
      velocity:  72,
      impact:    70,
      market:    68,
      talent:    65,
      readiness: 55
    },
    trend: [55, 58, 62, 65, 68, 72],
    insight: 'KI-Tools demokratisieren datenbasierte Entscheidungen. Auch KMU können jetzt ohne Data-Science-Team datengetrieben arbeiten. Die Herausforderung liegt bei der Datenqualität, nicht bei der Technologie.'
  },
  {
    id: 3,
    name: 'Digital Transformation',
    desc: 'Digitale Geschäftsmodelle entwickeln',
    cluster: 'intelligent-enterprise',
    scores: {
      velocity:  78,
      impact:    82,
      market:    75,
      talent:    70,
      readiness: 62
    },
    trend: [68, 72, 74, 76, 78, 80],
    insight: 'Digitale Transformation ist kein Projekt mehr, sondern Dauerzustand. Der Fokus verschiebt sich von «digital werden» zu «digital optimieren». Wer jetzt nicht digitale Geschäftsmodelle hat, wird sie auch mit KI nicht retten.'
  },

  // ── Cluster: Workforce Evolution ──────────────────────────────
  {
    id: 4,
    name: 'Future of Work',
    desc: 'Arbeitsmodelle der Zukunft gestalten',
    cluster: 'workforce-evolution',
    scores: {
      velocity:  65,
      impact:    68,
      market:    72,
      talent:    75,
      readiness: 50
    },
    trend: [58, 60, 62, 64, 66, 68],
    insight: 'Hybrid Work ist Standard. Die 4-Tage-Woche wird in der Schweiz pilotiert. KI verändert Jobprofile fundamental — nicht in 10 Jahren, sondern jetzt. Die meisten Firmen reagieren statt zu gestalten.'
  },
  {
    id: 5,
    name: 'Talent Acquisition & Retention',
    desc: 'Fachkräfte gewinnen und halten',
    cluster: 'workforce-evolution',
    scores: {
      velocity:  50,
      impact:    62,
      market:    58,
      talent:    68,
      readiness: 42
    },
    trend: [48, 50, 52, 54, 55, 55],
    insight: 'Fachkräftemangel bleibt akut in der Schweiz. Aber KI verändert die Gleichung: Einige Positionen werden obsolet, KI-Spezialisten sind noch schwerer zu finden. Recruiting-Strategien von 2020 funktionieren nicht mehr.'
  },
  {
    id: 6,
    name: 'Employee Experience',
    desc: 'Mitarbeitererlebnis ganzheitlich gestalten',
    cluster: 'workforce-evolution',
    scores: {
      velocity:  52,
      impact:    55,
      market:    60,
      talent:    58,
      readiness: 45
    },
    trend: [42, 45, 48, 52, 55, 58],
    insight: 'Employee Experience wird durch den Fachkräftemangel strategisch relevanter. Aber viele Firmen verwechseln Obstkorb und Tischfussball mit echter Employee Experience. Es geht um sinnvolle Arbeit, nicht um Perks.'
  },
  {
    id: 7,
    name: 'Learning & Development',
    desc: 'Kompetenzen systematisch aufbauen',
    cluster: 'workforce-evolution',
    scores: {
      velocity:  55,
      impact:    60,
      market:    52,
      talent:    62,
      readiness: 38
    },
    trend: [40, 42, 45, 48, 50, 52],
    insight: 'Reskilling ist die grösste Herausforderung der KI-Transformation. 60% aller Arbeitnehmenden brauchen bis 2027 neue Skills (WEF). Die meisten Weiterbildungsprogramme sind aber noch auf die alte Welt ausgerichtet.'
  },

  // ── Cluster: Governance & Trust ───────────────────────────────
  {
    id: 8,
    name: 'Cybersecurity',
    desc: 'IT-Sicherheit und Cyberabwehr',
    cluster: 'governance-trust',
    scores: {
      velocity:  88,
      impact:    92,
      market:    85,
      talent:    82,
      readiness: 60
    },
    trend: [70, 74, 78, 82, 86, 88],
    insight: 'Cyberangriffe nehmen exponentiell zu. Ransomware-Schäden 2025: $30 Mrd. global. Schweizer KMU unterschätzen das Risiko systematisch. Die Readiness Gap ist alarmierend — die meisten Firmen sind schlecht vorbereitet.'
  },
  {
    id: 9,
    name: 'Regulatory Compliance',
    desc: 'Regulatorische Anforderungen umsetzen',
    cluster: 'governance-trust',
    scores: {
      velocity:  70,
      impact:    72,
      market:    65,
      talent:    55,
      readiness: 48
    },
    trend: [40, 45, 50, 55, 62, 68],
    insight: 'EU AI Act, NIS2, DORA, nDSG — die Regulierungswelle ist real und betrifft auch Schweizer Firmen mit EU-Kunden. Compliance wird zum Wettbewerbsfaktor: Wer es hat, bekommt den Auftrag.'
  },
  {
    id: 10,
    name: 'Sustainability & ESG',
    desc: 'Nachhaltigkeit und Governance',
    cluster: 'governance-trust',
    scores: {
      velocity:  32,
      impact:    45,
      market:    35,
      talent:    28,
      readiness: 40
    },
    trend: [55, 50, 45, 42, 38, 35],
    insight: 'ESG hat den Hype-Zyklus durchlaufen. Die Begeisterung ist weg, die regulatorischen Anforderungen bleiben. Pragmatische Umsetzung statt Idealismus ist gefragt. Viele Firmen reduzieren ihre ESG-Teams.'
  },

  // ── Cluster: Organizational Agility ───────────────────────────
  {
    id: 11,
    name: 'Change Management',
    desc: 'Veränderungsfähigkeit aufbauen',
    cluster: 'org-agility',
    scores: {
      velocity:  58,
      impact:    62,
      market:    65,
      talent:    52,
      readiness: 48
    },
    trend: [50, 52, 55, 58, 60, 62],
    insight: 'Change Management gewinnt durch die KI-Transformation wieder an Relevanz. Aber das klassische Kotter-Modell reicht nicht mehr. Veränderung passiert schneller, als Change-Programme hinterherkommen.'
  },
  {
    id: 12,
    name: 'Agile Organization',
    desc: 'Organisationsstrukturen flexibilisieren',
    cluster: 'org-agility',
    scores: {
      velocity:  42,
      impact:    48,
      market:    38,
      talent:    35,
      readiness: 45
    },
    trend: [58, 55, 50, 48, 44, 45],
    insight: 'Agilität hat sich normalisiert. Der Hype ist vorbei, und das ist gut so. Viele Firmen sind «agile enough». Der Fokus verschiebt sich auf gezielte Agilität dort, wo sie Wert schafft.'
  },
  {
    id: 13,
    name: 'Innovation Management',
    desc: 'Innovationsprozesse steuern',
    cluster: 'org-agility',
    scores: {
      velocity:  45,
      impact:    52,
      market:    42,
      talent:    40,
      readiness: 38
    },
    trend: [50, 48, 47, 46, 47, 48],
    insight: 'Klassisches Innovationsmanagement wird durch KI-gestützte Prototyping-Tools herausgefordert. Schnelle Experimente ersetzen lange Innovationszyklen. Innovation Labs ohne Output werden geschlossen.'
  },
  {
    id: 14,
    name: 'Operating Model',
    desc: 'Betriebsmodell grundlegend überdenken',
    cluster: 'org-agility',
    scores: {
      velocity:  48,
      impact:    55,
      market:    42,
      talent:    38,
      readiness: 32
    },
    trend: [30, 33, 36, 38, 42, 45],
    insight: 'KI erzwingt neue Betriebsmodelle. Wer nur Prozesse digitalisiert, verpasst den Wandel. Die Frage ist nicht «Wie machen wir dasselbe effizienter?» sondern «Was sollten wir ganz anders machen?»'
  },

  // ── Cluster: Human Centricity ─────────────────────────────────
  {
    id: 15,
    name: 'Leadership Development',
    desc: 'Führung im KI-Zeitalter entwickeln',
    cluster: 'human-centricity',
    scores: {
      velocity:  40,
      impact:    55,
      market:    48,
      talent:    52,
      readiness: 35
    },
    trend: [45, 44, 44, 45, 46, 48],
    insight: 'Führung im KI-Zeitalter erfordert technisches Verständnis als Kernkompetenz. Die meisten Führungskräfte-Programme sind noch auf Soft Skills fixiert und ignorieren, dass ihre Leute KI-Tools besser verstehen als sie.'
  },
  {
    id: 16,
    name: 'Wellbeing & Mental Health',
    desc: 'Psychische Gesundheit am Arbeitsplatz',
    cluster: 'human-centricity',
    scores: {
      velocity:  28,
      impact:    40,
      market:    38,
      talent:    35,
      readiness: 42
    },
    trend: [35, 36, 36, 35, 34, 35],
    insight: 'Wellbeing bleibt wichtig, wird aber weniger als eigenständiges Thema behandelt. Integration in Employee Experience und Future of Work. Als Einzelthema verliert es an Zugkraft in der C-Suite.'
  },
  {
    id: 17,
    name: 'Diversity, Equity & Inclusion',
    desc: 'Vielfalt und Inklusion umsetzen',
    cluster: 'human-centricity',
    scores: {
      velocity:  20,
      impact:    32,
      market:    25,
      talent:    28,
      readiness: 30
    },
    trend: [45, 40, 35, 30, 26, 22],
    insight: 'DEI verliert global an Momentum. US-Backlash strahlt nach Europa aus. In der Schweiz regulatorisch relevant, aber strategische Priorität sinkt bei den meisten Firmen. Wer es ernst meint, macht es leise.'
  },
  {
    id: 18,
    name: 'Ecosystem Management',
    desc: 'Partnernetzwerke aufbauen und steuern',
    cluster: 'human-centricity',
    scores: {
      velocity:  25,
      impact:    38,
      market:    28,
      talent:    22,
      readiness: 20
    },
    trend: [18, 20, 22, 24, 26, 28],
    insight: 'Plattform-Ökosysteme gewinnen an Bedeutung. Isolierte Lösungen werden durch vernetzte Systeme abgelöst. Noch in früher Phase — die meisten Schweizer KMU denken nicht in Ökosystemen.'
  },
  {
    id: 19,
    name: 'Human-AI Collaboration',
    desc: 'Zusammenarbeit Mensch und Maschine gestalten',
    cluster: 'human-centricity',
    scores: {
      velocity:  35,
      impact:    45,
      market:    32,
      talent:    40,
      readiness: 18
    },
    trend: [10, 14, 18, 24, 30, 35],
    insight: 'Je digitaler die Arbeitswelt, desto wichtiger wird die Frage: Wie arbeiten Mensch und KI zusammen? Nicht als philosophische Frage, sondern als konkretes Organisationsdesign. Noch kaum jemand hat darauf eine Antwort.'
  }
];

/* ── Bewertungsdimensionen ────────────────────────────────────── */
const DIMENSIONS = [
  { key: 'velocity',  label: 'Velocity',      desc: 'Wie schnell verändert sich dieses Feld? Gemessen an Suchvolumen-Wachstum, Paper-Frequenz und Nachrichtenzyklen.',     weight: 0.20 },
  { key: 'impact',    label: 'Impact Depth',   desc: 'Wie tief greift die Veränderung in bestehende Strukturen ein? Betrifft sie nur Prozesse oder ganze Geschäftsmodelle?', weight: 0.25 },
  { key: 'market',    label: 'Market Pull',    desc: 'Wie stark ist die Nachfrage? Gemessen an Investitionen, Konferenz-Agendas und Kundennachfrage.',                      weight: 0.20 },
  { key: 'talent',    label: 'Talent Signal',  desc: 'Wie stark verändert sich der Arbeitsmarkt in diesem Feld? Gemessen an Stelleninseraten und Skill-Nachfrage.',          weight: 0.15 },
  { key: 'readiness', label: 'Readiness Gap',  desc: 'Wie gross ist die Kluft zwischen Dringlichkeit und tatsächlicher Umsetzung? Hoher Wert = grosse Lücke.',              weight: 0.20 }
];

/* ── Zonen ─────────────────────────────────────────────────────── */
const ZONES = [
  { key: 'ACT',     label: 'ACT',     min: 75, max: 100, color: '#C62828', colorLight: '#FFEBEE', desc: 'Sofort handeln. Wer jetzt nicht reagiert, verliert den Anschluss.' },
  { key: 'PREPARE', label: 'PREPARE', min: 50, max: 74,  color: '#E65100', colorLight: '#FFF3E0', desc: 'Strategisch vorbereiten. Konzepte entwickeln, Ressourcen bereitstellen.' },
  { key: 'MONITOR', label: 'MONITOR', min: 25, max: 49,  color: '#1565C0', colorLight: '#E3F2FD', desc: 'Aktiv beobachten. Entwicklungen verfolgen, intern Wissen aufbauen.' },
  { key: 'SCAN',    label: 'SCAN',    min: 0,  max: 24,  color: '#546E7A', colorLight: '#ECEFF1', desc: 'Auf dem Radar behalten. Schwache Signale registrieren, keine Sofortaktion nötig.' }
];

/* ── Zeitachse ─────────────────────────────────────────────────── */
const TREND_LABELS = ['Jan 25', 'Apr 25', 'Jul 25', 'Okt 25', 'Jan 26', 'Mai 26'];
