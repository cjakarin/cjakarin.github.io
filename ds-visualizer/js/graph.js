// ============ Graph data shared by Shortest Path (Dijkstra) + MST (Prim/Kruskal) ============

// Default sample graph — 6 nodes, weighted undirected
// Edges: [u, v, weight]
const SAMPLE_GRAPH = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    [0, 1, 4],   // A-B: 4
    [0, 2, 2],   // A-C: 2
    [1, 2, 1],   // B-C: 1
    [1, 3, 5],   // B-D: 5
    [2, 3, 8],   // C-D: 8
    [2, 4, 10],  // C-E: 10
    [3, 4, 2],   // D-E: 2
    [3, 5, 6],   // D-F: 6
    [4, 5, 3],   // E-F: 3
  ],
};

// Build adjacency list from edges
function buildAdjList(nodes, edges) {
  const adj = nodes.map(() => []);
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, w });
    adj[v].push({ to: u, w });
  }
  return adj;
}

// ============ SVG helper using proper namespace ============
const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    e.setAttribute(k, String(v));
  }
  return e;
}

// Layout nodes in a hexagon/circle for visualization
function getNodePositions(n, radius = 160, cx = 220, cy = 200) {
  const positions = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    positions.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return positions;
}

// ============ Step structure for graph algorithms ============
//
// step = {
//   description, codeLines, operation,
//   visited: Set of node indices (already finalized)
//   inQueue: Set of node indices currently in queue/frontier
//   current: current node index (being processed)
//   dist: array of distances (or Infinity)
//   parent: array of parent indices (for path reconstruction)
//   highlightEdge: [u, v] — edge being relaxed/added
//   inMST: array of [u,v] edges in MST (for Prim/Kruskal)
//   consoleOutput, phase
// }

function graphBase(operation, description, codeLines, state, consoleOutput, phase) {
  return { operation, description, codeLines, ...state, consoleOutput, phase };
}

// ============ Initial state builders (shown before algorithm runs) ============
// These show the full graph clearly with all nodes, edges, and weights.

function graphInitialDisplay(graph, source, algorithmName, hint) {
  const N = graph.nodes.length;
  // For directed graphs (topo, bellman-ford, astar), adj is already directional
  const edgeListStr = graph.edges
    .map(([u, v, w]) => `${graph.nodes[u]} ${graph.directed ? '→' : '—'} ${graph.nodes[v]} (w=${w})`)
    .join('\n');

  return graphBase('init',
    `กราฟตั้งต้น — ${N} nodes, ${graph.edges.length} edges${graph.directed ? ' (directed)' : ''}, source = ${graph.nodes[source]}  กด "Run ${algorithmName}" เพื่อเริ่ม`,
    [], {
      visited: [],
      inQueue: [source],
      current: source,
      dist: [],
      parent: Array.from({ length: N }, () => -1),
      highlightEdge: null,
      inMST: [],
      bfsOrder: [],
    },
    `Source: ${graph.nodes[source]}\n` +
    `Edges (${graph.edges.length}):\n${edgeListStr}\n\n` +
    hint,
    'กราฟตั้งต้น');
}

function dijkstraInitialState(graph, source) {
  return graphInitialDisplay(graph, source, 'Dijkstra',
    'กด "Run Dijkstra" เพื่อหา shortest path จาก source ไปทุก node');
}

function primInitialState(graph, source) {
  return graphInitialDisplay(graph, source, 'MST (Prim)',
    'กด "Run MST" เพื่อหา Minimum Spanning Tree ด้วย Prim');
}

