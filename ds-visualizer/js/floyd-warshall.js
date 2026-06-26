// ============ Floyd-Warshall (All-Pairs Shortest Path) ============
//
// หาระยะสั้นสุดระหว่างทุกคู่ node — O(V³)
// ใช้ dynamic programming: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
// ตรวจ negative cycle ได้ (ถ้า dist[i][i] < 0 หลังรันจบ)

const FW_GRAPH = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    [0, 1, 5],   // A → B: 5
    [0, 3, 10],  // A → D: 10
    [1, 2, 3],   // B → C: 3
    [2, 0, 7],   // C → A: 7
    [2, 3, 1],   // C → D: 1
    [3, 1, 2],   // D → B: 2
  ],
  directed: true,
};

const FW_N = FW_GRAPH.nodes.length;
const FW_INF = Infinity;

function fwInitDist() {
  // Build initial distance matrix
  const dist = Array.from({ length: FW_N }, () => Array.from({ length: FW_N }, () => FW_INF));
  for (let i = 0; i < FW_N; i++) dist[i][i] = 0;
  for (const [u, v, w] of FW_GRAPH.edges) dist[u][v] = w;
  return dist;
}

function fwBase(operation, description, codeLines, dist, k, i, j, highlightCell, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    dist: dist.map((row) => row.slice()),
    k, i, j, highlightCell,
    consoleOutput, phase,
    nodes: FW_GRAPH.nodes,
  };
}

function floydWarshallSteps() {
  const steps = [];
  let dist = fwInitDist();

  steps.push(fwBase('init',
    `เริ่ม Floyd-Warshall — สร้าง distance matrix เริ่มต้น (dist[i][i]=0, dist[i][j]=weight ถ้ามี edge, ∞ ถ้าไม่มี)`,
    [1, 2, 3, 4, 5, 6], dist, -1, -1, -1, null,
    `Initial dist matrix:\n${fwFormatMatrix(dist)}`,
    'เริ่มต้น'));

  // Triple nested loop: k, i, j
  for (let k = 0; k < FW_N; k++) {
    steps.push(fwBase('iter-k',
      `=== k=${k} (${FW_GRAPH.nodes[k]}) === พิจารณาผ่าน node ${FW_GRAPH.nodes[k]} เป็น intermediate`,
      [9, 10], dist, k, -1, -1, null,
      undefined, `k=${k}`));

    for (let i = 0; i < FW_N; i++) {
      for (let j = 0; j < FW_N; j++) {
        const oldDist = dist[i][j];
        const throughK = dist[i][k] + dist[k][j];
        const oldStr = oldDist === FW_INF ? '∞' : oldDist;
        const throughStr = (dist[i][k] === FW_INF || dist[k][j] === FW_INF) ? '∞' : throughK;

        steps.push(fwBase('consider',
          `พิจารณา dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}] = ${oldStr}  vs  dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[k]}] + dist[${FW_GRAPH.nodes[k]}][${FW_GRAPH.nodes[j]}] = ${throughStr}`,
          [11, 12, 13], dist, k, i, j, [i, j],
          undefined, 'พิจารณา'));

        if (dist[i][k] !== FW_INF && dist[k][j] !== FW_INF && throughK < oldDist) {
          dist[i][j] = throughK;
          steps.push(fwBase('update',
            `${throughStr} < ${oldStr} → อัปเดต dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}] = ${throughStr} (ผ่าน ${FW_GRAPH.nodes[k]})`,
            [13, 14], dist, k, i, j, [i, j],
            `dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}] = ${throughStr}`,
            'อัปเดต'));
        } else {
          steps.push(fwBase('skip',
            `${throughStr} >= ${oldStr} → ไม่อัปเดต`,
            [13], dist, k, i, j, [i, j],
            undefined, 'ข้าม'));
        }
      }
    }

    steps.push(fwBase('iter-k-done',
      `จบ k=${k} — dist matrix หลังพิจารณา ${FW_GRAPH.nodes[k]} เป็น intermediate`,
      [], dist, k, -1, -1, null,
      `After k=${k}:\n${fwFormatMatrix(dist)}`,
      `จบ k=${k}`));
  }

  // Check negative cycle
  let hasNegCycle = false;
  for (let i = 0; i < FW_N; i++) {
    if (dist[i][i] < 0) { hasNegCycle = true; break; }
  }
  if (hasNegCycle) {
    steps.push(fwBase('neg-cycle',
      `⚠ พบ negative cycle! (dist[i][i] < 0 สำหรับบาง i) — ไม่มี shortest path ที่ well-defined`,
      [16, 17], dist, -1, -1, -1, null,
      `Negative cycle detected!`,
      'Negative cycle'));
  } else {
    steps.push(fwBase('done',
      `Floyd-Warshall เสร็จสิ้น — ได้ all-pairs shortest path`,
      [], dist, -1, -1, -1, null,
      `Final dist matrix:\n${fwFormatMatrix(dist)}`,
      'เสร็จสิ้น'));
  }

  return steps;
}

