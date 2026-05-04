/* =============================================================
   risks.js — Originales Risikoregister (aus Dokument)
   Übersicht Risikomanagement — Überprüfung und Beurteilung
   der Geschäftsrisiken, Steuerung erforderlicher Massnahmen
   ============================================================= */

const EXT = [
  // ── 1.1 Staat und Gesellschaft ──────────────────────────────
  { grp:"1.1 Staat und Gesellschaft", name:"Gesetze und Verordnungen",                                          konseq:"Mittel",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },
  { grp:"1.1 Staat und Gesellschaft", name:"Verbandsvorschriften (SIA, SIGAB, SUVA, Gebäudehülle Schweiz)",    konseq:"Mittel",  verant:"VR/GL",    massnahme:"Mitglied in Verbänden, aktive Auseinandersetzung" },
  { grp:"1.1 Staat und Gesellschaft", name:"Umwelt und Energiepolitik (Nachhaltigkeit)",                        konseq:"Mittel",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },
  { grp:"1.1 Staat und Gesellschaft", name:"Bevölkerung / Migration",                                           konseq:"Mittel",  verant:"VR/GL",    massnahme:"Marktbeobachtung" },
  { grp:"1.1 Staat und Gesellschaft", name:"Steueraspekte",                                                     konseq:"Gering",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },

  // ── 1.2 Wirtschaft und Gesellschaft — Konjunktur ────────────
  { grp:"1.2 Wirtschaft und Gesellschaft — Konjunktur", name:"Inflation / Rezession",                           konseq:"Schwer",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Konjunktur", name:"Kaufkraft",                                       konseq:"Schwer",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Konjunktur", name:"Zinsentwicklung",                                 konseq:"Schwer",  verant:"VR/GL",    massnahme:"Aktive Auseinandersetzung" },

  // ── 1.2 Wirtschaft und Gesellschaft — Markt ─────────────────
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Fachkräftemangel",                                     konseq:"Schwer",  verant:"VR/GL",    massnahme:"Networking, Unternehmenskultur überdenken" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Marktstruktur",                                        konseq:"Schwer",  verant:"VR/GL",    massnahme:"Strategie \"Aula 4.0\" & Massnahmenplan" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Marktveränderungen",                                   konseq:"Schwer",  verant:"VR/GL",    massnahme:"Aktive Marktüberwachung, event. Angebot anpassen" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Produkt / Services",                                   konseq:"Schwer",  verant:"VR/GL",    massnahme:"Strategie \"Aula 4.0\" & Massnahmenplan" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Konkurrenz / Mitbewerber / Neulinge",                  konseq:"Mittel",  verant:"VR/GL",    massnahme:"Marktbeobachtung" },
  { grp:"1.2 Wirtschaft und Gesellschaft — Markt", name:"Marktpositionierung",                                  konseq:"Mittel",  verant:"VR/GL",    massnahme:"Strategie \"Aula 4.0\", event. Positionierung anpassen" },

  // ── 1.2 Kollaboration / Partner / externes Netzwerk ─────────
  { grp:"1.2 Kollaboration / Partner / externes Netzwerk", name:"Qualität Partner und Prozesse",                konseq:"Mittel",  verant:"VR/GL",    massnahme:"Qualitätskontrolle, frühzeitige Kommunikation" },
  { grp:"1.2 Kollaboration / Partner / externes Netzwerk", name:"Prozessrisiken",                               konseq:"Mittel",  verant:"VR/GL",    massnahme:"Netzwerk, Versicherung" },

  // ── 1.3 Interessensgruppen ───────────────────────────────────
  { grp:"1.3 Interessensgruppen — Behörden", name:"Behörden (allgemein)",                                       konseq:"—",       verant:"VR/GL",    massnahme:"Kontaktpflege" },
  { grp:"1.3 Interessensgruppen — Behörden", name:"Bewilligungsverfahren",                                      konseq:"Schwer",  verant:"GL",       massnahme:"Rechtzeitiger Einbezug aller Beteiligten" },
  { grp:"1.3 Interessensgruppen — Behörden", name:"Einsprachen / Rekurse",                                      konseq:"Schwer",  verant:"GL",       massnahme:"Rechtzeitiger Einbezug aller Beteiligten" },
  { grp:"1.3 Interessensgruppen — Gewerbe",  name:"Auftragsvergabe und Zusammenarbeit",                         konseq:"Mittel",  verant:"GL",       massnahme:"Selektion/Bewertung" },
  { grp:"1.3 Interessensgruppen",            name:"Geschäftspartner und weitere Stakeholder",                   konseq:"—",       verant:"GL",       massnahme:"Kontaktpflege" },
  { grp:"1.3 Interessensgruppen",            name:"Geldinstitute (Banken/Versicherungen)",                      konseq:"—",       verant:"GL",       massnahme:"Kontaktpflege" },

  // ── 1.4 Äussere Werte ────────────────────────────────────────
  { grp:"1.4 Äussere Werte", name:"Image / Renommée",                                                           konseq:"Mittel",  verant:"VR/GL",    massnahme:"Selbstreflexion, aktive Auseinandersetzung" },

  // ── 1.5 Existenzrisiken ──────────────────────────────────────
  { grp:"1.5 Existenzrisiken", name:"Pandemien / Epidemien",                                                    konseq:"Mittel",  verant:"GL",       massnahme:"Pandemieplan bei Bedarf erarbeiten" },
  { grp:"1.5 Existenzrisiken", name:"Cyber-Risiken",                                                            konseq:"Schwer",  verant:"GL",       massnahme:"Aktive Auseinandersetzung, Notfallplan, Versicherung" },
  { grp:"1.5 Existenzrisiken — Natur und Umwelt", name:"Baugrund (Beschaffenheit/Altlasten)",                   konseq:"Mittel",  verant:"GL",       massnahme:"Baugrundanalyse vorab/frühzeitig durchführen" },
  { grp:"1.5 Existenzrisiken — Natur und Umwelt", name:"Gefahrenkataster",                                      konseq:"Gering",  verant:"GL",       massnahme:"Baugrundanalyse vorab/frühzeitig durchführen" },
  { grp:"1.5 Existenzrisiken — Natur und Umwelt", name:"Wetter",                                                konseq:"Gering",  verant:"—",        massnahme:"Umdisponieren" },
  { grp:"1.5 Existenzrisiken — Katastrophen",     name:"Blitz / Feuer / Erdbeben / Sturm",                     konseq:"Mittel",  verant:"GL",       massnahme:"Bauzeitversicherung (Elementarschäden)" },
  { grp:"1.5 Existenzrisiken — Internationale Konflikte", name:"Spionage / Anschlag / Krieg",                  konseq:"Mittel",  verant:"GL",       massnahme:"Beobachtung" },
];

