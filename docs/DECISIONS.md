# Entscheidungsregister — Leadmaschine Liegenschaften

Jede relevante Entscheidung wird hier mit Begründung festgehalten.

| # | Datum | Entscheidung | Begründung | Freigabe |
|---|-------|-------------|------------|----------|
| E-001 | 14.04.2026 | Kanton Zug als Pilotregion | Zielkunde sitzt in Zug, 11 Gemeinden = überschaubarer Scope zum Validieren | Michael |
| E-002 | 14.04.2026 | AZ-Lookup basiert auf Bauordnung Stadt Zug §36 | Offizielle AZ-Daten sind nicht digital verfügbar. Bauordnung als beste öffentliche Quelle. Einschränkung: Gilt nur für Stadt Zug, andere Gemeinden haben andere Werte. | Michael |
| E-003 | 14.04.2026 | Parzellenfläche wird geschätzt (Gebäudefläche × 4) | Amtliche Parzellenfläche ist über öffentliche API nicht direkt abrufbar. Faktor 4 als pragmatische Näherung. | Michael |
| E-004 | 14.04.2026 | Marktdaten manuell eingepflegt | RealAdvisor, Comparis und immobilienindex.ch bieten keine API. Preise werden manuell übernommen und mit Quellenangabe + Stand versehen. | Michael |
| E-005 | 25.05.2026 | Neustart als React + TypeScript + Tailwind CSS | 2740-Zeilen Single-File HTML ist nicht wartbar. Modularer Aufbau nötig für Erweiterung und Übergabe an Kunden. | Michael |
| E-006 | 25.05.2026 | Zustand statt Redux | Leichtgewichtiger, weniger Boilerplate, ausreichend für Client-only State. Redux wäre Overkill ohne Backend. | Devin |
| E-007 | 25.05.2026 | Kein Backend in Phase 2 | Erst Frontend professionalisieren. Backend (Node.js + PostgreSQL) kommt in Phase 3 wenn der Kunde eingebunden wird. | Michael |
| E-008 | 25.05.2026 | Projektname "K AG" als Platzhalter | Firma wird per 1.10.2026 gegründet, bis dahin braucht es einen neutralen Projektnamen. | Michael |
| E-009 | 25.05.2026 | localStorage für Leads-Persistenz | Reicht für Single-User Phase 2. Wird in Phase 3 durch PostgreSQL abgelöst. | Devin |
| E-010 | 25.05.2026 | "Integralis" darf nirgends erscheinen | Firmenname ist nicht öffentlich vor 1.10.2026. Alle Referenzen entfernt. | Michael |