function fwFormatMatrix(dist) {
  let s = '     ' + FW_GRAPH.nodes.map((n) => n.padStart(5)).join('') + '\n';
  for (let i = 0; i < FW_N; i++) {
    s += FW_GRAPH.nodes[i].padEnd(4) + ' ';
    for (let j = 0; j < FW_N; j++) {
      const v = dist[i][j];
      s += (v === FW_INF ? '∞' : v).toString().padStart(5);
    }
    s += '\n';
  }
  return s.trim();
}

function fwInitialState() {
  const dist = fwInitDist();
  return fwBase('init',
    `กราฟตั้งต้น — ${FW_N} nodes, ${FW_GRAPH.edges.length} directed edges  กด "Run Floyd-Warshall" เพื่อหา all-pairs shortest path`,
    [], dist, -1, -1, -1, null,
    `Initial dist matrix:\n${fwFormatMatrix(dist)}\n\nกด "Run Floyd-Warshall" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

// Render: graph (top) + distance matrix (bottom)
function fwRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const dist = step.dist;
  const K = step.k;
  const I = step.i;
  const J = step.j;
  const hl = step.highlightCell;

  if (vizMeta) {
    let info = `${FW_N}×${FW_N} matrix`;
    if (K >= 0) info += ` · k=${FW_GRAPH.nodes[K]}`;
    if (I >= 0 && J >= 0) info += ` · checking [${FW_GRAPH.nodes[I]}][${FW_GRAPH.nodes[J]}]`;
    vizMeta.textContent = info;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:16px;padding:16px;align-items:center' });

  // ===== Graph SVG (top) =====
  const svgWidth = 360, svgHeight = 280;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(svgWidth));
  svg.setAttribute('height', String(svgHeight));
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  // Node positions — square layout for 4 nodes
  const positions = [
    { x: 80, y: 60 },    // A (top-left)
    { x: 280, y: 60 },   // B (top-right)
    { x: 280, y: 220 },  // C (bottom-right)
    { x: 80, y: 220 },   // D (bottom-left)
  ];

  // Draw edges with weights
  FW_GRAPH.edges.forEach(([u, v, w]) => {
    const isHl = (K === u || K === v) || (hl && ((hl[0] === u && hl[1] === v) || (hl[0] === v && hl[1] === u)));
    const dx = positions[v].x - positions[u].x;
    const dy = positions[v].y - positions[u].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 18;
    const x1 = positions[u].x + (dx / len) * nodeR;
    const y1 = positions[u].y + (dy / len) * nodeR;
    const x2 = positions[v].x - (dx / len) * nodeR;
    const y2 = positions[v].y - (dy / len) * nodeR;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', isHl ? 'var(--amber)' : 'var(--text-dim)');
    line.setAttribute('stroke-width', isHl ? '3' : '1.5');
    svg.appendChild(line);

    // Arrow tip
    const arrowSize = 7;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const ax1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const ay1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const ax2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const ay2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow.setAttribute('points', `${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`);
    arrow.setAttribute('fill', isHl ? 'var(--amber)' : 'var(--text-dim)');
    svg.appendChild(arrow);

    // Weight label
    const midX = (positions[u].x + positions[v].x) / 2;
    const midY = (positions[u].y + positions[v].y) / 2;
    // Offset perpendicular to avoid overlap
    const perpX = -dy / len * 12;
    const perpY = dx / len * 12;
    const wBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    wBg.setAttribute('cx', String(midX + perpX));
    wBg.setAttribute('cy', String(midY + perpY));
    wBg.setAttribute('r', '11');
    wBg.setAttribute('fill', isHl ? 'var(--amber)' : 'var(--bg-elev)');
    wBg.setAttribute('stroke', 'var(--border)');
    svg.appendChild(wBg);

    const wText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    wText.setAttribute('x', String(midX + perpX));
    wText.setAttribute('y', String(midY + perpY + 4));
    wText.setAttribute('text-anchor', 'middle');
    wText.setAttribute('font-size', '11');
    wText.setAttribute('font-family', 'monospace');
    wText.setAttribute('font-weight', 'bold');
    wText.setAttribute('fill', isHl ? 'white' : 'var(--text-muted)');
    wText.textContent = String(w);
    svg.appendChild(wText);
  });

  // Draw nodes
  FW_GRAPH.nodes.forEach((label, idx) => {
    const pos = positions[idx];
    const isK = K === idx;
    const isI = I === idx;
    const isJ = J === idx;

    let fill = 'var(--bg-card)', stroke = 'var(--text-dim)', textColor = 'var(--text)';
    if (isK) { fill = 'var(--purple)'; stroke = 'var(--purple)'; textColor = 'white'; }
    else if (isI || isJ) { fill = 'var(--amber)'; stroke = 'var(--amber)'; textColor = 'white'; }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(pos.x));
    text.setAttribute('y', String(pos.y + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', textColor);
    text.textContent = label;
    svg.appendChild(text);
  });

  wrap.appendChild(svg);

  // ===== Distance matrix (bottom) =====
  const tableLabel = window.DS.el('div', {
    style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;text-align:center',
  }, 'Distance matrix dist[i][j]:');
  wrap.appendChild(tableLabel);

  // Matrix table
  const table = window.DS.el('table', { style: 'border-collapse:collapse;font-family:monospace;font-size:14px' });

  // Header row
  const thead = window.DS.el('thead');
  const headerRow = window.DS.el('tr');
  headerRow.appendChild(window.DS.el('th', { style: 'padding:8px 12px;background:var(--bg-elev);border:1px solid var(--border);color:var(--text-muted)' }, ''));
  for (let j = 0; j < FW_N; j++) {
    const isHl = (K >= 0 && j === K) || (I >= 0 && j === J);
    const th = window.DS.el('th', {
      style: `padding:8px 12px;background:var(--bg-elev);border:1px solid var(--border);color:${isHl ? 'var(--amber)' : 'var(--text-muted)'};font-weight:700`,
    }, FW_GRAPH.nodes[j]);
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = window.DS.el('tbody');
  for (let i = 0; i < FW_N; i++) {
    const tr = window.DS.el('tr');
    const isRowHl = (K >= 0 && i === K) || (I >= 0 && i === I);
    const rowLabel = window.DS.el('th', {
      style: `padding:8px 12px;background:var(--bg-elev);border:1px solid var(--border);color:${isRowHl ? 'var(--amber)' : 'var(--text-muted)'};font-weight:700;text-align:right`,
    }, FW_GRAPH.nodes[i]);
    tr.appendChild(rowLabel);

    for (let j = 0; j < FW_N; j++) {
      const v = dist[i][j];
      const isCell = hl && hl[0] === i && hl[1] === j;
      const isDiag = i === j;
      const isRowK = K === i;
      const isColK = K === j;

      let bg = 'var(--bg-card)';
      let color = 'var(--text)';
      let fontWeight = '400';
      if (isCell) {
        bg = 'var(--amber)';
        color = 'white';
        fontWeight = '700';
      } else if (isRowK || isColK) {
        bg = 'rgba(245,158,11,0.15)';
        color = 'var(--amber)';
        fontWeight = '600';
      } else if (isDiag) {
        bg = 'rgba(255,255,255,0.04)';
        color = 'var(--text-muted)';
      }

      const td = window.DS.el('td', {
        style: `padding:8px 14px;border:1px solid var(--border);text-align:center;background:${bg};color:${color};font-weight:${fontWeight};min-width:50px`,
      }, v === FW_INF ? '∞' : String(v));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);

  // Legend
  const legend = window.DS.el('div', { style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);justify-content:center;flex-wrap:wrap' });
  legend.innerHTML = `
    <span><span style="display:inline-block;width:12px;height:12px;background:var(--amber);border-radius:3px;vertical-align:middle"></span> cell ที่กำลังพิจารณา</span>
    <span><span style="display:inline-block;width:12px;height:12px;background:rgba(245,158,11,0.15);border-radius:3px;vertical-align:middle"></span> row/col k (intermediate)</span>
    <span><span style="display:inline-block;width:12px;height:12px;background:rgba(255,255,255,0.04);border-radius:3px;vertical-align:middle"></span> diagonal (dist[i][i]=0)</span>
    <span><b>∞</b> = ไม่มี path</span>
  `;
  wrap.appendChild(legend);

  vizArea.appendChild(wrap);
}

window.FLOYD_WARSHALL = {
  graph: FW_GRAPH,
  run: floydWarshallSteps,
  render: fwRender,
  initialState: fwInitialState,
};
