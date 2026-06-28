// ============ Tarjan's Strongly Connected Components (SCC) ============
//
// หา SCC ใน directed graph ด้วย DFS แบบ recursive + low-link values + stack
// - idx[v]  = ลำดับการเยี่ยม (timestamp)
// - low[v]  = idx ต่ำสุดที่ v สามารถ reach ได้ผ่านทาง descendants ที่อยู่บน stack
// - ถ้า low[v] == idx[v] → v เป็น root ของ SCC → pop stack จนถึง v
// Time: O(V + E) — single DFS pass

// Graph ตัวอย่าง: 5 nodes แบ่งเป็น 2 SCC
//   SCC1 = {A, B, C}  (cycle A → B → C → A)
//   SCC2 = {D, E}     (cycle D → E → D)
//   edge C → D เชื่อมสอง SCC (cross-edge)
const TARJAN_GRAPH = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    [0, 1],  // A → B
    [1, 2],  // B → C
    [2, 0],  // C → A
    [2, 3],  // C → D
    [3, 4],  // D → E
    [4, 3],  // E → D
  ],
  directed: true,
};

const T_N = TARJAN_GRAPH.nodes.length;

function tarjanBase(operation, description, codeLines, state, consoleOutput, phase) {
  return { operation, description, codeLines, ...state, consoleOutput, phase };
}

