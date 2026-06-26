// ============ Tarjan's Strongly Connected Components (SCC) ============
//
// หา SCC ใน directed graph โดยใช้ DFS + low-link values + stack
// SCC = set ของ nodes ที่ไปถึงกันได้ทุกคู่ (cycle ที่ปิดสนิท)
// Time: O(V + E)

const SCC_GRAPH = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  edges: [
    [0, 1],  // A → B
    [1, 2],  // B → C
    [2, 0],  // C → A  (SCC: A,B,C)
    [1, 3],  // B → D
    [3, 4],  // D → E
    [4, 3],  // E → D  (SCC: D,E)
    [5, 6],  // F → G
    [6, 7],  // G → H
    [7, 5],  // H → F  (SCC: F,G,H)
  ],
  directed: true,
};

const SCC_N = SCC_GRAPH.nodes.length;

function sccBuildAdj() {
  const adj = Array.from({ length: SCC_N }, () => []);
  for (const [u, v] of SCC_GRAPH.edges) adj[u].push(v);
  adj.forEach((lst) => lst.sort((a, b) => a - b));
  return adj;
}

let sccStepCounter = 0;
function sccBase(operation, description, codeLines, indices, low, onStack, stack, visited, current, highlightEdge, sccs, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    indices: indices.slice(),
    low: low.slice(),
    onStack: onStack.slice(),
    stack: stack.slice(),
    visited: visited.slice(),
    current,
    highlightEdge,
    sccs: sccs.map((s) => s.slice()),
    consoleOutput, phase,
    nodes: SCC_GRAPH.nodes,
  };
}

