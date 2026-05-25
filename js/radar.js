/* =============================================================
   radar.js — D3.js Foresight Radar Visualisierung
   19 Handlungsfelder in 4 Zonen, 5 Cluster-Farben
   ============================================================= */

function initRadar() {
  var container = document.getElementById('radar-container');
  if (!container) return;

  var size = 700;
  var cx = size / 2, cy = size / 2;
  var maxR = size / 2 - 40;

  var svg = d3.select('#radar-container')
    .append('svg')
    .attr('viewBox', '0 0 ' + size + ' ' + size)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  var tooltip = document.getElementById('radar-tooltip');

  // Zone rings: outer = SCAN (low scores), inner = ACT (high scores)
  var zoneRadii = [
    { zone: ZONES[3], outer: maxR,         inner: maxR * 0.75 },
    { zone: ZONES[2], outer: maxR * 0.75,  inner: maxR * 0.50 },
    { zone: ZONES[1], outer: maxR * 0.50,  inner: maxR * 0.25 },
    { zone: ZONES[0], outer: maxR * 0.25,  inner: 0 }
  ];

  // Draw zone rings
  zoneRadii.forEach(function(zr) {
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', zr.outer)
      .attr('fill', 'none')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 0.5);

    var arc = d3.arc()
      .innerRadius(zr.inner)
      .outerRadius(zr.outer)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    svg.append('path')
      .attr('d', arc)
      .attr('transform', 'translate(' + cx + ',' + cy + ')')
      .attr('fill', zr.zone.color)
      .attr('opacity', 0.06);
  });

  // Zone labels on right side
  zoneRadii.forEach(function(zr) {
    var labelR = (zr.outer + zr.inner) / 2;
    svg.append('text')
      .attr('x', cx + labelR)
      .attr('y', cy - 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('letter-spacing', '.08em')
      .attr('fill', zr.zone.color)
      .attr('opacity', 0.5)
      .text(zr.zone.label);
  });

  // Center dot
  svg.append('circle')
    .attr('cx', cx).attr('cy', cy).attr('r', 3)
    .attr('fill', 'var(--text3)');

  // Cross lines
  svg.append('line')
    .attr('x1', cx - maxR).attr('y1', cy).attr('x2', cx + maxR).attr('y2', cy)
    .attr('stroke', 'var(--border)').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,3');
  svg.append('line')
    .attr('x1', cx).attr('y1', cy - maxR).attr('x2', cx).attr('y2', cy + maxR)
    .attr('stroke', 'var(--border)').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,3');

  // Position fields within their zone ring
  function fieldPosition(field, index) {
    var score = field.totalScore;
    var zone = field.zone;
    var zr = zoneRadii.find(function(z) { return z.zone.key === zone.key; });

    // Distance from center: high score = closer to center
    var normalizedInZone = (score - zone.min) / (zone.max - zone.min + 1);
    var r = zr.inner + (1 - normalizedInZone) * (zr.outer - zr.inner) * 0.8 + (zr.outer - zr.inner) * 0.1;

    // Spread by cluster: each cluster gets a segment
    var clusterIndex = CLUSTERS.findIndex(function(c) { return c.key === field.cluster; });
    var fieldsInCluster = FIELDS.filter(function(f) { return f.cluster === field.cluster; });
    var indexInCluster = fieldsInCluster.indexOf(field);

    var segmentAngle = (2 * Math.PI) / CLUSTERS.length;
    var baseAngle = clusterIndex * segmentAngle;
    var spread = segmentAngle * 0.7;
    var angle = baseAngle + spread * (indexInCluster + 0.5) / fieldsInCluster.length - spread / 2 + segmentAngle / 2;

    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  }

  // Compute positions
  var points = FIELDS.map(function(f, i) {
    return { field: f, pos: fieldPosition(f, i) };
  });

  // Cluster segment labels at outer ring
  CLUSTERS.forEach(function(c, i) {
    var segmentAngle = (2 * Math.PI) / CLUSTERS.length;
    var angle = i * segmentAngle + segmentAngle / 2;
    var labelR = maxR + 20;
    var lx = cx + labelR * Math.cos(angle);
    var ly = cy + labelR * Math.sin(angle);

    svg.append('text')
      .attr('x', lx)
      .attr('y', ly)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '8px')
      .attr('font-weight', '600')
      .attr('fill', c.color)
      .text(c.label);
  });

  // Draw points
  var groups = svg.selectAll('.field-group')
    .data(points)
    .enter()
    .append('g')
    .attr('class', 'field-group')
    .attr('transform', function(d) { return 'translate(' + d.pos.x + ',' + d.pos.y + ')'; })
    .style('cursor', 'pointer');

  // Outer glow in cluster color
  groups.append('circle')
    .attr('r', 16)
    .attr('fill', function(d) { return d.field.clusterObj.color; })
    .attr('opacity', 0.12);

  // Main circle in zone color
  groups.append('circle')
    .attr('r', function(d) { return 6 + (d.field.totalScore / 100) * 5; })
    .attr('fill', function(d) { return d.field.zone.color; })
    .attr('stroke', function(d) { return d.field.clusterObj.color; })
    .attr('stroke-width', 2)
    .attr('opacity', 0.9);

  // Score label
  groups.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '8px')
    .attr('font-weight', '700')
    .attr('fill', '#fff')
    .text(function(d) { return d.field.totalScore; });

  // Name label
  groups.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', function(d) { return 14 + (d.field.totalScore / 100) * 5; })
    .attr('font-size', '7.5px')
    .attr('font-weight', '500')
    .attr('fill', 'var(--text)')
    .text(function(d) {
      var name = d.field.name;
      return name.length > 22 ? name.substring(0, 20) + '..' : name;
    });

  // Interactions
  groups
    .on('mouseenter', function(event, d) {
      d3.select(this).select('circle:nth-child(2)')
        .transition().duration(150)
        .attr('r', function(d) { return 10 + (d.field.totalScore / 100) * 5; });

      var f = d.field;
      tooltip.querySelector('.tt-name').textContent = f.name;
      tooltip.querySelector('.tt-zone').innerHTML = zoneBadge(f.zone) + ' ' + clusterBadge(f.clusterObj);
      tooltip.querySelector('.tt-score').textContent = f.totalScore;
      tooltip.querySelector('.tt-score').style.color = f.zone.color;

      var barsHtml = DIMENSIONS.map(function(dim) {
        return '<div class="tt-bar-row">' +
          '<div class="tt-bar-label">' + dim.label + '</div>' +
          '<div class="tt-bar"><div class="tt-bar-fill" style="width:' + f.scores[dim.key] + '%;background:' + getScoreColor(f.scores[dim.key]) + '"></div></div>' +
          '<div class="tt-bar-val">' + f.scores[dim.key] + '</div>' +
        '</div>';
      }).join('');
      tooltip.querySelector('.tt-bars').innerHTML = barsHtml;

      tooltip.classList.add('visible');

      var rect = container.getBoundingClientRect();
      var px = d.pos.x / size * rect.width;
      var py = d.pos.y / size * rect.height;
      tooltip.style.left = (px + 20) + 'px';
      tooltip.style.top = (py - 20) + 'px';

      if (px > rect.width * 0.6) {
        tooltip.style.left = (px - 300) + 'px';
      }
    })
    .on('mouseleave', function() {
      d3.select(this).select('circle:nth-child(2)')
        .transition().duration(150)
        .attr('r', function(d) { return 6 + (d.field.totalScore / 100) * 5; });
      tooltip.classList.remove('visible');
    })
    .on('click', function(event, d) {
      tooltip.classList.remove('visible');
      showDetail(d.field.id);
    });
}