function kruskalInitialState(graph) {
  const N = graph.nodes.length;
  const sortedEdges = graph.edges
    .map(([u, v, w], i) => ({ u, v, w, origIdx: i }))
    .sort((a, b) => a.w - b.w);
  const edgeListStr = graph.edges
    .map(([u, v, w]) => `${graph.nodes[u]}—${graph.nodes[v]} (w=${w})`)
    .join('\n');

  return graphBase('init',
    `กราฟตั้งต้น — ${N} nodes, ${graph.edges.length} edges  เรียง edges ตาม weight น้อยไปมากแล้ว`,
    [1, 2], {
      visited: [],
      inQueue: [],
      current: null,
      dist: [],
      parent: Array.from({ length: N }, (_, i) => i),
      highlightEdge: null,
      inMST: [],
      currentEdgeIdx: -1,
      rejectedEdges: [],
    },
    `Edges (sorted by weight):\n` +
    sortedEdges.map((e) => `${graph.nodes[e.u]}—${graph.nodes[e.v]} (w=${e.w})`).join('\n') +
    `\n\nกด "Run MST" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

function bfsInitialState(graph, source) {
  return graphInitialDisplay(graph, source, 'BFS',
    'กด "Run BFS" เพื่อเยี่ยมทุก node แบบ level-by-level');
}

function dfsInitialState(graph, source) {
  return graphInitialDisplay(graph, source, 'DFS',
    'กด "Run DFS" เพื่อเยี่ยมทุก node แบบ depth-first');
}

// ============ Dijkstra's Shortest Path ============

function dijkstraSteps(graph, source) {
  const steps = [];
  const N = graph.nodes.length;
  const adj = buildAdjList(graph.nodes, graph.edges);
  const dist = Array.from({ length: N }, () => Infinity);
  const parent = Array.from({ length: N }, () => -1);
  const visited = new Set();
  const inQueue = new Set([source]);
  dist[source] = 0;

  const baseState = () => ({
    visited: [...visited],
    inQueue: [...inQueue],
    current: null,
    dist: dist.slice(),
    parent: parent.slice(),
    highlightEdge: null,
    inMST: [],
  });

  steps.push(graphBase('init',
    `เริ่ม Dijkstra จาก source = ${graph.nodes[source]} — ตั้ง dist[source] = 0, อื่นๆ = ∞`,
    [12, 13, 14, 15, 16], baseState(), `dist[${graph.nodes[source]}] = 0`, 'เริ่มต้น'));

  while (visited.size < N) {
    // Find unvisited node with min dist
    let u = -1;
    let minDist = Infinity;
    for (let i = 0; i < N; i++) {
      if (!visited.has(i) && dist[i] < minDist) {
        minDist = dist[i];
        u = i;
      }
    }
    if (u === -1) break;

    inQueue.delete(u);
    visited.add(u);

    steps.push(graphBase('pick',
      `เลือก node ${graph.nodes[u]} (dist=${dist[u] === Infinity ? '∞' : dist[u]}) — ค่าน้อยสุดใน unvisited`,
      [18, 20, 21, 22, 23, 26, 27],
      { ...baseState(), current: u },
      undefined, 'เลือก min'));

    // Relax all neighbors
    for (const { to, w } of adj[u]) {
      if (visited.has(to)) continue;

      steps.push(graphBase('relax',
        `พิจารณา edge ${graph.nodes[u]} → ${graph.nodes[to]} (w=${w})  เทียบ dist[${graph.nodes[to]}]=${dist[to] === Infinity ? '∞' : dist[to]} กับ ${dist[u]} + ${w} = ${dist[u] + w}`,
        [30, 31, 32],
        { ...baseState(), current: u, highlightEdge: [u, to] },
        undefined, 'พิจารณา edge'));

      if (dist[u] + w < dist[to]) {
        const oldDist = dist[to];
        dist[to] = dist[u] + w;
        parent[to] = u;
        inQueue.add(to);

        steps.push(graphBase('update',
          `${dist[u]} + ${w} = ${dist[to]} < ${oldDist === Infinity ? '∞' : oldDist} → อัปเดต dist[${graph.nodes[to]}] = ${dist[to]}, parent[${graph.nodes[to]}] = ${graph.nodes[u]}`,
          [32, 33],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          `dist[${graph.nodes[to]}] = ${dist[to]}`, 'อัปเดต dist'));
      } else {
        steps.push(graphBase('skip',
          `${dist[u]} + ${w} = ${dist[u] + w} >= ${dist[to] === Infinity ? '∞' : dist[to]} → ไม่อัปเดต`,
          [32],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          undefined, 'ข้าม'));
      }
    }

    steps.push(graphBase('finalize',
      `mark ${graph.nodes[u]} เป็น visited (dist=${dist[u]} สั้นสุดแล้ว)`,
      [13],
      baseState(),
      undefined, 'finalize'));
  }

  // Build result path string
  const paths = [];
  for (let i = 0; i < N; i++) {
    if (i === source) continue;
    if (dist[i] === Infinity) {
      paths.push(`${graph.nodes[source]}→${graph.nodes[i]}: ∞ (ไม่ reachable)`);
    } else {
      const path = [graph.nodes[i]];
      let cur = i;
      while (parent[cur] !== -1) {
        cur = parent[cur];
        path.unshift(graph.nodes[cur]);
      }
      paths.push(`${graph.nodes[source]}→${graph.nodes[i]}: ${path.join('→')} (cost=${dist[i]})`);
    }
  }

  steps.push(graphBase('done',
    `Dijkstra เสร็จสิ้น — ระยะสั้นสุดจาก ${graph.nodes[source]}`,
    [],
    baseState(),
    `Results:\n${paths.join('\n')}`, 'เสร็จสิ้น'));

  return steps;
}

// ============ Prim's MST ============

function primSteps(graph, source = 0) {
  const steps = [];
  const N = graph.nodes.length;
  const adj = buildAdjList(graph.nodes, graph.edges);
  const inMST = new Set();
  const key = Array.from({ length: N }, () => Infinity);
  const parent = Array.from({ length: N }, () => -1);
  key[source] = 0;
  const mstEdges = [];

  const baseState = () => ({
    visited: [...inMST],
    inQueue: [],
    current: null,
    dist: key.slice(),
    parent: parent.slice(),
    highlightEdge: null,
    inMST: mstEdges.slice(),
  });

  steps.push(graphBase('init',
    `เริ่ม Prim จาก source = ${graph.nodes[source]} — key[source] = 0, อื่นๆ = ∞`,
    [12, 13, 14, 15, 17], baseState(), undefined, 'เริ่มต้น'));

  while (inMST.size < N) {
    // Find min key not in MST
    let u = -1;
    let minKey = Infinity;
    for (let i = 0; i < N; i++) {
      if (!inMST.has(i) && key[i] < minKey) {
        minKey = key[i];
        u = i;
      }
    }
    if (u === -1) break;

    inMST.add(u);
    if (parent[u] !== -1) {
      mstEdges.push([parent[u], u]);
    }

    steps.push(graphBase('pick',
      `เลือก node ${graph.nodes[u]} (key=${key[u]}) — น้อยสุดที่ยังไม่อยู่ใน MST${parent[u] !== -1 ? ` เพิ่ม edge ${graph.nodes[parent[u]]}→${graph.nodes[u]} เข้า MST` : ' (root ของ MST)'}`,
      [19, 20, 21, 22, 23, 26, 27],
      { ...baseState(), current: u, highlightEdge: parent[u] !== -1 ? [parent[u], u] : null },
      undefined, 'เพิ่มใน MST'));

    // Update keys of adjacent nodes
    for (const { to, w } of adj[u]) {
      if (!inMST.has(to)) {
        const oldKey = key[to];
        steps.push(graphBase('relax',
          `พิจารณา edge ${graph.nodes[u]} → ${graph.nodes[to]} (w=${w})  เทียบกับ key[${graph.nodes[to]}]=${oldKey === Infinity ? '∞' : oldKey}`,
          [29, 30],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          undefined, 'พิจารณา edge'));

        if (w < key[to]) {
          key[to] = w;
          parent[to] = u;
          steps.push(graphBase('update',
            `${w} < ${oldKey === Infinity ? '∞' : oldKey} → อัปเดต key[${graph.nodes[to]}] = ${w}, parent = ${graph.nodes[u]}`,
            [30, 31, 32],
            { ...baseState(), current: u, highlightEdge: [u, to] },
            `key[${graph.nodes[to]}] = ${w}`, 'อัปเดต key'));
        }
      }
    }
  }

  const totalWeight = mstEdges.reduce((s, [u, v]) => {
    const e = graph.edges.find(([a, b]) => (a === u && b === v) || (a === v && b === u));
    return s + (e ? e[2] : 0);
  }, 0);

  steps.push(graphBase('done',
    `Prim เสร็จสิ้น — MST มี ${mstEdges.length} edges, total weight = ${totalWeight}`,
    [],
    baseState(),
    `MST edges:\n${mstEdges.map(([u, v]) => `${graph.nodes[u]}—${graph.nodes[v]}`).join('\n')}\n\nTotal weight: ${totalWeight}`,
    'เสร็จสิ้น'));

  return steps;
}

// ============ Kruskal's MST ============

function kruskalSteps(graph) {
  const steps = [];
  const N = graph.nodes.length;
  // Sort edges by weight
  const sortedEdges = graph.edges
    .map(([u, v, w], i) => ({ u, v, w, origIdx: i }))
    .sort((a, b) => a.w - b.w);

  // DSU for cycle detection
  const parent = Array.from({ length: N }, (_, i) => i);
  const rank = Array.from({ length: N }, () => 0);
  function find(x) {
    while (parent[x] !== x) x = parent[x];
    return x;
  }
  function union(x, y) {
    const rx = find(x), ry = find(y);
    if (rx === ry) return false;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rank[rx]++; }
    return true;
  }

  const mstEdges = [];
  let edgeIdx = 0;

  steps.push(graphBase('init',
    `เริ่ม Kruskal — เรียง edges ตาม weight น้อยไปมาก  แล้ววนพิจารณาทีละ edge`,
    [25, 26], {
      visited: [],
      inQueue: [],
      current: null,
      dist: [],
      parent: parent.slice(),
      highlightEdge: null,
      inMST: [],
      currentEdgeIdx: -1,
      rejectedEdges: [],
    }, undefined, 'เริ่มต้น'));

  while (edgeIdx < sortedEdges.length && mstEdges.length < N - 1) {
    const edge = sortedEdges[edgeIdx];
    const { u, v, w } = edge;

    steps.push(graphBase('consider',
      `พิจารณา edge ${graph.nodes[u]}—${graph.nodes[v]} (w=${w}) — เช็คว่าเพิ่มแล้วเกิด cycle หรือไม่ (ด้วย DSU find)`,
      [29, 30],
      {
        visited: [],
        inQueue: [],
        current: null,
        dist: [],
        parent: parent.slice(),
        highlightEdge: [u, v],
        inMST: mstEdges.slice(),
        currentEdgeIdx: edgeIdx,
        rejectedEdges: [],
      },
      undefined, 'พิจารณา edge'));

    if (find(u) !== find(v)) {
      // No cycle — add to MST
      union(u, v);
      mstEdges.push([u, v]);
      steps.push(graphBase('accept',
        `find(${graph.nodes[u]}) ≠ find(${graph.nodes[v]}) → ไม่เกิด cycle → เพิ่ม edge เข้า MST  (ตอนนี้มี ${mstEdges.length}/${N - 1} edges)`,
        [30, 31, 32, 33, 34],
        {
          visited: [],
          inQueue: [],
          current: null,
          dist: [],
          parent: parent.slice(),
          highlightEdge: [u, v],
          inMST: mstEdges.slice(),
          currentEdgeIdx: edgeIdx,
          rejectedEdges: [],
        },
        `+ edge ${graph.nodes[u]}—${graph.nodes[v]} (w=${w})`, 'เพิ่มใน MST'));
    } else {
      steps.push(graphBase('reject',
        `find(${graph.nodes[u]}) == find(${graph.nodes[v]}) → เกิด cycle → ข้าม edge นี้`,
        [30],
        {
          visited: [],
          inQueue: [],
          current: null,
          dist: [],
          parent: parent.slice(),
          highlightEdge: [u, v],
          inMST: mstEdges.slice(),
          currentEdgeIdx: edgeIdx,
          rejectedEdges: [edgeIdx],
        },
        `✗ edge ${graph.nodes[u]}—${graph.nodes[v]} (cycle)`, 'ข้าม'));
    }

    edgeIdx++;
  }

  const totalWeight = mstEdges.reduce((s, [u, v]) => {
    const e = graph.edges.find(([a, b]) => (a === u && b === v) || (a === v && b === u));
    return s + (e ? e[2] : 0);
  }, 0);

  steps.push(graphBase('done',
    `Kruskal เสร็จสิ้น — MST มี ${mstEdges.length} edges, total weight = ${totalWeight}`,
    [],
    {
      visited: [],
      inQueue: [],
      current: null,
      dist: [],
      parent: parent.slice(),
      highlightEdge: null,
      inMST: mstEdges.slice(),
      currentEdgeIdx: -1,
      rejectedEdges: [],
    },
    `MST edges:\n${mstEdges.map(([u, v]) => `${graph.nodes[u]}—${graph.nodes[v]}`).join('\n')}\n\nTotal weight: ${totalWeight}`,
    'เสร็จสิ้น'));

  return steps;
}

// ============ Shared graph renderer ============

function graphRender(vizArea, vizMeta, step, graph = SAMPLE_GRAPH) {
  window.DS.clearChildren(vizArea);
  const N = graph.nodes.length;
  const positions = getNodePositions(N);
  const visited = new Set(step.visited || []);
  const inQueue = new Set(step.inQueue || []);
  const inMST = new Set((step.inMST || []).map(([u, v]) => `${u}-${v}`));
  const rejectedEdges = step.rejectedEdges || [];

  if (vizMeta) {
    let info = `${N} nodes · ${graph.edges.length} edges`;
    if (step.dist && step.dist.length > 0) {
      const visitedCount = visited.size;
      info += ` · ${visitedCount} visited`;
    }
    if (step.inMST && step.inMST.length > 0) {
      info += ` · ${step.inMST.length} MST edges`;
    }
    vizMeta.textContent = info;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:16px;padding:16px;align-items:center' });

  // SVG graph — MUST use createElementNS so browser renders it as SVG, not XHTML
  const svgWidth = 440;
  const svgHeight = 400;
  const svg = svgEl('svg', { width: svgWidth, height: svgHeight, viewBox: `0 0 ${svgWidth} ${svgHeight}` });

  // Draw edges
  const isDirected = graph.directed === true;
  graph.edges.forEach(([u, v, w], idx) => {
    const inMstEdge = inMST.has(`${u}-${v}`) || inMST.has(`${v}-${u}`);
    const isHighlighted = step.highlightEdge && (
      (step.highlightEdge[0] === u && step.highlightEdge[1] === v) ||
      (step.highlightEdge[0] === v && step.highlightEdge[1] === u)
    );
    const isRejected = rejectedEdges.includes(idx);

    // For directed graph, shorten line so arrow tip fits before node
    const dx = positions[v].x - positions[u].x;
    const dy = positions[v].y - positions[u].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 22;
    const x1 = isDirected ? positions[u].x + (dx / len) * nodeR : positions[u].x;
    const y1 = isDirected ? positions[u].y + (dy / len) * nodeR : positions[u].y;
    const x2 = isDirected ? positions[v].x - (dx / len) * nodeR : positions[v].x;
    const y2 = isDirected ? positions[v].y - (dy / len) * nodeR : positions[v].y;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));

    if (inMstEdge) {
      line.setAttribute('stroke', 'var(--emerald)');
      line.setAttribute('stroke-width', '4');
    } else if (isRejected) {
      line.setAttribute('stroke', 'var(--red)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '4,4');
      line.setAttribute('opacity', '0.4');
    } else if (isHighlighted) {
      line.setAttribute('stroke', 'var(--amber)');
      line.setAttribute('stroke-width', '3');
    } else {
      line.setAttribute('stroke', 'var(--text-dim)');
      line.setAttribute('stroke-width', '1.5');
    }
    svg.appendChild(line);

    // Arrow tip for directed graph
    if (isDirected) {
      const arrowSize = 8;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const ax1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
      const ay1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
      const ax2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
      const ay2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      arrow.setAttribute('points', `${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`);
      arrow.setAttribute('fill', inMstEdge ? 'var(--emerald)' : (isHighlighted ? 'var(--amber)' : 'var(--text-dim)'));
      svg.appendChild(arrow);
    }

    // Edge weight label
    const midX = (positions[u].x + positions[v].x) / 2;
    const midY = (positions[u].y + positions[v].y) / 2;
    const weightBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    weightBg.setAttribute('cx', String(midX));
    weightBg.setAttribute('cy', String(midY));
    weightBg.setAttribute('r', '11');
    weightBg.setAttribute('fill', inMstEdge ? 'var(--emerald)' : (isHighlighted ? 'var(--amber)' : 'var(--bg-elev)'));
    weightBg.setAttribute('stroke', 'var(--border)');
    svg.appendChild(weightBg);

    const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    weightText.setAttribute('x', String(midX));
    weightText.setAttribute('y', String(midY + 4));
    weightText.setAttribute('text-anchor', 'middle');
    weightText.setAttribute('font-size', '11');
    weightText.setAttribute('font-family', 'monospace');
    weightText.setAttribute('font-weight', 'bold');
    weightText.setAttribute('fill', inMstEdge || isHighlighted ? 'white' : 'var(--text-muted)');
    weightText.textContent = String(w);
    svg.appendChild(weightText);
  });

  // Draw nodes
  graph.nodes.forEach((label, idx) => {
    const pos = positions[idx];
    const isVisited = visited.has(idx);
    const isInQueue = inQueue.has(idx);
    const isCurrent = step.current === idx;

    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '20');
    if (isCurrent) {
      circle.setAttribute('fill', 'var(--amber)');
      circle.setAttribute('stroke', 'var(--amber)');
      circle.setAttribute('stroke-width', '3');
    } else if (isVisited) {
      circle.setAttribute('fill', 'var(--emerald)');
      circle.setAttribute('stroke', 'var(--emerald)');
      circle.setAttribute('stroke-width', '2');
    } else if (isInQueue) {
      circle.setAttribute('fill', 'var(--purple)');
      circle.setAttribute('stroke', 'var(--purple)');
      circle.setAttribute('stroke-width', '2');
    } else {
      circle.setAttribute('fill', 'var(--bg-card)');
      circle.setAttribute('stroke', 'var(--text-dim)');
      circle.setAttribute('stroke-width', '2');
    }
    svg.appendChild(circle);

    // Node label
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', String(pos.x));
    labelText.setAttribute('y', String(pos.y + 5));
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('font-size', '14');
    labelText.setAttribute('font-weight', 'bold');
    labelText.setAttribute('fill', (isCurrent || isVisited || isInQueue) ? 'white' : 'var(--text)');
    labelText.textContent = label;
    svg.appendChild(labelText);

    // Distance/Heuristic label below node
    if (graph.heuristic) {
      // A* mode: show g, h, f below each node
      const g = (step.dist && step.dist[idx] != null) ? step.dist[idx] : Infinity;
      const h = graph.heuristic[idx];
      const f = (g === Infinity) ? Infinity : g + h;
      const isGoal = graph.goal === idx;
      const infoLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      infoLabel.setAttribute('x', String(pos.x));
      infoLabel.setAttribute('y', String(pos.y + 36));
      infoLabel.setAttribute('text-anchor', 'middle');
      infoLabel.setAttribute('font-size', '10');
      infoLabel.setAttribute('font-family', 'monospace');
      infoLabel.setAttribute('fill', isGoal ? 'var(--emerald)' : 'var(--text-muted)');
      infoLabel.textContent = isGoal
        ? `🎯 GOAL  h=${h}`
        : `g=${g === Infinity ? '∞' : g} h=${h} f=${f === Infinity ? '∞' : f}`;
      svg.appendChild(infoLabel);
    } else if (step.dist && step.dist[idx] != null) {
      const distLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      distLabel.setAttribute('x', String(pos.x));
      distLabel.setAttribute('y', String(pos.y + 35));
      distLabel.setAttribute('text-anchor', 'middle');
      distLabel.setAttribute('font-size', '11');
      distLabel.setAttribute('font-family', 'monospace');
      distLabel.setAttribute('fill', 'var(--text-muted)');
      const d = step.dist[idx];
      distLabel.textContent = `d=${d === Infinity ? '∞' : d}`;
      svg.appendChild(distLabel);
    }
  });

  wrap.appendChild(svg);

  // ===== dist[] / key[] array (for Dijkstra/Prim) =====
  if (step.dist && step.dist.length > 0) {
    const arrayWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;max-width:600px' });
    arrayWrap.appendChild(window.DS.el('div', {
      style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-align:center',
    }, 'dist[] / key[] array:'));

    const row = window.DS.el('div', { style: 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap' });
    step.dist.forEach((d, idx) => {
      const isVisited = visited.has(idx);
      const isCurrent = step.current === idx;
      let role = '';
      if (isCurrent) role = 'current';
      else if (isVisited) role = 'found';
      const box = window.DS.makeNodeBox({
        value: d === Infinity ? '∞' : d,
        role,
        idxLabel: graph.nodes[idx],
        showIdx: true,
      });
      // Make idxLabel show as letter
      box.querySelector('.node-idx').textContent = graph.nodes[idx];
      row.appendChild(box);
    });
    arrayWrap.appendChild(row);
    wrap.appendChild(arrayWrap);
  }

  // ===== Sorted edges list (for Kruskal) =====
  if (step.currentEdgeIdx != null || (step.rejectedEdges && step.rejectedEdges.length > 0)) {
    const edgesWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;max-width:600px' });
    edgesWrap.appendChild(window.DS.el('div', {
      style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-align:center',
    }, 'Edges (sorted by weight):'));

    const sortedEdges = graph.edges
      .map(([u, v, w], i) => ({ u, v, w, origIdx: i }))
      .sort((a, b) => a.w - b.w);

    const row = window.DS.el('div', { style: 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap' });
    sortedEdges.forEach((e, sortedIdx) => {
      const isCurrent = step.currentEdgeIdx === sortedIdx;
      const isAccepted = (step.inMST || []).some(([u, v]) => (u === e.u && v === e.v) || (u === e.v && v === e.u));
      const isRejected = (step.rejectedEdges || []).includes(sortedIdx);

      let role = '';
      let style = '';
      if (isAccepted) { role = 'found'; }
      else if (isRejected) { role = 'removing'; style = 'opacity:0.5;'; }
      else if (isCurrent) { role = 'current'; }

      const box = window.DS.makeNodeBox({
        value: `${graph.nodes[e.u]}-${graph.nodes[e.v]}`,
        role,
        idxLabel: e.w,
        showIdx: true,
      });
      box.querySelector('.node-idx').textContent = `w=${e.w}`;
      box.style.cssText = style + box.style.cssText;
      row.appendChild(box);
    });
    edgesWrap.appendChild(row);
    wrap.appendChild(edgesWrap);
  }

  // Legend — adapt labels based on algorithm
  // Detect by checking the step's data shape:
  //   - Topo: operation is 'dequeue'/'enqueue' AND dist contains in-degree values (small ints)
  //   - MST Kruskal: operation 'accept'/'reject'/'consider'
  //   - MST Prim: operation 'pick'/'relax'/'update' AND inMST has edges (this distinguishes from Dijkstra)
  //   - BFS/DFS: operation 'dequeue'/'visit'/'push' AND no dist array
  //   - Dijkstra/Bellman-Ford/A*: operation 'pick'/'relax'/'update' AND dist array present AND inMST empty
  const op = step.operation || '';
  const hasDist = step.dist && step.dist.length > 0;
  const hasMSTEdges = step.inMST && step.inMST.length > 0;
  const hasRejectedEdges = step.rejectedEdges && step.rejectedEdges.length > 0;
  const hasCurrentEdgeIdx = step.currentEdgeIdx != null;

  let visitedLabel = 'visited';
  let treeEdgeLabel = 'tree edge';
  let inQueueLabel = 'in queue';

  if (op === 'accept' || op === 'reject' || op === 'consider' || hasCurrentEdgeIdx) {
    // Kruskal
    visitedLabel = 'in MST';
    treeEdgeLabel = 'MST edge';
    inQueueLabel = 'frontier';
  } else if (hasMSTEdges && (op === 'pick' || op === 'relax' || op === 'update' || op === 'done')) {
    // Prim (has MST edges during run)
    visitedLabel = 'in MST';
    treeEdgeLabel = 'MST edge';
    inQueueLabel = 'frontier';
  } else if (op === 'dequeue' || op === 'visit' || op === 'push') {
    // BFS/DFS
    visitedLabel = 'visited';
    treeEdgeLabel = 'tree edge';
    inQueueLabel = op === 'push' ? 'in stack' : 'in queue';
  } else if (hasDist && (op === 'pick' || op === 'relax' || op === 'update' || op === 'finalize' || op === 'skip' || op === 'iter' || op === 'check' || op === 'neg-cycle')) {
    // Dijkstra / Bellman-Ford / A*
    visitedLabel = 'visited';
    treeEdgeLabel = 'shortest path edge';
    inQueueLabel = 'in queue';
  } else if (op === 'enqueue') {
    // Topo Sort
    visitedLabel = 'in result';
    treeEdgeLabel = 'edge';
    inQueueLabel = 'in queue (in-deg=0)';
  }

  const legend = window.DS.el('div', { style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);justify-content:center;flex-wrap:wrap' });
  legend.innerHTML = `
    <span><span style="display:inline-block;width:10px;height:10px;background:var(--amber);border-radius:50%"></span> current</span>
    <span><span style="display:inline-block;width:10px;height:10px;background:var(--emerald);border-radius:50%"></span> ${visitedLabel}</span>
    <span><span style="display:inline-block;width:10px;height:10px;background:var(--purple);border-radius:50%"></span> ${inQueueLabel}</span>
    <span><span style="display:inline-block;width:14px;height:3px;background:var(--emerald)"></span> ${treeEdgeLabel}</span>
    <span><span style="display:inline-block;width:14px;height:3px;background:var(--amber)"></span> considering</span>
  `;
  wrap.appendChild(legend);

  vizArea.appendChild(wrap);
}

// ============ BFS (Breadth-First Search) ============

function collectTreeEdges(parent, N, source) {
  const edges = [];
  for (let i = 0; i < N; i++) {
    if (i !== source && parent[i] !== -1) edges.push([parent[i], i]);
  }
  return edges;
}

function bfsSteps(graph, source) {
  const steps = [];
  const N = graph.nodes.length;
  const adj = buildAdjList(graph.nodes, graph.edges);
  adj.forEach((lst) => lst.sort((a, b) => a.to - b.to));

  const visited = new Set([source]);
  const queue = [source];
  const parent = Array.from({ length: N }, () => -1);
  const order = [];

  const baseState = () => ({
    visited: [...visited],
    inQueue: queue.slice(),
    current: null,
    dist: [],
    parent: parent.slice(),
    highlightEdge: null,
    inMST: collectTreeEdges(parent, N, source),
    bfsOrder: order.slice(),
  });

  steps.push(graphBase('init',
    `เริ่ม BFS จาก source = ${graph.nodes[source]} — enqueue source, mark visited`,
    [12, 13, 14], baseState(),
    `queue = [${graph.nodes[source]}]\nvisited = {${graph.nodes[source]}}`,
    'เริ่มต้น'));

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    steps.push(graphBase('dequeue',
      `dequeue: เอา ${graph.nodes[u]} ออกจาก queue → ประมวลผล (เยี่ยม ${graph.nodes[u]})`,
      [16, 17, 18, 19],
      { ...baseState(), current: u },
      undefined, 'dequeue'));

    for (const { to } of adj[u]) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to);
        parent[to] = u;

        steps.push(graphBase('visit',
          `เพื่อนบ้าน ${graph.nodes[to]} ยังไม่ visited → mark visited + enqueue (ผ่าน edge ${graph.nodes[u]}—${graph.nodes[to]})`,
          [21, 22, 23, 24],
          {
            ...baseState(),
            current: u,
            highlightEdge: [u, to],
          },
          `+ visit ${graph.nodes[to]}\nqueue = [${queue.map((i) => graph.nodes[i]).join(',')}]`,
          'visit'));
      } else {
        steps.push(graphBase('skip',
          `เพื่อนบ้าน ${graph.nodes[to]} visited แล้ว → ข้าม`,
          [21, 22],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          undefined, 'ข้าม'));
      }
    }
  }

  steps.push(graphBase('done',
    `BFS เสร็จสิ้น — เยี่ยมครบ ${visited.size} node`,
    [],
    baseState(),
    `Visit order: ${order.map((i) => graph.nodes[i]).join(' → ')}`,
    'เสร็จสิ้น'));

  return steps;
}

// ============ DFS (Depth-First Search) ============

function dfsSteps(graph, source) {
  const steps = [];
  const N = graph.nodes.length;
  const adj = buildAdjList(graph.nodes, graph.edges);
  adj.forEach((lst) => lst.sort((a, b) => a.to - b.to));

  const visited = new Set();
  // "visitedParent" — parent of a node once it's actually visited (popped & marked)
  // This is what we visualize as the DFS tree edge (only added when node is visited).
  const visitedParent = Array.from({ length: N }, () => -1);
  // "pushParent" — track which node pushed this onto the stack (for info only, not visualized as tree edge)
  const pushParent = Array.from({ length: N }, () => -1);
  const order = [];
  const stack = [];

  const baseState = () => ({
    visited: [...visited],
    inQueue: stack.slice(),
    current: null,
    dist: [],
    parent: visitedParent.slice(),
    highlightEdge: null,
    inMST: collectTreeEdges(visitedParent, N, source),
    bfsOrder: order.slice(),
  });

  stack.push(source);
  steps.push(graphBase('init',
    `เริ่ม DFS จาก source = ${graph.nodes[source]} — push source ลง stack`,
    [11, 12], baseState(),
    `stack = [${graph.nodes[source]}]`, 'เริ่มต้น'));

  while (stack.length > 0) {
    const u = stack.pop();

    if (visited.has(u)) {
      steps.push(graphBase('skip',
        `${graph.nodes[u]} visited แล้ว → ข้าม (pop ทิ้ง)`,
        [14, 15, 16, 18],
        { ...baseState(), current: u },
        undefined, 'ข้าม'));
      continue;
    }

    visited.add(u);
    order.push(u);
    // Set the tree edge: u's parent in the DFS tree is whoever pushed u onto the stack
    // (For source, pushParent[source] = -1, so no tree edge.)
    if (pushParent[u] !== -1) {
      visitedParent[u] = pushParent[u];
    }

    steps.push(graphBase('visit',
      `pop ${graph.nodes[u]} จาก stack → mark visited → ประมวลผล${pushParent[u] !== -1 ? ` (tree edge: ${graph.nodes[pushParent[u]]}→${graph.nodes[u]})` : ''}`,
      [14, 15, 16, 18, 19, 20],
      { ...baseState(), current: u, highlightEdge: pushParent[u] !== -1 ? [pushParent[u], u] : null },
      `+ visit ${graph.nodes[u]}\nstack = [${stack.map((i) => graph.nodes[i]).join(',')}]`,
      'visit'));

    // Push neighbors in reverse order so smallest is processed first
    const neighbors = adj[u].filter(({ to }) => !visited.has(to)).reverse();
    for (const { to } of neighbors) {
      if (!visited.has(to) && !stack.includes(to)) {
        pushParent[to] = u;
        stack.push(to);
        steps.push(graphBase('push',
          `push ${graph.nodes[to]} ลง stack (เพื่อนบ้านของ ${graph.nodes[u]} ที่ยังไม่ visited)`,
          [23, 24, 25, 26],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          `+ push ${graph.nodes[to]}\nstack = [${stack.map((i) => graph.nodes[i]).join(',')}]`,
          'push'));
      } else if (stack.includes(to)) {
        steps.push(graphBase('skip',
          `${graph.nodes[to]} อยู่ใน stack แล้ว → ไม่ push ซ้ำ`,
          [23, 24, 25],
          { ...baseState(), current: u, highlightEdge: [u, to] },
          undefined, 'ข้าม'));
      }
    }
  }

  steps.push(graphBase('done',
    `DFS เสร็จสิ้น — เยี่ยมครบ ${visited.size} node`,
    [],
    baseState(),
    `Visit order: ${order.map((i) => graph.nodes[i]).join(' → ')}`,
    'เสร็จสิ้น'));

  return steps;
}

// Initial states for BFS/DFS
function bfsInitialState(graph, source) {
  const N = graph.nodes.length;
  return graphBase('init',
    `กราฟตั้งต้น — ${N} nodes, ${graph.edges.length} edges, source = ${graph.nodes[source]}  กด "Run BFS" เพื่อเริ่ม`,
    [], {
      visited: [],
      inQueue: [source],
      current: source,
      dist: [],
      parent: Array.from({ length: N }, () => -1),
      highlightEdge: null,
      inMST: [],
      bfsOrder: [],
    },
    `Source: ${graph.nodes[source]}\nกด "Run BFS" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

function dfsInitialState(graph, source) {
  const N = graph.nodes.length;
  return graphBase('init',
    `กราฟตั้งต้น — ${N} nodes, ${graph.edges.length} edges, source = ${graph.nodes[source]}  กด "Run DFS" เพื่อเริ่ม`,
    [], {
      visited: [],
      inQueue: [source],
      current: source,
      dist: [],
      parent: Array.from({ length: N }, () => -1),
      highlightEdge: null,
      inMST: [],
      bfsOrder: [],
    },
    `Source: ${graph.nodes[source]}\nกด "Run DFS" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

// ============ Sample Graphs for New Algorithms ============

// DAG for Topological Sort (directed, acyclic)
const DAG_GRAPH = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  edges: [
    [0, 1, 1],   // A → B
    [0, 2, 1],   // A → C
    [1, 3, 1],   // B → D
    [1, 4, 1],   // B → E
    [2, 4, 1],   // C → E
    [3, 5, 1],   // D → F
    [4, 5, 1],   // E → F
    [4, 6, 1],   // E → G
    [5, 6, 1],   // F → G
  ],
  directed: true,
};

// Graph with negative weights for Bellman-Ford (no negative cycle)
const BELLMAN_GRAPH = {
  nodes: ['S', 'A', 'B', 'C', 'D'],
  edges: [
    [0, 1, 4],   // S → A: 4
    [0, 2, 5],   // S → B: 5
    [1, 2, -3],  // A → B: -3 (negative!)
    [2, 3, 4],   // B → C: 4
    [3, 4, 2],   // C → D: 2
    [4, 1, -1],  // D → A: -1 (negative!)
  ],
  directed: true,
};

// Grid-like graph for A* (positions matter for heuristic)
const ASTAR_GRAPH = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'G'],
  edges: [
    [0, 1, 1],   // S — A: 1
    [0, 2, 4],   // S — B: 4
    [1, 2, 2],   // A — B: 2
    [1, 3, 5],   // A — C: 5
    [2, 3, 2],   // B — C: 2
    [2, 4, 3],   // B — D: 3
    [3, 5, 2],   // C — G: 2 (G is goal)
    [4, 5, 4],   // D — G: 4
  ],
  directed: false,
  // Heuristic: straight-line estimate to goal (index 5 = 'G')
  heuristic: [7, 6, 4, 2, 4, 0],  // h(S)=7, h(A)=6, h(B)=4, h(C)=2, h(D)=4, h(G)=0
  goal: 5,
};

// ============ Topological Sort (Kahn's algorithm - BFS-like) ============

function topoSteps(graph) {
  const steps = [];
  const N = graph.nodes.length;
  // Build in-degree array (directed graph)
  const inDegree = Array.from({ length: N }, () => 0);
  const adj = Array.from({ length: N }, () => []);
  for (const [u, v] of graph.edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  const baseState = (queue, order) => ({
    visited: order.slice(),
    inQueue: queue.slice(),
    current: null,
    dist: inDegree.slice(), // reuse dist to show in-degree
    parent: Array.from({ length: N }, () => -1),
    highlightEdge: null,
    inMST: [],
    bfsOrder: order.slice(),
  });

  // Initial: find all nodes with in-degree 0
  let queue = [];
  for (let i = 0; i < N; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  const order = [];

  steps.push(graphBase('init',
    `เริ่ม Topological Sort (Kahn's) — หา nodes ที่มี in-degree = 0 (ไม่มี edge เข้า) ใส่ queue  ${queue.map((i) => graph.nodes[i]).join(', ')}`,
    [12, 13, 14], baseState(queue, order),
    `In-degree: ${inDegree.map((d, i) => `${graph.nodes[i]}=${d}`).join(', ')}\n` +
    `Queue (in-deg=0): [${queue.map((i) => graph.nodes[i]).join(',')}]`,
    'เริ่มต้น'));

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    steps.push(graphBase('dequeue',
      `dequeue ${graph.nodes[u]} → เพิ่มเข้า result order (ลำดับที่ ${order.length})`,
      [18, 19, 20],
      { ...baseState(queue, order), current: u },
      `+ add ${graph.nodes[u]} to order\nOrder: ${order.map((i) => graph.nodes[i]).join(' → ')}`,
      'dequeue'));

    // Reduce in-degree of all neighbors
    for (const v of adj[u]) {
      inDegree[v]--;
      steps.push(graphBase('relax',
        `ลด in-degree ของ ${graph.nodes[v]} (จาก ${inDegree[v] + 1} → ${inDegree[v]}) เพราะ edge ${graph.nodes[u]}→${graph.nodes[v]} ถูกตัด`,
        [22, 23],
        { ...baseState(queue, order), current: u, highlightEdge: [u, v] },
        `${graph.nodes[v]}.in-deg = ${inDegree[v]}`,
        'ลด in-degree'));

      if (inDegree[v] === 0) {
        queue.push(v);
        steps.push(graphBase('enqueue',
          `${graph.nodes[v]}.in-deg = 0 → enqueue (พร้อมประมวลผล)`,
          [23, 24],
          { ...baseState(queue, order), current: u, highlightEdge: [u, v] },
          `+ enqueue ${graph.nodes[v]}\nQueue: [${queue.map((i) => graph.nodes[i]).join(',')}]`,
          'enqueue'));
      }
    }
  }

  if (order.length < N) {
    steps.push(graphBase('done',
      `⚠ Cycle detected! เยี่ยมได้แค่ ${order.length}/${N} node → graph ไม่ใช่ DAG`,
      [29],
      baseState(queue, order),
      `Cycle detected — ไม่สามารถ topological sort ได้\nVisited: ${order.map((i) => graph.nodes[i]).join(' → ')}`,
      'Cycle'));
  } else {
    steps.push(graphBase('done',
      `Topological Sort เสร็จสิ้น — ลำดับที่ถูกต้อง ${order.length} node`,
      [30],
      baseState(queue, order),
      `Topological order:\n${order.map((i) => graph.nodes[i]).join(' → ')}`,
      'เสร็จสิ้น'));
  }

  return steps;
}

function topoInitialState(graph) {
  const N = graph.nodes.length;
  const inDegree = Array.from({ length: N }, () => 0);
  for (const [u, v] of graph.edges) inDegree[v]++;
  const zeroDeg = [];
  for (let i = 0; i < N; i++) if (inDegree[i] === 0) zeroDeg.push(i);

  return graphBase('init',
    `กราฟตั้งต้น (DAG) — ${N} nodes, ${graph.edges.length} directed edges  กด "Run Topo Sort" เพื่อเริ่ม`,
    [], {
      visited: [],
      inQueue: zeroDeg,
      current: null,
      dist: inDegree.slice(),
      parent: Array.from({ length: N }, () => -1),
      highlightEdge: null,
      inMST: [],
      bfsOrder: [],
    },
    `In-degree:\n${graph.nodes.map((n, i) => `  ${n}: ${inDegree[i]}`).join('\n')}\n\n` +
    `Start nodes (in-deg=0): ${zeroDeg.map((i) => graph.nodes[i]).join(', ')}\n\n` +
    `กด "Run Topo Sort" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

// ============ Bellman-Ford (handles negative weights) ============

function bellmanFordSteps(graph, source) {
  const steps = [];
  const N = graph.nodes.length;
  const E = graph.edges.length;
  const dist = Array.from({ length: N }, () => Infinity);
  const parent = Array.from({ length: N }, () => -1);
  dist[source] = 0;

  const baseState = (current = null, highlightEdge = null) => ({
    visited: [],
    inQueue: [],
    current,
    dist: dist.slice(),
    parent: parent.slice(),
    highlightEdge,
    inMST: [],
  });

  steps.push(graphBase('init',
    `เริ่ม Bellman-Ford จาก source = ${graph.nodes[source]} — dist[source]=0, อื่นๆ = ∞  จะ relax ทุก edge ${N - 1} รอบ`,
    [13, 14], baseState(),
    `dist: ${graph.nodes.map((n, i) => `${n}=${dist[i] === Infinity ? '∞' : dist[i]}`).join(', ')}\n` +
    `จะวน ${N - 1} รอบ (V-1 ครั้ง)`,
    'เริ่มต้น'));

  // V-1 iterations
  for (let iter = 1; iter <= N - 1; iter++) {
    steps.push(graphBase('iter',
      `=== รอบที่ ${iter}/${N - 1} === — วนพิจารณาทุก edge เพื่อ relax`,
      [17, 18],
      baseState(),
      undefined, `รอบที่ ${iter}`));

    let anyUpdate = false;
    for (let ei = 0; ei < E; ei++) {
      const [u, v, w] = graph.edges[ei];
      const oldDist = dist[v];

      steps.push(graphBase('relax',
        `พิจารณา edge ${graph.nodes[u]}→${graph.nodes[v]} (w=${w})  เทียบ dist[${graph.nodes[v]}]=${dist[v] === Infinity ? '∞' : dist[v]} กับ dist[${graph.nodes[u]}]+${w}=${dist[u] === Infinity ? '∞' : dist[u] + w}`,
        [18, 19, 20, 21],
        baseState(u, [u, v]),
        undefined, 'พิจารณา edge'));

      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        parent[v] = u;
        anyUpdate = true;
        steps.push(graphBase('update',
          `${dist[u]} + ${w} = ${dist[v]} < ${oldDist === Infinity ? '∞' : oldDist} → อัปเดต dist[${graph.nodes[v]}] = ${dist[v]}`,
          [19, 20, 21],
          baseState(u, [u, v]),
          `dist[${graph.nodes[v]}] = ${dist[v]}`,
          'อัปเดต'));
      } else {
        steps.push(graphBase('skip',
          `ไม่อัปเดต (${dist[u] === Infinity ? '∞' : dist[u]} + ${w} = ${dist[u] === Infinity ? '∞' : dist[u] + w} >= ${dist[v] === Infinity ? '∞' : dist[v]})`,
          [19, 20],
          baseState(u, [u, v]),
          undefined, 'ข้าม'));
      }
    }

    if (!anyUpdate) {
      steps.push(graphBase('iter-done',
        `รอบนี้ไม่มีการอัปเดต → หยุดก่อน (shortest path เสถียรแล้ว)`,
        [],
        baseState(),
        `หยุดที่รอบ ${iter} — ไม่มี update`,
        'หยุดก่อน'));
      break;
    }
  }

  // Check for negative cycle (extra iteration)
  steps.push(graphBase('check',
    `ตรวจ negative cycle — วนรอบที่ ${N} ถ้ายังมี update แปลว่ามี negative cycle`,
    [27, 28, 29],
    baseState(),
    undefined, 'ตรวจ cycle'));

  let hasNegCycle = false;
  for (let ei = 0; ei < E; ei++) {
    const [u, v, w] = graph.edges[ei];
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegCycle = true;
      steps.push(graphBase('neg-cycle',
        `⚠ พบ negative cycle! edge ${graph.nodes[u]}→${graph.nodes[v]} ยัง relax ได้อีก → ไม่มี shortest path`,
        [12, 13],
        baseState(u, [u, v]),
        `Negative cycle detected!`,
        'Negative cycle'));
      break;
    }
  }

  if (!hasNegCycle) {
    // Build path strings
    const paths = [];
    for (let i = 0; i < N; i++) {
      if (i === source) continue;
      if (dist[i] === Infinity) {
        paths.push(`${graph.nodes[source]}→${graph.nodes[i]}: ∞`);
      } else {
        const path = [graph.nodes[i]];
        let cur = i;
        while (parent[cur] !== -1) {
          cur = parent[cur];
          path.unshift(graph.nodes[cur]);
        }
        paths.push(`${graph.nodes[source]}→${graph.nodes[i]}: ${path.join('→')} (cost=${dist[i]})`);
      }
    }

    steps.push(graphBase('done',
      `Bellman-Ford เสร็จสิ้น — ไม่พบ negative cycle`,
      [],
      baseState(),
      `Shortest paths from ${graph.nodes[source]}:\n${paths.join('\n')}`,
      'เสร็จสิ้น'));
  }

  return steps;
}

function bellmanFordInitialState(graph, source) {
  return graphInitialDisplay(graph, source, 'Bellman-Ford',
    `กด "Run Bellman-Ford" เพื่อหา shortest path (รองรับ negative weights)`);
}

// ============ A* Search (uses heuristic) ============

function astarSteps(graph, source, goal) {
  const steps = [];
  const N = graph.nodes.length;
  const adj = buildAdjList(graph.nodes, graph.edges);
  adj.forEach((lst) => lst.sort((a, b) => a.to - b.to));
  const h = graph.heuristic;

  const dist = Array.from({ length: N }, () => Infinity);  // g(n): cost from source
  const fScore = Array.from({ length: N }, () => Infinity); // f(n) = g(n) + h(n)
  const parent = Array.from({ length: N }, () => -1);
  dist[source] = 0;
  fScore[source] = h[source];

  // Open set: nodes to explore (sorted by fScore)
  let openSet = [source];
  const closedSet = new Set();

  const baseState = (current = null, highlightEdge = null) => ({
    visited: [...closedSet],
    inQueue: openSet.slice(),
    current,
    dist: dist.slice(),
    parent: parent.slice(),
    highlightEdge,
    inMST: [],
    bfsOrder: [],
  });

  steps.push(graphBase('init',
    `เริ่ม A* จาก ${graph.nodes[source]} → ${graph.nodes[goal]}  f(n) = g(n) + h(n)  g(${graph.nodes[source]})=0, h(${graph.nodes[source]})=${h[source]}, f=${fScore[source]}`,
    [16, 17, 18, 20, 21, 24, 25, 26, 27], baseState(),
    `Heuristic h(n):\n${graph.nodes.map((n, i) => `  ${n}: ${h[i]}`).join('\n')}\n\n` +
    `Open set: [${graph.nodes[source]}] (f=${fScore[source]})`,
    'เริ่มต้น'));

  while (openSet.length > 0) {
    // Pick node with lowest fScore
    openSet.sort((a, b) => fScore[a] - fScore[b]);
    const u = openSet.shift();

    if (u === goal) {
      // Reconstruct path
      const path = [graph.nodes[goal]];
      let cur = goal;
      while (parent[cur] !== -1) {
        cur = parent[cur];
        path.unshift(graph.nodes[cur]);
      }
      steps.push(graphBase('done',
        `🎯 ถึง goal ${graph.nodes[goal]}! A* เสร็จสิ้น — พบ shortest path ความยาว ${dist[goal]}`,
        [50, 51, 52, 53, 54],
        baseState(u),
        `Path: ${path.join(' → ')}\nTotal cost: ${dist[goal]}\n` +
        `เยี่ยม ${closedSet.size + 1} node (vs Dijkstra ที่เยี่ยมทุก node)`,
        'เสร็จสิ้น'));
      return steps;
    }

    closedSet.add(u);
    steps.push(graphBase('pick',
      `เลือก ${graph.nodes[u]} (f=${fScore[u]} = g=${dist[u]} + h=${h[u]}) — น้อยสุดใน open set`,
      [31, 32, 33, 34, 35],
      baseState(u),
      `+ visit ${graph.nodes[u]}\nOpen: [${openSet.map((i) => graph.nodes[i]).join(',')}]`,
      'เลือก f น้อยสุด'));

    for (const { to, w } of adj[u]) {
      if (closedSet.has(to)) {
        steps.push(graphBase('skip',
          `${graph.nodes[to]} อยู่ใน closed set → ข้าม`,
          [37, 38],
          { ...baseState(u), highlightEdge: [u, to] },
          undefined, 'ข้าม'));
        continue;
      }

      const tentativeG = dist[u] + w;
      steps.push(graphBase('relax',
        `พิจารณา edge ${graph.nodes[u]}—${graph.nodes[to]} (w=${w})  tentative g(${graph.nodes[to]}) = ${dist[u]} + ${w} = ${tentativeG}`,
        [37, 38, 39, 40],
        { ...baseState(u), highlightEdge: [u, to] },
        undefined, 'พิจารณา'));

      if (tentativeG < dist[to]) {
        const oldG = dist[to];
        dist[to] = tentativeG;
        fScore[to] = tentativeG + h[to];
        parent[to] = u;
        if (!openSet.includes(to)) openSet.push(to);

        steps.push(graphBase('update',
          `${tentativeG} < ${oldG === Infinity ? '∞' : oldG} → อัปเดต g(${graph.nodes[to]})=${tentativeG}, f=${fScore[to]} (${tentativeG}+${h[to]})  เพิ่ม ${graph.nodes[to]} เข้า open set`,
          [40, 41, 42, 43, 44],
          { ...baseState(u), highlightEdge: [u, to] },
          `g(${graph.nodes[to]})=${tentativeG}, f=${fScore[to]}\nOpen: [${openSet.map((i) => `${graph.nodes[i]}(f=${fScore[i]})`).join(',')}]`,
          'อัปเดต'));
      } else {
        steps.push(graphBase('skip',
          `${tentativeG} >= ${dist[to] === Infinity ? '∞' : dist[to]} → ไม่อัปเดต`,
          [40],
          { ...baseState(u), highlightEdge: [u, to] },
          undefined, 'ข้าม'));
      }
    }
  }

  steps.push(graphBase('done',
    `A* เสร็จสิ้น — ไม่พบ path ไป goal ${graph.nodes[goal]}`,
    [],
    baseState(),
    `No path to ${graph.nodes[goal]}`,
    'เสร็จสิ้น'));
  return steps;
}

function astarInitialState(graph, source, goal) {
  const N = graph.nodes.length;
  return graphBase('init',
    `กราฟตั้งต้น — ${N} nodes, ${graph.edges.length} edges, source = ${graph.nodes[source]}, goal = ${graph.nodes[goal]}  กด "Run A*" เพื่อเริ่ม`,
    [], {
      visited: [],
      inQueue: [source],
      current: source,
      dist: Array.from({ length: N }, () => Infinity),
      parent: Array.from({ length: N }, () => -1),
      highlightEdge: null,
      inMST: [],
      bfsOrder: [],
    },
    `Source: ${graph.nodes[source]}, Goal: ${graph.nodes[goal]}\n\n` +
    `Heuristic h(n) (estimate to goal ${graph.nodes[goal]}):\n${graph.nodes.map((n, i) => `  ${n}: ${graph.heuristic[i]}`).join('\n')}\n\n` +
    `Edges:\n${graph.edges.map(([u, v, w]) => `${graph.nodes[u]}—${graph.nodes[v]} (w=${w})`).join('\n')}\n\n` +
    `กด "Run A*" เพื่อเริ่ม`,
    'กราฟตั้งต้น');
}

window.GRAPH = {
  sample: SAMPLE_GRAPH,
  dag: DAG_GRAPH,
  bellman: BELLMAN_GRAPH,
  astarGraph: ASTAR_GRAPH,
  dijkstra: dijkstraSteps,
  prim: primSteps,
  kruskal: kruskalSteps,
  bfs: bfsSteps,
  dfs: dfsSteps,
  topo: topoSteps,
  bellmanFord: bellmanFordSteps,
  astar: astarSteps,
  render: graphRender,
  dijkstraInitial: dijkstraInitialState,
  primInitial: primInitialState,
  kruskalInitial: kruskalInitialState,
  bfsInitial: bfsInitialState,
  dfsInitial: dfsInitialState,
  topoInitial: topoInitialState,
  bellmanFordInitial: bellmanFordInitialState,
  astarInitial: astarInitialState,
};