function tarjanSCCSteps() {
  const steps = [];
  const adj = sccBuildAdj();
  const indices = Array.from({ length: SCC_N }, () => -1);
  const low = Array.from({ length: SCC_N }, () => -1);
  const onStack = Array.from({ length: SCC_N }, () => false);
  const stack = [];
  const visited = [];
  const sccs = [];
  let idx = 0;

  const baseState = (cur, hl) => sccBase('state', '', [], indices, low, onStack, stack, visited, cur, hl, sccs, undefined, '');

  steps.push(sccBase('init',
    `เริ่ม Tarjan's SCC — ใช้ DFS + low-link values + stack เพื่อหา strongly connected components`,
    [1, 2], indices, low, onStack, stack, visited, null, null, sccs,
    `Graph: ${SCC_N} nodes, ${SCC_GRAPH.edges.length} directed edges\nกด "Run" เพื่อเริ่ม`,
    'เริ่มต้น'));

  function strongconnect(v) {
    indices[v] = idx;
    low[v] = idx;
    idx++;
    stack.push(v);
    onStack[v] = true;
    visited.push(v);

    steps.push(sccBase('visit',
      `เยี่ยม ${SCC_GRAPH.nodes[v]} — index=${indices[v]}, low=${low[v]}  push ลง stack`,
      [3, 4, 5, 6, 7, 8], indices, low, onStack, stack, visited, v, null, sccs,
      `+ visit ${SCC_GRAPH.nodes[v]}\nindex=${indices[v]} low=${low[v]}\nstack=[${stack.map((i) => SCC_GRAPH.nodes[i]).join(',')}]`,
      'visit'));

    for (const w of adj[v]) {
      if (indices[w] === -1) {
        steps.push(sccBase('recurse',
          `${SCC_GRAPH.nodes[w]} ยังไม่ถูกเยี่ยม → recurse DFS ไป ${SCC_GRAPH.nodes[w]}`,
          [9, 10, 11], indices, low, onStack, stack, visited, v, [v, w], sccs,
          undefined, 'recurse'));
        strongconnect(w);
        // After return: low[v] = min(low[v], low[w])
        const oldLow = low[v];
        low[v] = Math.min(low[v], low[w]);
        steps.push(sccBase('update-low',
          `กลับจาก ${SCC_GRAPH.nodes[w]} → low[${SCC_GRAPH.nodes[v]}] = min(${oldLow}, low[${SCC_GRAPH.nodes[w]}]=${low[w]}) = ${low[v]}`,
          [12, 13], indices, low, onStack, stack, visited, v, [v, w], sccs,
          `low[${SCC_GRAPH.nodes[v]}] = ${low[v]}`,
          'update low'));
      } else if (onStack[w]) {
        const oldLow = low[v];
        low[v] = Math.min(low[v], indices[w]);
        steps.push(sccBase('back-edge',
          `${SCC_GRAPH.nodes[w]} อยู่ใน stack → back edge! low[${SCC_GRAPH.nodes[v]}] = min(${oldLow}, index[${SCC_GRAPH.nodes[w]}]=${indices[w]}) = ${low[v]}`,
          [14, 15, 16], indices, low, onStack, stack, visited, v, [v, w], sccs,
          `low[${SCC_GRAPH.nodes[v]}] = ${low[v]}`,
          'back edge'));
      } else {
        steps.push(sccBase('cross-edge',
          `${SCC_GRAPH.nodes[w]} เยี่ยมแล้วและไม่อยู่ใน stack → cross edge (ข้าม)`,
          [14], indices, low, onStack, stack, visited, v, [v, w], sccs,
          undefined, 'cross edge'));
      }
    }

    // Check if v is root of SCC
    if (low[v] === indices[v]) {
      steps.push(sccBase('root-check',
        `low[${SCC_GRAPH.nodes[v]}] = ${low[v]} == index[${SCC_GRAPH.nodes[v]}] = ${indices[v]} → ${SCC_GRAPH.nodes[v]} เป็น root ของ SCC! pop stack`,
        [17, 18, 19], indices, low, onStack, stack, visited, v, null, sccs,
        undefined, 'root of SCC'));

      const scc = [];
      let w;
      do {
        w = stack.pop();
        onStack[w] = false;
        scc.push(w);
        steps.push(sccBase('pop-scc',
          `pop ${SCC_GRAPH.nodes[w]} ออกจาก stack → เพิ่มเข้า SCC`,
          [20, 21, 22], indices, low, onStack, stack, visited, v, null, sccs,
          `+ ${SCC_GRAPH.nodes[w]} → SCC {${scc.map((i) => SCC_GRAPH.nodes[i]).join(',')}}`,
          'pop SCC'));
      } while (w !== v);

      sccs.push(scc);
      steps.push(sccBase('scc-found',
        `พบ SCC #${sccs.length}: {${scc.map((i) => SCC_GRAPH.nodes[i]).join(', ')}}`,
        [], indices, low, onStack, stack, visited, v, null, sccs,
        `SCC #${sccs.length}: {${scc.map((i) => SCC_GRAPH.nodes[i]).join(', ')}}`,
        'SCC found'));
    }
  }

  for (let v = 0; v < SCC_N; v++) {
    if (indices[v] === -1) {
      steps.push(sccBase('start-dfs',
        `เริ่ม DFS ใหม่จาก ${SCC_GRAPH.nodes[v]} (ยังไม่ถูกเยี่ยม)`,
        [1, 2], indices, low, onStack, stack, visited, v, null, sccs,
        undefined, 'start DFS'));
      strongconnect(v);
    }
  }

  steps.push(sccBase('done',
    `Tarjan's SCC เสร็จสิ้น — พบ ${sccs.length} SCC`,
    [], indices, low, onStack, stack, visited, null, null, sccs,
    `SCCs found:\n${sccs.map((s, i) => `#${i + 1}: {${s.map((n) => SCC_GRAPH.nodes[n]).join(', ')}}`).join('\n')}`,
    'เสร็จสิ้น'));

  return steps;
}

