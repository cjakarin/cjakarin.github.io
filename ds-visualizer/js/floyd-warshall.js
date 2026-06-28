// ============ Floyd-Warshall (All-Pairs Shortest Path) ============
//
// DP แบบ 3 ชั้น: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
// รองรับ negative edges (แต่ไม่รองรับ negative cycle — ตรวจด้วย dist[i][i] < 0)
// Time: O(V³) — เหมาะกับ dense graph ที่ต้องการ shortest path ทุกคู่

// Graph ตัวอย่าง: 4 nodes (directed)
const FW_GRAPH = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    [0, 1, 5],   // A → B: 5
    [0, 2, 2],   // A → C: 2
    [1, 2, 1],   // B → C: 1
    [1, 3, 6],   // B → D: 6
    [2, 3, 3],   // C → D: 3
    [2, 1, 4],   // C → B: 4
  ],
  directed: true,
};

const FW_N = FW_GRAPH.nodes.length;
const FW_INF = Infinity;

function fwBuildAdj(edges, n) {
  const adj = Array.from({ length: n }, () => Array.from({ length: n }, () => FW_INF));
  for (let i = 0; i < n; i++) adj[i][i] = 0;
  for (const [u, v, w] of edges) adj[u][v] = w;
  return adj;
}

function fwBase(operation, description, codeLines, state, consoleOutput, phase) {
  return { operation, description, codeLines, ...state, consoleOutput, phase };
}

function fwMatrixStr(dist) {
  let s = '     ' + FW_GRAPH.nodes.map((n) => n.padStart(5)).join('') + '\n';
  for (let i = 0; i < FW_N; i++) {
    s += FW_GRAPH.nodes[i].padEnd(4) + ' ';
    for (let j = 0; j < FW_N; j++) {
      s += (dist[i][j] === FW_INF ? '∞' : dist[i][j]).toString().padStart(5);
    }
    if (i < FW_N - 1) s += '\n';
  }
  return s;
}

function fwSteps() {
  const steps = [];
  let dist = fwBuildAdj(FW_GRAPH.edges, FW_N);

  // ===== Phase 0: Show initial state =====
  steps.push(fwBase('init',
    `เริ่ม Floyd-Warshall — ${FW_N} nodes, ${FW_GRAPH.edges.length} directed edges. จะหา shortest path ระหว่างทุกคู่`,
    [1, 2, 3, 5, 6, 8], {
      dist: dist.map((r) => r.slice()),
      k: -1, i: -1, j: -1,
      highlightCell: null,
      highlightEdge: null,
    },
    `Initial dist matrix (0 = same node, ∞ = no direct edge):\n${fwMatrixStr(dist)}`,
    'เริ่มต้น'));

  // ===== Triple loop: for k, for i, for j =====
  for (let k = 0; k < FW_N; k++) {
    steps.push(fwBase('k-iter',
      `รอบ k=${FW_GRAPH.nodes[k]} — ให้ ${FW_GRAPH.nodes[k]} เป็น intermediate node ทดสอบทุกคู่ (i, j)`,
      [9], {
        dist: dist.map((r) => r.slice()),
        k, i: -1, j: -1,
        highlightCell: null,
        highlightEdge: null,
      },
      `k = ${FW_GRAPH.nodes[k]}  ทดสอบ: dist[i][j] vs dist[i][${FW_GRAPH.nodes[k]}] + dist[${FW_GRAPH.nodes[k]}][j]`,
      `รอบ k=${FW_GRAPH.nodes[k]}`));

    for (let i = 0; i < FW_N; i++) {
      for (let j = 0; j < FW_N; j++) {
        if (i === j) continue;
        if (dist[i][k] === FW_INF || dist[k][j] === FW_INF) {
          // Skip — no path through k
          steps.push(fwBase('skip',
            `ข้าม (${FW_GRAPH.nodes[i]},${FW_GRAPH.nodes[j]}): dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[k]}]=${dist[i][k] === FW_INF ? '∞' : dist[i][k]} หรือ dist[${FW_GRAPH.nodes[k]}][${FW_GRAPH.nodes[j]}]=${dist[k][j] === FW_INF ? '∞' : dist[k][j]} เป็น ∞ → ไม่สามารถผ่าน ${FW_GRAPH.nodes[k]}`,
            [12], {
              dist: dist.map((r) => r.slice()),
              k, i, j,
              highlightCell: [i, j],
              highlightEdge: null,
            },
            undefined, 'ข้าม'));
          continue;
        }

        const newDist = dist[i][k] + dist[k][j];
        const oldDist = dist[i][j];

        steps.push(fwBase('relax',
          `เปรียบเทียบ dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}]=${oldDist === FW_INF ? '∞' : oldDist}  กับ  dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[k]}]+dist[${FW_GRAPH.nodes[k]}][${FW_GRAPH.nodes[j]}] = ${dist[i][k]}+${dist[k][j]} = ${newDist}`,
          [10, 11, 12, 13], {
            dist: dist.map((r) => r.slice()),
            k, i, j,
            highlightCell: [i, j],
            highlightEdge: [i, k, k, j],
          },
          undefined, 'เปรียบเทียบ'));

        if (newDist < oldDist) {
          dist[i][j] = newDist;
          steps.push(fwBase('update',
            `${newDist} < ${oldDist === FW_INF ? '∞' : oldDist} → อัปเดต dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}] = ${newDist}`,
            [14], {
              dist: dist.map((r) => r.slice()),
              k, i, j,
              highlightCell: [i, j],
              highlightEdge: [i, k, k, j],
            },
            `dist[${FW_GRAPH.nodes[i]}][${FW_GRAPH.nodes[j]}] = ${newDist}`,
            'อัปเดต'));
        }
      }
    }

    steps.push(fwBase('k-done',
      `จบรอบ k=${FW_GRAPH.nodes[k]} — ทดสอบผ่าน ${FW_GRAPH.nodes[k]} ครบทุกคู่แล้ว`,
      [], {
        dist: dist.map((r) => r.slice()),
        k, i: -1, j: -1,
        highlightCell: null,
        highlightEdge: null,
      },
      `หลังรอบ k=${FW_GRAPH.nodes[k]}:\n${fwMatrixStr(dist)}`,
      `จบรอบ k=${FW_GRAPH.nodes[k]}`));
  }

  // ===== Check negative cycle =====
  let hasNegCycle = false;
  let negCycleNode = -1;
  for (let i = 0; i < FW_N; i++) {
    if (dist[i][i] < 0) { hasNegCycle = true; negCycleNode = i; break; }
  }

  if (hasNegCycle) {
    steps.push(fwBase('neg-cycle',
      `⚠ พบ negative cycle! dist[${FW_GRAPH.nodes[negCycleNode]}][${FW_GRAPH.nodes[negCycleNode]}] = ${dist[negCycleNode][negCycleNode]} < 0`,
      [16, 17], {
        dist: dist.map((r) => r.slice()),
        k: -1, i: negCycleNode, j: negCycleNode,
        highlightCell: [negCycleNode, negCycleNode],
        highlightEdge: null,
      },
      `Negative cycle detected! ไม่สามารถหา shortest path ได้`,
      'Negative cycle'));
    return steps;
  }

  // ===== Final result =====
  steps.push(fwBase('done',
    `Floyd-Warshall เสร็จสิ้น — ไม่พบ negative cycle  ได้ all-pairs shortest path ครบทุกคู่`,
    [], {
      dist: dist.map((r) => r.slice()),
      k: -1, i: -1, j: -1,
      highlightCell: null,
      highlightEdge: null,
    },
    `Final distance matrix:\n${fwMatrixStr(dist)}`,
    'เสร็จสิ้น'));

  return steps;
}