const INT = [
  // ── 2. Interne Aspekte — Unternehmenskultur ──────────────────
  { grp:"2. Interne Aspekte — Unternehmenskultur", name:"Unternehmenskultur",                                   konseq:"Mittel",  verant:"VR/GL",    massnahme:"Ext. Support, aktive Auseinandersetzung, Aula 4.0" },
  { grp:"2. Interne Aspekte — Unternehmenskultur", name:"Fehlende Transformation / \"Stillstand\"",             konseq:"Schwer",  verant:"VR/GL",    massnahme:"Ext. Support, aktive Auseinandersetzung, Aula 4.0" },
  { grp:"2. Interne Aspekte — Unternehmenskultur", name:"Strategie und deren Umsetzung",                        konseq:"Mittel",  verant:"VR/GL",    massnahme:"Regelm. Strategieüberprüfung, aktive Umsetzung" },

  // ── 2.1 Organisation ─────────────────────────────────────────
  { grp:"2.1 Organisation", name:"Geschäftsrisiken",                                                            konseq:"Mittel",  verant:"VR/GL",    massnahme:"Visualisierung und entscheiden" },
  { grp:"2.1 Organisation", name:"Outsourcing von Fachbereichen",                                               konseq:"Mittel",  verant:"GL",       massnahme:"Qualitätskontrolle" },
  { grp:"2.1 Organisation", name:"Unternehmensstruktur/Aufbauorganisation",                                     konseq:"Mittel",  verant:"GL",       massnahme:"Kollaboration fachübergreifend, Kommunikation" },
  { grp:"2.1 Organisation", name:"Kernprozesse gemäss MHB",                                                     konseq:"Mittel",  verant:"GL",       massnahme:"SQS aktiv managen" },
  { grp:"2.1 Organisation — Führungsrhythmus", name:"Informationsprozesse/Sitzungsabfolge",                     konseq:"Mittel",  verant:"GL",       massnahme:"Direkte Kommunikation, Termintreue" },
  { grp:"2.1 Organisation — Führungsrhythmus", name:"Budgetierung und Rapportierung",                           konseq:"Mittel",  verant:"CFO",      massnahme:"IKS" },
  { grp:"2.1 Organisation — Führungsrhythmus", name:"int./ext. Kommunikation & Werbung",                        konseq:"Mittel",  verant:"GL",       massnahme:"Ext. Partner, aktive Auseinandersetzung" },

  // ── 2.2 Betriebsmittel und Ressourcen — Mitarbeiter ─────────
  { grp:"2.2 Betriebsmittel — Mitarbeiter und Kader", name:"Firmeninternes Wissen",                             konseq:"Mittel",  verant:"GL",       massnahme:"Weitergabe, Dokumentation (Protokolle)" },
  { grp:"2.2 Betriebsmittel — Mitarbeiter und Kader", name:"Denkhaltung / -weise",                              konseq:"Schwer",  verant:"GL",       massnahme:"Führungsaufgaben aktiv wahrnehmen" },
  { grp:"2.2 Betriebsmittel — Mitarbeiter und Kader", name:"Fluktuation",                                       konseq:"Mittel",  verant:"GL",       massnahme:"Aktive Mitarbeiterbindung, Netzwerken" },
  { grp:"2.2 Betriebsmittel — Mitarbeiter und Kader", name:"Kompetenzen / Fähigkeiten",                         konseq:"Mittel",  verant:"AL",       massnahme:"Stetige Entwicklung, Weiterbildung" },
  { grp:"2.2 Betriebsmittel",                         name:"Arbeitsinstrumente",                                konseq:"Mittel",  verant:"AL",       massnahme:"Laufende Aktualisierung" },
  { grp:"2.2 Betriebsmittel",                         name:"Datensicherheit / Archivierung",                    konseq:"Mittel",  verant:"GL/AL",    massnahme:"Qualitätskontrolle ext. Anbieter, Archiv, Cloud" },
  { grp:"2.2 Betriebsmittel",                         name:"Betriebs- und Anlagevermögen — Anlagerisiken",      konseq:"Mittel",  verant:"GL",       massnahme:"Betriebshaftpflicht, Immobilien-Bewertung" },

  // ── 2.3 Akquisition und Arbeitsauslastung ────────────────────
  { grp:"2.3 Akquisition und Arbeitsauslastung", name:"Akquisition",                                            konseq:"Schwer",  verant:"GL",       massnahme:"CRM, Zuständigkeit GL+VR ausweiten, strateg. Partnerschaften, ARGE" },
  { grp:"2.3 Akquisition und Arbeitsauslastung", name:"Projektentwicklung",                                     konseq:"Schwer",  verant:"LPE",      massnahme:"Aktive Umsetzung, Strategie" },
  { grp:"2.3 Akquisition und Arbeitsauslastung", name:"Kontinuierliche Arbeitsauslastung",                      konseq:"Mittel",  verant:"LPE",      massnahme:"Vorausschauende Planung" },

  // ── 2.4 Qualitätsmängel ──────────────────────────────────────
  { grp:"2.4 Qualitätsmängel", name:"Qualitätssicherung extern",                                                konseq:"Schwer",  verant:"LPA/LPE",  massnahme:"Qualitätskontrollen, Experten/Spezialisten" },
  { grp:"2.4 Qualitätsmängel", name:"Qualitätssicherung intern",                                                konseq:"Mittel",  verant:"LPA/LPE",  massnahme:"Aula Management System, 4-Augen-Prinzip" },

  // ── 2.5 Rechtsaspekte ────────────────────────────────────────
  { grp:"2.5 Rechtsaspekte", name:"Personenunfälle auf Baustelle",                                              konseq:"Schwer",  verant:"LPA",      massnahme:"Sicherheitskontrollen, Versicherungen, SiBe" },
  { grp:"2.5 Rechtsaspekte", name:"Arbeits- und Gesundheitsschutz Büro",                                        konseq:"Schwer",  verant:"SiBe",     massnahme:"Notfallhandbuch aktuell halten, Schulungen" },
  { grp:"2.5 Rechtsaspekte", name:"Baumängel, Sachschäden, Garantiefälle",                                      konseq:"Schwer",  verant:"LPA",      massnahme:"Bauwesenvers., Rückstellung, Erfüllungsgarantie" },
  { grp:"2.5 Rechtsaspekte", name:"Vertragswesen",                                                              konseq:"Mittel",  verant:"GL",       massnahme:"Rechtliche Prüfung, Haftungsausschlüsse prüfen" },

  // ── 2.6 Finanzen und Controlling ─────────────────────────────
  { grp:"2.6 Finanzen und Controlling", name:"Liquidität",                                                      konseq:"Mittel",  verant:"CFO",      massnahme:"Rollende und vorausschauende Liquiditäts-/Finanzplanung" },
  { grp:"2.6 Finanzen und Controlling", name:"Fremdfinanzierung — Kreditwürdigkeit/Kreditreserven",             konseq:"Mittel",  verant:"CEO/CFO",  massnahme:"Verlässlichkeit" },
  { grp:"2.6 Finanzen und Controlling", name:"Fremdfinanzierung — Hypotheken",                                  konseq:"Mittel",  verant:"CEO/CFO",  massnahme:"Zeitliche Staffelung" },
  { grp:"2.6 Finanzen und Controlling", name:"Eigenfinanzierung — Eigenkapital",                                konseq:"Gering",  verant:"VR",       massnahme:"—" },
  { grp:"2.6 Finanzen und Controlling", name:"Eigenfinanzierung — Ausschüttungspolitik",                        konseq:"Gering",  verant:"VR",       massnahme:"—" },
];