function sccInitialState() {
  return sccBase('init',
    `กราฟตั้งต้น (directed) — ${SCC_N} nodes, ${SCC_GRAPH.edges.length} edges  กด "Run" เพื่อหา SCC`,
    [], Array.from({ length: SCC_N }, () => -1), Array.from({ length: SCC_N }, () => -1),
    Array.from({ length: SCC_N }, () => false), [], [], null, null, [],
    `Graph:\n${SCC_GRAPH.edges.map(([u, v]) => `${SCC_GRAPH.nodes[u]} → ${SCC_GRAPH.nodes[v]}`).join('\n')}\n\nกด "Run Tarjan" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

// Render: graph (circular layout) + index/low/stack info panel
function sccRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const N = SCC_N;
  const positions = [];
  const radius = 150, cx = 200, cy = 180;
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  }

  if (vizMeta) {
    const onStackCount = step.onStack.filter((x) => x).length;
    vizMeta.textContent = `${N} nodes · ${step.sccs.length} SCCs found · stack: ${onStackCount}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;gap:24px;padding:16px;flex-wrap:wrap;justify-content:center' });

  // SVG graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '400');
  svg.setAttribute('height', '360');
  svg.setAttribute('viewBox', '0 0 400 360');

  // Build SCC color map
  const sccColor = {};
  const colors = ['#10b981', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4'];
  step.sccs.forEach((scc, idx) => {
    scc.forEach((n) => { sccColor[n] = colors[idx % colors.length]; });
  });

  // Draw edges
  SCC_GRAPH.edges.forEach(([u, v]) => {
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
  SCC_GRAPH.nodes.forEach((label, idx) => {
    const pos = positions[idx];
    const isVisited = step.visited.includes(idx);
    const isCurrent = step.current === idx;
    const isOnStack = step.onStack[idx];
    const sccCol = sccColor[idx];

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '18');
    if (isCurrent) {
      circle.setAttribute('fill', 'var(--amber)');
      circle.setAttribute('stroke', 'var(--amber)');
      circle.setAttribute('stroke-width', '3');
    } else if (sccCol) {
      circle.setAttribute('fill', sccCol);
      circle.setAttribute('stroke', sccCol);
      circle.setAttribute('stroke-width', '2');
    } else if (isOnStack) {
      circle.setAttribute('fill', 'var(--purple)');
      circle.setAttribute('stroke', 'var(--purple)');
      circle.setAttribute('stroke-width', '2');
    } else if (isVisited) {
      circle.setAttribute('fill', 'var(--bg-elev)');
      circle.setAttribute('stroke', 'var(--text-dim)');
      circle.setAttribute('stroke-width', '2');
    } else {
      circle.setAttribute('fill', 'var(--bg-card)');
      circle.setAttribute('stroke', 'var(--text-dim)');
      circle.setAttribute('stroke-width', '2');
    }
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(pos.x));
    text.setAttribute('y', String(pos.y + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', (isCurrent || sccCol || isOnStack) ? 'white' : 'var(--text)');
    text.textContent = label;
    svg.appendChild(text);

    // index/low labels below
    if (step.indices[idx] !== -1) {
      const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      infoText.setAttribute('x', String(pos.x));
      infoText.setAttribute('y', String(pos.y + 32));
      infoText.setAttribute('text-anchor', 'middle');
      infoText.setAttribute('font-size', '9');
      infoText.setAttribute('font-family', 'monospace');
      infoText.setAttribute('fill', 'var(--text-muted)');
      infoText.textContent = `i=${step.indices[idx]} l=${step.low[idx]}`;
      svg.appendChild(infoText);
    }
  });

  wrap.appendChild(svg);

  // Info panel: stack + SCCs
  const info = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:12px;min-width:200px' });

  // Stack
  info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em' }, 'Stack (on-stack nodes):'));
  const stackRow = window.DS.el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap;min-height:32px' });
  if (step.stack.length === 0) {
    stackRow.appendChild(window.DS.el('div', { style: 'color:var(--text-dim);font-family:monospace;font-size:12px;padding:6px' }, '(empty)'));
  } else {
    step.stack.forEach((n) => {
      const chip = window.DS.el('div', {
        style: 'padding:6px 12px;background:var(--purple);color:white;border-radius:6px;font-family:monospace;font-size:12px;font-weight:600',
      }, SCC_GRAPH.nodes[n]);
      stackRow.appendChild(chip);
    });
  }
  info.appendChild(stackRow);

  // SCCs found
  info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin-top:8px' }, `SCCs found (${step.sccs.length}):`));
  step.sccs.forEach((scc, idx) => {
    const sccRow = window.DS.el('div', {
      style: `padding:6px 10px;background:${colors[idx % colors.length]};color:white;border-radius:6px;font-family:monospace;font-size:12px;font-weight:600;margin-bottom:4px`,
    }, `SCC #${idx + 1}: { ${scc.map((n) => SCC_GRAPH.nodes[n]).join(', ')} }`);
    info.appendChild(sccRow);
  });

  wrap.appendChild(info);
  vizArea.appendChild(wrap);
}

window.TARJAN_SCC = {
  graph: SCC_GRAPH,
  run: tarjanSCCSteps,
  render: sccRender,
  initialState: sccInitialState,
};
