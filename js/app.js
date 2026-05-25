/* =============================================================
   app.js — K AG Foresight Radar
   Scoring-Engine, Navigation, Cluster- und Detail-Ansichten
   ============================================================= */

/* ---- SCORING ENGINE ----------------------------------------- */
function calcScore(field) {
  return Math.round(
    DIMENSIONS.reduce((sum, d) => sum + field.scores[d.key] * d.weight, 0)
  );
}

function getZone(score) {
  return ZONES.find(z => score >= z.min && score <= z.max) || ZONES[ZONES.length - 1];
}

function getCluster(key) {
  return CLUSTERS.find(c => c.key === key);
}

function enrichFields() {
  FIELDS.forEach(f => {
    f.totalScore = calcScore(f);
    f.zone = getZone(f.totalScore);
    f.clusterObj = getCluster(f.cluster);
  });
}

enrichFields();

/* ---- NAVIGATION --------------------------------------------- */
document.querySelectorAll('.nb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---- DATE --------------------------------------------------- */
document.getElementById('current-date').textContent =
  new Date().toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---- BADGE HELPERS ------------------------------------------ */
function zoneBadge(zone) {
  return '<span class="zone-badge zone-' + zone.key.toLowerCase() + '">' + zone.label + '</span>';
}

function clusterBadge(clusterObj) {
  return '<span class="cluster-badge" style="background:' + clusterObj.color + '15;color:' + clusterObj.color + '">' + clusterObj.label + '</span>';
}

function scorePill(score, zone) {
  return '<span class="score-pill score-' + zone.key.toLowerCase() + '">' + score + '</span>';
}

/* ---- SPARKLINE SVG ------------------------------------------ */
function sparklineSVG(data, color) {
  var w = 60, h = 20, pad = 2;
  var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function(v, i) {
    var x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    var y = h - pad - ((v - min) / range) * (h - 2 * pad);
    return x + ',' + y;
  }).join(' ');
  return '<svg class="sparkline" viewBox="0 0 ' + w + ' ' + h + '"><polyline points="' + pts + '" style="stroke:' + color + '"/></svg>';
}

/* ---- DASHBOARD ---------------------------------------------- */
function renderDashboard() {
  var sorted = FIELDS.slice().sort(function(a, b) { return b.totalScore - a.totalScore; });
  var zones = { ACT: 0, PREPARE: 0, MONITOR: 0, SCAN: 0 };
  FIELDS.forEach(function(f) { zones[f.zone.key]++; });

  document.getElementById('k-total').textContent = FIELDS.length;
  document.getElementById('k-act').textContent = zones.ACT;
  document.getElementById('k-prepare').textContent = zones.PREPARE;
  document.getElementById('k-monitor').textContent = zones.MONITOR;
  document.getElementById('k-scan').textContent = zones.SCAN;

  var avg = Math.round(FIELDS.reduce(function(s, f) { return s + f.totalScore; }, 0) / FIELDS.length);
  document.getElementById('k-avg').textContent = avg;
  document.getElementById('k-clusters').textContent = CLUSTERS.length;

  var topEl = document.getElementById('top-fields');
  topEl.innerHTML = sorted.slice(0, 8).map(function(f, i) {
    return '<div class="top-field-row" onclick="showDetail(' + f.id + ')">' +
      '<div class="top-field-rank">' + (i + 1) + '</div>' +
      '<div class="top-field-info">' +
        '<div class="top-field-name">' + f.name + '</div>' +
        '<div class="top-field-desc">' + f.desc + '</div>' +
      '</div>' +
      zoneBadge(f.zone) +
      '<div class="top-field-score" style="color:' + f.zone.color + '">' + f.totalScore + '</div>' +
    '</div>';
  }).join('');

  renderZoneChart();
  renderDistChart();
}

/* ---- CHARTS (Chart.js) -------------------------------------- */
var zoneChart, distChart;

function getChartColors() {
  var style = getComputedStyle(document.documentElement);
  return {
    text: style.getPropertyValue('--text').trim(),
    text2: style.getPropertyValue('--text2').trim(),
    border: style.getPropertyValue('--border').trim(),
    bg: style.getPropertyValue('--bg').trim()
  };
}

