/* =============================================================
   app.js — Risikomanagement-Tool Hauptlogik
   ============================================================= */

const ALL = [
  ...EXT.map(r => ({ ...r, aspekt: 'Extern' })),
  ...INT.map(r => ({ ...r, aspekt: 'Intern' }))
];

/* ---- BADGES ------------------------------------------------- */
function kBadge(k) {
  if (k === 'Schwer') return '<span class="badge-s">Schwer</span>';
  if (k === 'Mittel') return '<span class="badge-m">Mittel</span>';
  if (k === 'Gering') return '<span class="badge-g">Gering</span>';
  return '<span style="font-size:10px;color:var(--text3)">—</span>';
}

/* ---- NAVIGATION --------------------------------------------- */
document.querySelectorAll('.nb').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    btn.classList.add('active');
  });
});

/* ---- DATE --------------------------------------------------- */
const dateEl = document.getElementById('current-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('de-CH', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

/* ---- RENDER TABLE ------------------------------------------- */
function renderSectionTable(data, tbodyId) {
  let html = '';
  let lastGrp = '';
  data.forEach(r => {
    if (r.grp !== lastGrp) {
      html += `<tr><td colspan="4" class="group-header">${r.grp}</td></tr>`;
      lastGrp = r.grp;
    }
    html += `<tr>
      <td>${r.name}</td>
      <td>${kBadge(r.konseq)}</td>
      <td style="font-size:10px;color:var(--text2)">${r.verant}</td>
      <td style="font-size:10px;color:var(--text2)">${r.massnahme}</td>
    </tr>`;
  });
  document.getElementById(tbodyId).innerHTML = html;
}

/* ---- DASHBOARD ---------------------------------------------- */
function initDash() {
  const s = ALL.filter(r => r.konseq === 'Schwer').length;
  const m = ALL.filter(r => r.konseq === 'Mittel').length;
  const g = ALL.filter(r => r.konseq === 'Gering').length;

  document.getElementById('k-s').textContent = s;
  document.getElementById('k-m').textContent = m;
  document.getElementById('k-g').textContent = g;

  // Top risks
  const topRisks = ALL.filter(r => r.konseq === 'Schwer');
  document.getElementById('top-risks').innerHTML = topRisks.map(r => `
    <div class="top-risk-row">
      <span class="badge-s">Schwer</span>
      <span class="top-risk-name">${r.name}</span>
      <span class="top-risk-meta">${r.verant}</span>
      <span class="${r.aspekt === 'Extern' ? 'badge-e' : 'badge-i'}">${r.aspekt}</span>
    </div>`).join('');

  // Chart 1 — Doughnut
  new Chart(document.getElementById('c1'), {
    type: 'doughnut',
    data: {
      labels: ['Schwer', 'Mittel', 'Gering'],
      datasets: [{
        data: [s, m, g],
        backgroundColor: ['#E24B4A', '#EF9F27', '#63992A'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: { legend: { display: false } }
    }
  });

  // Chart 2 — Bar by section
  const sections = [
    { label: '1.1 Staat', filter: r => r.grp.startsWith('1.1') },
    { label: '1.2 Wirtschaft', filter: r => r.grp.startsWith('1.2') },
    { label: '1.3 Interessen', filter: r => r.grp.startsWith('1.3') },
    { label: '1.4–1.5 Existenz', filter: r => r.grp.startsWith('1.4') || r.grp.startsWith('1.5') },
    { label: '2. Kultur', filter: r => r.grp.startsWith('2. ') },
    { label: '2.1 Org.', filter: r => r.grp.startsWith('2.1') },
    { label: '2.2 Betr.', filter: r => r.grp.startsWith('2.2') },
    { label: '2.3 Akquis.', filter: r => r.grp.startsWith('2.3') },
    { label: '2.4 Qualität', filter: r => r.grp.startsWith('2.4') },
    { label: '2.5 Recht', filter: r => r.grp.startsWith('2.5') },
    { label: '2.6 Finanzen', filter: r => r.grp.startsWith('2.6') },
  ];

  new Chart(document.getElementById('c2'), {
    type: 'bar',
    data: {
      labels: sections.map(s => s.label),
      datasets: [{
        data: sections.map(s => ALL.filter(s.filter).length),
        backgroundColor: '#1a7fd4',
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 8 }, maxRotation: 45 } },
        y: { ticks: { stepSize: 1, font: { size: 9 } }, beginAtZero: true }
      }
    }
  });
}

/* ---- KI-ANALYSE --------------------------------------------- */
async function runAI() {
  const key = document.getElementById('api-key').value.trim();
  if (!key) {
    alert('Bitte geben Sie einen Anthropic API-Key ein.');
    return;
  }

  const btn = document.getElementById('ai-btn');
  const out = document.getElementById('ai-output');
  btn.disabled = true;
  btn.textContent = 'Analysiere...';
  out.textContent = 'Claude analysiert das Risikoregister mit aktuellen Marktdaten...\n';

  const schwere = ALL
    .filter(r => r.konseq === 'Schwer')
    .map(r => `- ${r.name} (${r.aspekt}, Verant: ${r.verant}): ${r.massnahme}`)
    .join('\n');

  const prompt = `Du bist Risikomanagement-Experte für ein Schweizer Bauunternehmen (KMU). Analysiere das folgende originale Risikoregister.

AKTUELLE MARKTDATEN (Quellen: UBS SREBI Q3/2025 & The Market Chart Pack #271, 4. Mai 2026):
- UBS Bubble Index: 0.29 (moderat) — Eigenheimpreise +3.5% real YoY
- SNB Leitzins: 0% — Frankenstärke EUR/CHF ~0.93
- Rohöl Brent: >$100/Fass — Energiekosten stark erhöht (Iran-Krieg)
- PMI Industrie Schweiz: 53.3 (noch expansiv, Frühindikatoren schwächer)
- Globales BIP: ~3.2% (rückläufig) — Risk Barometer: 54/100 (neutral)
- Schweizer Frühindikatoren (KOF, SECO): schwächen sich ab

SCHWERE RISIKEN AUS DEM ORIGINALEN RISIKOREGISTER:
${schwere}

Erstelle eine präzise Analyse auf Deutsch für VR und GL:

1. MARKTBEDINGTE VERSCHÄRFUNGEN
   Welche schweren Risiken werden durch aktuelle Marktdaten konkret verschärft oder entschärft?

2. TOP 3 SOFORTMASSNAHMEN (nächste 30 Tage)
   Spezifisch für ein Schweizer Bauunternehmen — konkret und umsetzbar

3. STRATEGISCHE PRIORITÄTEN (90 Tage)
   3 konkrete Punkte mit Verantwortlichkeit

4. FAZIT
   2 Sätze für die nächste VR-Sitzung

Max. 400 Wörter. Präzise, umsetzbar, VR-tauglich.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.error) {
      out.textContent = `API-Fehler: ${data.error.message}\n\nBitte API-Key prüfen.`;
    } else {
      out.textContent = data.content
        ?.filter(c => c.type === 'text')
        .map(c => c.text)
        .join('') || 'Keine Antwort erhalten.';
    }
  } catch (e) {
    out.textContent = `Verbindungsfehler: ${e.message}\n\nHinweis: Die KI-Analyse benötigt einen gültigen Anthropic API-Key (sk-ant-...). Beziehen Sie diesen unter console.anthropic.com.`;
  }

  btn.disabled = false;
  btn.textContent = '✦ Neue Analyse';
}

/* ---- INIT --------------------------------------------------- */
renderSectionTable(EXT, 'ext-tbody');
renderSectionTable(INT, 'int-tbody');
initDash();