function tarjanSteps() {
  const steps = [];
  const adj = Array.from({ length: T_N }, () => []);
  for (const [u, v] of TARJAN_GRAPH.edges) adj[u].push(v);

  const idx = Array.from({ length: T_N }, () => -1);
  const low = Array.from({ length: T_N }, () => -1);
  const onStack = Array.from({ length: T_N }, () => false);
  const stack = [];
  const sccs = []; // array of { nodes: [ids], color: '#xxx' }
  let timer = 0;

  // Assign each SCC a stable color
  const SCC_COLORS = ['#a855f7', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e'];
  function sccColor(i) { return SCC_COLORS[i % SCC_COLORS.length]; }

  function sccState(extras = {}) {
    return {
      idx: idx.slice(),
      low: low.slice(),
      onStack: onStack.slice(),
      stack: stack.slice(),
      sccs: sccs.map((s) => ({ nodes: s.nodes.slice(), color: s.color })),
      ...extras,
    };
  }

  function strongconnect(v, path) {
    idx[v] = low[v] = timer++;
    stack.push(v);
    onStack[v] = true;

    steps.push(tarjanBase('visit',
      `strongconnect(${TARJAN_GRAPH.nodes[v]}) — idx[${TARJAN_GRAPH.nodes[v]}]=low[${TARJAN_GRAPH.nodes[v]}]=${idx[v]}, push ลง stack`,
      [13, 14],
      sccState({ current: v, path: path.slice(), highlightEdge: null }),
      `idx[${TARJAN_GRAPH.nodes[v]}] = low[${TARJAN_GRAPH.nodes[v]}] = ${idx[v]}\nstack = [${stack.map((i) => TARJAN_GRAPH.nodes[i]).join(', ')}]`,
      `visit ${TARJAN_GRAPH.nodes[v]}`));

    for (const w of adj[v]) {
      steps.push(tarjanBase('edge',
        `ตรวจ edge ${TARJAN_GRAPH.nodes[v]} → ${TARJAN_GRAPH.nodes[w]}`,
        [15],
        sccState({ current: v, neighbor: w, path: path.slice(), highlightEdge: [v, w] }),
        undefined,
        `edge ${TARJAN_GRAPH.nodes[v]}→${TARJAN_GRAPH.nodes[w]}`));

      if (idx[w] === -1) {
        steps.push(tarjanBase('recurse',
          `${TARJAN_GRAPH.nodes[w]} ยังไม่ถูกเยี่ยม (idx=-1) → recurse strongconnect(${TARJAN_GRAPH.nodes[w]})`,
          [16],
          sccState({ current: v, neighbor: w, path: [...path, v].slice(), highlightEdge: [v, w] }),
          undefined,
          `recurse → ${TARJAN_GRAPH.nodes[w]}`));
        strongconnect(w, [...path, v]);
        // After return: low[v] = min(low[v], low[w])
        const oldLow = low[v];
        low[v] = Math.min(low[v], low[w]);
        const updated = low[v] !== oldLow;
        steps.push(tarjanBase('low-update',
          `กลับจาก ${TARJAN_GRAPH.nodes[w]}: low[${TARJAN_GRAPH.nodes[v]}] = min(${oldLow}, low[${TARJAN_GRAPH.nodes[w]}]=${low[w]}) = ${low[v]}${updated ? ' (ลดลง)' : ''}`,
          [16],
          sccState({ current: v, neighbor: w, path: path.slice(), highlightEdge: [v, w] }),
          updated ? `low[${TARJAN_GRAPH.nodes[v]}] = ${low[v]}` : undefined,
          `low[${TARJAN_GRAPH.nodes[v]}] = ${low[v]}`));
      } else if (onStack[w]) {
        // Back/cross edge to node on stack
        const oldLow = low[v];
        low[v] = Math.min(low[v], idx[w]);
        const updated = low[v] !== oldLow;
        steps.push(tarjanBase('back-edge',
          `${TARJAN_GRAPH.nodes[w]} ถูกเยี่ยมแล้วและอยู่บน stack → back/cross edge: low[${TARJAN_GRAPH.nodes[v]}] = min(${oldLow}, idx[${TARJAN_GRAPH.nodes[w]}]=${idx[w]}) = ${low[v]}${updated ? ' (ลดลง)' : ''}`,
          [17],
          sccState({ current: v, neighbor: w, path: path.slice(), highlightEdge: [v, w] }),
          updated ? `low[${TARJAN_GRAPH.nodes[v]}] = ${low[v]}` : undefined,
          `back-edge → ${TARJAN_GRAPH.nodes[w]}`));
      } else {
        steps.push(tarjanBase('cross-skip',
          `${TARJAN_GRAPH.nodes[w]} ถูกเยี่ยมแล้ว แต่ไม่อยู่บน stack → อยู่ใน SCC อื่นแล้ว ข้าม`,
          [17],
          sccState({ current: v, neighbor: w, path: path.slice(), highlightEdge: [v, w] }),
          undefined,
          `skip ${TARJAN_GRAPH.nodes[w]}`));
      }
    }

    // Check if v is root of an SCC
    steps.push(tarjanBase('root-check',
      `ตรวจ root: low[${TARJAN_GRAPH.nodes[v]}]=${low[v]} ${low[v] === idx[v] ? '==' : '≠'} idx[${TARJAN_GRAPH.nodes[v]}]=${idx[v]}${low[v] === idx[v] ? ' → v เป็น root ของ SCC, pop' : ' → ไม่ใช่ root กลับขึ้น'}`,
      [19],
      sccState({ current: v, path: path.slice(), highlightEdge: null }),
      undefined,
      `root-check ${TARJAN_GRAPH.nodes[v]}`));

    if (low[v] === idx[v]) {
      const scc = [];
      let w;
      const color = sccColor(sccs.length);
      do {
        w = stack.pop();
        onStack[w] = false;
        scc.push(w);
        steps.push(tarjanBase('pop',
          `pop ${TARJAN_GRAPH.nodes[w]} ออกจาก stack — อยู่ใน SCC ที่มี root ${TARJAN_GRAPH.nodes[v]}`,
          [21],
          sccState({ current: v, popping: w, path: path.slice(), highlightEdge: null, pendingScc: { nodes: scc.slice(), color } }),
          undefined,
          `pop ${TARJAN_GRAPH.nodes[w]}`));
      } while (w !== v);
      sccs.push({ nodes: scc, color });

      steps.push(tarjanBase('scc-found',
        `พบ SCC #${sccs.length}: { ${scc.map((i) => TARJAN_GRAPH.nodes[i]).join(', ')} }`,
        [22],
        sccState({ current: v, path: path.slice(), highlightEdge: null }),
        `SCC #${sccs.length} = { ${scc.map((i) => TARJAN_GRAPH.nodes[i]).join(', ')} }`,
        `SCC #${sccs.length} พบ`));
    }
  }

  // ===== Init phase =====
  steps.push(tarjanBase('init',
    `เริ่ม Tarjan's SCC — ${T_N} nodes, ${TARJAN_GRAPH.edges.length} directed edges. ทุก idx = -1 (ยังไม่เยี่ยม)`,
    [1, 2, 3, 4, 6, 7, 8, 9, 10],
    sccState({ current: -1, path: [], highlightEdge: null }),
    `Graph:\n${TARJAN_GRAPH.edges.map(([u, v]) => `${TARJAN_GRAPH.nodes[u]} → ${TARJAN_GRAPH.nodes[v]}`).join('\n')}\n\nจะ DFS จากทุก node ที่ยังไม่เยี่ยม ใช้ low-link + stack เพื่อหา SCC`,
    'เริ่มต้น'));

  // Iterate all nodes
  for (let v = 0; v < T_N; v++) {
    if (idx[v] === -1) {
      steps.push(tarjanBase('start-dfs',
        `เริ่ม DFS ใหม่จาก ${TARJAN_GRAPH.nodes[v]} (ยังไม่ถูกเยี่ยม)`,
        [12],
        sccState({ current: v, path: [], highlightEdge: null }),
        undefined,
        `เริ่ม DFS จาก ${TARJAN_GRAPH.nodes[v]}`));
      strongconnect(v, []);
    }
  }

  // ===== Final =====
  steps.push(tarjanBase('done',
    `Tarjan's SCC เสร็จสิ้น — พบ ${sccs.length} SCC ทั้งหมด`,
    [],
    sccState({ current: -1, path: [], highlightEdge: null }),
    `All SCCs (${sccs.length}):\n${sccs.map((s, i) => `SCC #${i + 1} = { ${s.nodes.map((n) => TARJAN_GRAPH.nodes[n]).join(', ')} }`).join('\n')}`,
    'เสร็จสิ้น'));

  return steps;
}

// ===== Renderer =====
function tarjanRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const idx = step.idx;
  const low = step.low;
  const onStack = step.onStack;
  const stack = step.stack;
  const sccs = step.sccs || [];
  const current = step.current;
  const neighbor = step.neighbor;
  const popping = step.popping;
  const pendingScc = step.pendingScc;

  if (vizMeta) {
    const foundCount = sccs.length + (pendingScc ? 1 : 0);
    vizMeta.textContent = `${T_N} nodes · ${foundCount} SCC${foundCount !== 1 ? 's' : ''} · stack size = ${stack.length}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;gap:24px;padding:16px;flex-wrap:wrap;justify-content:center;align-items:flex-start' });

  // ===== Left: Graph SVG =====
  const positions = [];
  const radius = 100, cx = 150, cy = 130;
  for (let i = 0; i < T_N; i++) {
    const angle = (i / T_N) * 2 * Math.PI - Math.PI / 2;
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  }

  // Helper: which SCC owns a node (including pending)
  function sccOf(nodeIdx) {
    for (const s of sccs) if (s.nodes.includes(nodeIdx)) return s;
    if (pendingScc && pendingScc.nodes.includes(nodeIdx)) return pendingScc;
    return null;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '270');
  svg.setAttribute('viewBox', '0 0 300 270');

  // Draw edges
  TARJAN_GRAPH.edges.forEach(([u, v]) => {
    const dx = positions[v].x - positions[u].x;
    const dy = positions[v].y - positions[u].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 18;
    const x1 = positions[u].x + (dx / len) * nodeR;
    const y1 = positions[u].y + (dy / len) * nodeR;
    const x2 = positions[v].x - (dx / len) * nodeR;
    const y2 = positions[v].y - (dy / len) * nodeR;

    const isHl = step.highlightEdge && step.highlightEdge[0] === u && step.highlightEdge[1] === v;
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
  });

  // Draw nodes
  TARJAN_GRAPH.nodes.forEach((label, nodeIdx) => {
    const pos = positions[nodeIdx];
    const isCurrent = current === nodeIdx;
    const isNeighbor = neighbor === nodeIdx;
    const isPopping = popping === nodeIdx;
    const scc = sccOf(nodeIdx);
    const isOnStack = onStack[nodeIdx];

    let fill = 'var(--bg-card)', stroke = 'var(--text-dim)', textColor = 'var(--text)';
    if (scc) { fill = scc.color; stroke = scc.color; textColor = 'white'; }
    if (isOnStack && !scc) { fill = 'var(--bg-elev)'; stroke = 'var(--purple)'; }
    if (isPopping) { fill = 'var(--pink)'; stroke = 'var(--pink)'; textColor = 'white'; }
    if (isCurrent) { stroke = 'var(--amber)'; }
    if (isNeighbor) { stroke = 'var(--amber)'; }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', isCurrent || isNeighbor ? '3' : '2');
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

    // idx/low labels below
    if (idx[nodeIdx] !== -1) {
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(pos.x));
      lbl.setAttribute('y', String(pos.y + 32));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('font-family', 'monospace');
      lbl.setAttribute('fill', 'var(--text-muted)');
      lbl.textContent = `${idx[nodeIdx]}/${low[nodeIdx]}`;
      svg.appendChild(lbl);
    }
  });

  wrap.appendChild(svg);

  // ===== Right: stack + arrays =====
  const info = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:12px;min-width:220px;max-width:300px' });

  info.appendChild(window.DS.el('div', {
    style: 'padding:8px 12px;background:var(--bg-elev);border-radius:8px;font-size:12px;font-weight:600;color:var(--amber);border:1px solid var(--border)',
  }, step.phase || step.operation || ''));

  // Stack visualization
  info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em' }, 'stack (top → bottom):'));
  const stackWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column-reverse;gap:3px' });
  if (stack.length === 0) {
    stackWrap.appendChild(window.DS.el('div', { style: 'font-family:monospace;font-size:11px;color:var(--text-dim);padding:6px 0' }, '(empty)'));
  } else {
    stack.forEach((nodeIdx, i) => {
      const isTop = i === stack.length - 1;
      const isPoppingThis = popping === nodeIdx;
      stackWrap.appendChild(window.DS.el('div', {
        style: `padding:4px 10px;background:${isPoppingThis ? 'var(--pink)' : 'var(--bg-elev)'};border:1px solid ${isTop ? 'var(--amber)' : 'var(--border)'};border-radius:4px;font-family:monospace;font-size:11px;color:${isPoppingThis ? 'white' : 'var(--text)'};font-weight:${isTop ? 'bold' : 'normal'}`,
      }, `${TARJAN_GRAPH.nodes[nodeIdx]}${isTop ? ' ← top' : ''}`));
    });
  }
  info.appendChild(stackWrap);

  // idx/low arrays
  info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px' }, 'idx / low arrays:'));
  const arrTable = window.DS.el('table', { style: 'border-collapse:collapse;font-family:monospace;font-size:11px' });
  const trH = window.DS.el('tr');
  trH.appendChild(window.DS.el('th', { style: 'padding:2px 6px;color:var(--text-muted)' }, ''));
  for (let i = 0; i < T_N; i++) trH.appendChild(window.DS.el('th', { style: `padding:2px 6px;color:${current === i ? 'var(--amber)' : 'var(--text-muted)'};font-weight:${current === i ? 'bold' : 'normal'}` }, TARJAN_GRAPH.nodes[i]));
  arrTable.appendChild(trH);

  const trIdx = window.DS.el('tr');
  trIdx.appendChild(window.DS.el('th', { style: 'padding:2px 6px;color:var(--text-muted);text-align:right' }, 'idx'));
  for (let i = 0; i < T_N; i++) {
    trIdx.appendChild(window.DS.el('td', { style: `padding:2px 8px;text-align:center;color:${idx[i] === -1 ? 'var(--text-dim)' : 'var(--text)'}` }, idx[i] === -1 ? '–' : String(idx[i])));
  }
  arrTable.appendChild(trIdx);

  const trLow = window.DS.el('tr');
  trLow.appendChild(window.DS.el('th', { style: 'padding:2px 6px;color:var(--text-muted);text-align:right' }, 'low'));
  for (let i = 0; i < T_N; i++) {
    const scc = sccOf(i);
    let color = low[i] === -1 ? 'var(--text-dim)' : 'var(--text)';
    let bg = '';
    if (scc) { color = scc.color; bg = `color:${scc.color};font-weight:bold;`; }
    trLow.appendChild(window.DS.el('td', { style: `padding:2px 8px;text-align:center;${bg || `color:${color}`}` }, low[i] === -1 ? '–' : String(low[i])));
  }
  arrTable.appendChild(trLow);
  info.appendChild(arrTable);

  // Found SCCs
  if (sccs.length > 0 || pendingScc) {
    info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px' }, 'SCCs found:'));
    const allSccs = pendingScc ? [...sccs, pendingScc] : sccs;
    allSccs.forEach((s, i) => {
      info.appendChild(window.DS.el('div', {
        style: `padding:4px 10px;background:var(--bg-elev);border-left:3px solid ${s.color};border-radius:4px;font-family:monospace;font-size:11px;color:${s.color};font-weight:bold`,
      }, `SCC #${i + 1}: { ${s.nodes.map((n) => TARJAN_GRAPH.nodes[n]).join(', ')} }`));
    });
  }

  wrap.appendChild(info);
  vizArea.appendChild(wrap);
}

window.TARJAN_SCC = {
  run: tarjanSteps,
  render: tarjanRender,
};