function renderZoneChart() {
  var ctx = document.getElementById('c-zones').getContext('2d');
  var zones = { ACT: 0, PREPARE: 0, MONITOR: 0, SCAN: 0 };
  FIELDS.forEach(function(f) { zones[f.zone.key]++; });
  var colors = getChartColors();

  if (zoneChart) zoneChart.destroy();
  zoneChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['ACT', 'PREPARE', 'MONITOR', 'SCAN'],
      datasets: [{
        data: [zones.ACT, zones.PREPARE, zones.MONITOR, zones.SCAN],
        backgroundColor: ['#C62828', '#E65100', '#1565C0', '#546E7A'],
        borderColor: colors.bg,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function renderDistChart() {
  var ctx = document.getElementById('c-dist').getContext('2d');
  var sorted = FIELDS.slice().sort(function(a, b) { return b.totalScore - a.totalScore; });
  var colors = getChartColors();

  if (distChart) distChart.destroy();
  distChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(function(f) { return f.name; }),
      datasets: [{
        data: sorted.map(function(f) { return f.totalScore; }),
        backgroundColor: sorted.map(function(f) { return f.zone.color + '33'; }),
        borderColor: sorted.map(function(f) { return f.zone.color; }),
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          min: 0, max: 100,
          ticks: { color: colors.text2, font: { size: 9 } },
          grid: { color: colors.border }
        },
        y: {
          ticks: { color: colors.text2, font: { size: 9 } },
          grid: { display: false }
        }
      }
    }
  });
}