// ===== Renderer =====
function fwRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const dist = step.dist;
  const k = step.k;
  const i = step.i;
  const j = step.j;
  const phase = step.phase || '';

  if (vizMeta) {
    let info = '';
    if (phase === 'เริ่มต้น' || step.operation === 'init') info = `${FW_N} nodes · ${FW_GRAPH.edges.length} edges`;
    else if (k >= 0 && i < 0) info = `รอบ k=${FW_GRAPH.nodes[k]}`;
    else if (k >= 0 && i >= 0) info = `k=${FW_GRAPH.nodes[k]} · ทดสอบ (${FW_GRAPH.nodes[i]},${FW_GRAPH.nodes[j]})`;
    else if (step.operation === 'done') info = `Final: All-Pairs Shortest Path`;
    else if (step.operation === 'neg-cycle') info = `Negative cycle!`;
    vizMeta.textContent = info;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;gap:24px;padding:16px;flex-wrap:wrap;justify-content:center;align-items:flex-start' });

  // ===== Left: Graph SVG =====
  const positions = [];
  const radius = 100, cx = 150, cy = 130;
  for (let i = 0; i < FW_N; i++) {
    const angle = (i / FW_N) * 2 * Math.PI - Math.PI / 2;
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '270');
  svg.setAttribute('viewBox', '0 0 300 270');

  // Determine highlighted edge
  const hl = step.highlightEdge; // [u1, v1, u2, v2]
  const isHlEdge = (u, v) => hl && ((hl[0] === u && hl[1] === v) || (hl[2] === u && hl[3] === v));

  // Draw edges
  FW_GRAPH.edges.forEach(([u, v, w]) => {
    const dx = positions[v].x - positions[u].x;
    const dy = positions[v].y - positions[u].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 18;
    const x1 = positions[u].x + (dx / len) * nodeR;
    const y1 = positions[u].y + (dy / len) * nodeR;
    const x2 = positions[v].x - (dx / len) * nodeR;
    const y2 = positions[v].y - (dy / len) * nodeR;

    const isHl = isHlEdge(u, v);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', isHl ? 'var(--amber)' : 'var(--text-dim)');
    line.setAttribute('stroke-width', isHl ? '3' : '1.5');
    svg.appendChild(line);

    // Arrow
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
    const perpX = -dy / len * 11;
    const perpY = dx / len * 11;
    const wBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    wBg.setAttribute('cx', String(midX + perpX));
    wBg.setAttribute('cy', String(midY + perpY));
    wBg.setAttribute('r', '10');
    wBg.setAttribute('fill', isHl ? 'var(--amber)' : 'var(--bg-elev)');
    wBg.setAttribute('stroke', 'var(--border)');
    svg.appendChild(wBg);

    const wText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    wText.setAttribute('x', String(midX + perpX));
    wText.setAttribute('y', String(midY + perpY + 4));
    wText.setAttribute('text-anchor', 'middle');
    wText.setAttribute('font-size', '10');
    wText.setAttribute('font-family', 'monospace');
    wText.setAttribute('font-weight', 'bold');
    wText.setAttribute('fill', isHl ? 'white' : 'var(--text-muted)');
    wText.textContent = String(w);
    svg.appendChild(wText);
  });

  // Draw nodes
  FW_GRAPH.nodes.forEach((label, idx) => {
    const pos = positions[idx];
    const isK = k === idx;
    const isI = i === idx;
    const isJ = j === idx;

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
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', textColor);
    text.textContent = label;
    svg.appendChild(text);

    // Role label
    if (isK) {
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(pos.x));
      lbl.setAttribute('y', String(pos.y - 28));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('font-family', 'monospace');
      lbl.setAttribute('fill', 'var(--purple)');
      lbl.textContent = 'k';
      svg.appendChild(lbl);
    }
    if (isI) {
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(pos.x - 22));
      lbl.setAttribute('y', String(pos.y + 4));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('font-family', 'monospace');
      lbl.setAttribute('fill', 'var(--amber)');
      lbl.textContent = 'i';
      svg.appendChild(lbl);
    }
    if (isJ) {
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(pos.x + 22));
      lbl.setAttribute('y', String(pos.y + 4));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('font-family', 'monospace');
      lbl.setAttribute('fill', 'var(--amber)');
      lbl.textContent = 'j';
      svg.appendChild(lbl);
    }
  });

  wrap.appendChild(svg);

  // ===== Right: dist matrix =====
  const info = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:12px;min-width:240px;max-width:340px' });

  const phaseLabel = step.phase || step.operation || '';
  info.appendChild(window.DS.el('div', {
    style: 'padding:8px 12px;background:var(--bg-elev);border-radius:8px;font-size:12px;font-weight:600;color:var(--amber);border:1px solid var(--border)',
  }, phaseLabel));

  info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em' }, 'dist[] matrix:'));

  const table = window.DS.el('table', { style: 'border-collapse:collapse;font-family:monospace;font-size:12px' });
  const thead = window.DS.el('tr');
  thead.appendChild(window.DS.el('th', { style: 'padding:4px 8px;color:var(--text-muted)' }, ''));
  for (let jj = 0; jj < FW_N; jj++) {
    const thColor = (k >= 0 && jj === k) ? 'var(--purple)' : 'var(--text-muted)';
    thead.appendChild(window.DS.el('th', { style: `padding:4px 8px;color:${thColor};font-weight:${jj === k ? 'bold' : 'normal'}` }, FW_GRAPH.nodes[jj]));
  }
  table.appendChild(thead);

  for (let ii = 0; ii < FW_N; ii++) {
    const tr = window.DS.el('tr');
    const rowColor = (k >= 0 && ii === k) ? 'var(--purple)' : 'var(--text-muted)';
    tr.appendChild(window.DS.el('th', { style: `padding:4px 8px;color:${rowColor};text-align:right;font-weight:${ii === k ? 'bold' : 'normal'}` }, FW_GRAPH.nodes[ii]));
    for (let jj = 0; jj < FW_N; jj++) {
      const v = dist[ii][jj];
      const isHl = step.highlightCell && step.highlightCell[0] === ii && step.highlightCell[1] === jj;
      const isK = (k >= 0 && (ii === k || jj === k));
      let bg = '';
      let color = 'var(--text)';
      if (isHl) { bg = 'background:var(--amber);color:white;font-weight:bold;'; color = 'white'; }
      else if (isK) { bg = 'background:rgba(168,85,247,0.15);color:var(--purple);'; color = 'var(--purple)'; }
      else if (ii === jj) { bg = 'color:var(--text-muted);'; color = 'var(--text-muted)'; }
      tr.appendChild(window.DS.el('td', {
        style: `padding:4px 10px;text-align:center;${bg || `color:${color}`}`,
      }, v === FW_INF ? '∞' : String(v)));
    }
    table.appendChild(tr);
  }
  info.appendChild(table);

  // Legend for matrix colors
  const legend = window.DS.el('div', { style: 'font-size:10px;color:var(--text-muted);font-family:monospace;display:flex;flex-direction:column;gap:3px' });
  legend.appendChild(window.DS.el('div', { style: 'color:var(--amber)' }, '■ cell ที่กำลัง relax'));
  legend.appendChild(window.DS.el('div', { style: 'color:var(--purple)' }, '■ แถว/คอลัมน์ของ k'));
  info.appendChild(legend);

  wrap.appendChild(info);
  vizArea.appendChild(wrap);
}

window.FLOYD_WARSHALL = {
  run: fwSteps,
  render: fwRender,
};