/* ---- CLUSTER VIEW ------------------------------------------- */
function renderClusters() {
  var el = document.getElementById('cluster-list');
  el.innerHTML = CLUSTERS.map(function(c) {
    var fields = FIELDS.filter(function(f) { return f.cluster === c.key; })
      .sort(function(a, b) { return b.totalScore - a.totalScore; });
    var clusterAvg = Math.round(fields.reduce(function(s, f) { return s + f.totalScore; }, 0) / fields.length);
    var clusterZone = getZone(clusterAvg);

    return '<div class="card cluster-card">' +
      '<div class="cluster-header">' +
        '<div class="cluster-color" style="background:' + c.color + '"></div>' +
        '<div class="cluster-info">' +
          '<div class="cluster-name">' + c.label + '</div>' +
          '<div class="cluster-desc">' + c.desc + '</div>' +
        '</div>' +
        '<div class="cluster-score" style="color:' + clusterZone.color + '">' +
          '<div style="font-size:24px;font-weight:600">' + clusterAvg + '</div>' +
          zoneBadge(clusterZone) +
        '</div>' +
      '</div>' +
      '<div class="cluster-fields">' +
        fields.map(function(f) {
          return '<div class="cluster-field-row" onclick="showDetail(' + f.id + ')">' +
            '<div class="cluster-field-name">' + f.name + '</div>' +
            '<div class="cluster-field-desc">' + f.desc + '</div>' +
            scorePill(f.totalScore, f.zone) +
            ' ' + zoneBadge(f.zone) +
            ' ' + sparklineSVG(f.trend, f.zone.color) +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }).join('');
}

/* ---- FIELDS TABLE ------------------------------------------- */
function renderFieldsTable() {
  var sorted = FIELDS.slice().sort(function(a, b) { return b.totalScore - a.totalScore; });
  var tbody = document.getElementById('fields-tbody');
  tbody.innerHTML = sorted.map(function(f) {
    return '<tr onclick="showDetail(' + f.id + ')">' +
      '<td>' +
        '<div class="field-name">' + f.name + '</div>' +
        '<div class="field-desc">' + f.desc + '</div>' +
      '</td>' +
      '<td>' + clusterBadge(f.clusterObj) + '</td>' +
      '<td>' + scorePill(f.totalScore, f.zone) + '</td>' +
      '<td>' + zoneBadge(f.zone) + '</td>' +
      '<td>' + sparklineSVG(f.trend, f.zone.color) + '</td>' +
      '<td style="font-size:10px;color:var(--text2)">' + f.scores.velocity + '</td>' +
      '<td style="font-size:10px;color:var(--text2)">' + f.scores.impact + '</td>' +
      '<td style="font-size:10px;color:var(--text2)">' + f.scores.market + '</td>' +
      '<td style="font-size:10px;color:var(--text2)">' + f.scores.talent + '</td>' +
      '<td style="font-size:10px;color:var(--text2)">' + f.scores.readiness + '</td>' +
    '</tr>';
  }).join('');
}

/* ---- DETAIL VIEW -------------------------------------------- */
var detailChart;

function showDetail(id) {
  var f = FIELDS.find(function(x) { return x.id === id; });
  if (!f) return;

  document.querySelectorAll('.nb').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('tab-detail').classList.add('active');

  document.getElementById('detail-name').textContent = f.name;
  document.getElementById('detail-desc').textContent = f.desc;
  document.getElementById('detail-badges').innerHTML = clusterBadge(f.clusterObj) + ' ' + zoneBadge(f.zone);
  document.getElementById('detail-insight-text').textContent = f.insight;

  renderScoreRing('detail-ring', f.totalScore, f.zone.color);

  var dimEl = document.getElementById('detail-dimensions');
  dimEl.innerHTML = DIMENSIONS.map(function(d) {
    var val = f.scores[d.key];
    return '<div class="dim-card">' +
      '<div class="dim-label">' + d.label + ' <span style="font-weight:400;opacity:0.6">(' + Math.round(d.weight * 100) + '%)</span></div>' +
      '<div class="dim-value" style="color:' + getScoreColor(val) + '">' + val + '</div>' +
      '<div class="dim-bar">' +
        '<div class="dim-bar-fill" style="width:' + val + '%;background:' + getScoreColor(val) + '"></div>' +
      '</div>' +
    '</div>';
  }).join('');

  renderTrendChart(f);
}

function getScoreColor(score) {
  if (score >= 75) return '#C62828';
  if (score >= 50) return '#E65100';
  if (score >= 25) return '#1565C0';
  return '#546E7A';
}

function renderScoreRing(containerId, score, color) {
  var el = document.getElementById(containerId);
  var r = 32, cx = 40, cy = 40, circ = 2 * Math.PI * r;
  var offset = circ - (score / 100) * circ;
  el.innerHTML = '<svg viewBox="0 0 80 80" class="detail-score-ring">' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--bg3)" stroke-width="6"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6"' +
    ' stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '"' +
    ' transform="rotate(-90 ' + cx + ' ' + cy + ')" stroke-linecap="round"/>' +
    '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" class="score-ring-text">' + score + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" class="score-ring-label">Score</text>' +
  '</svg>';
}

function renderTrendChart(field) {
  var ctx = document.getElementById('c-trend').getContext('2d');
  if (detailChart) detailChart.destroy();
  var colors = getChartColors();

  detailChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: TREND_LABELS,
      datasets: [{
        data: field.trend,
        borderColor: field.zone.color,
        backgroundColor: field.zone.color + '20',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: field.zone.color
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0, max: 100,
          ticks: { color: colors.text2, font: { size: 10 } },
          grid: { color: colors.border }
        },
        x: {
          ticks: { color: colors.text2, font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
}

function backToList() {
  document.getElementById('tab-detail').classList.remove('active');
  document.querySelector('[data-tab="fields"]').classList.add('active');
  document.getElementById('tab-fields').classList.add('active');
}

/* ---- METHODIK ----------------------------------------------- */
function renderMethodik() {
  var dimEl = document.getElementById('methodik-dimensions');
  dimEl.innerHTML = DIMENSIONS.map(function(d) {
    return '<div class="methodik-card">' +
      '<h4>' + d.label + ' (' + Math.round(d.weight * 100) + '%)</h4>' +
      '<p>' + d.desc + '</p>' +
    '</div>';
  }).join('');

  var zEl = document.getElementById('methodik-zones');
  zEl.innerHTML = ZONES.map(function(z) {
    return '<div class="methodik-card" style="border-left:3px solid ' + z.color + '">' +
      '<h4>' + z.label + ' (Score ' + z.min + '–' + z.max + ')</h4>' +
      '<p>' + z.desc + '</p>' +
    '</div>';
  }).join('');
}

/* ---- INIT --------------------------------------------------- */
function init() {
  renderDashboard();
  renderClusters();
  renderFieldsTable();
  renderMethodik();
  initRadar();
}

document.addEventListener('DOMContentLoaded', init);
