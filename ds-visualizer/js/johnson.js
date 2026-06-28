// ============ Johnson's Algorithm (All-Pairs Shortest Path) ============
//
// ใช้สำหรับ sparse graph ที่มี negative edges (แต่ไม่มี negative cycle)
// 3 เฟส:
//   1. เพิ่ม source S เชื่อมทุก node ด้วย weight 0 → รัน Bellman-Ford จาก S เพื่อหา h(v)
//   2. Reweight edges: w'(u,v) = w(u,v) + h(u) - h(v) (ทำให้ทุก weight ≥ 0)
//   3. รัน Dijkstra จากทุก node ด้วย reweighted edges → ปรับกลับ: dist(u,v) = dist'(u,v) - h(u) + h(v)
// Time: O(V·E·log V) — เร็วกว่า Floyd-Warshall O(V³) สำหรับ sparse graph

// Graph ตัวอย่าง: 5 nodes + 1 virtual source, มี negative edge แต่ไม่มี negative cycle
const JOHNSON_GRAPH = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    [0, 1, 4],   // A → B: 4
    [0, 2, 2],   // A → C: 2
    [1, 2, -1],  // B → C: -1 (negative!)
    [1, 3, 5],   // B → D: 5
    [2, 4, 3],   // C → E: 3
    [3, 4, 2],   // D → E: 2
    [4, 1, -2],  // E → B: -2 (negative!)
  ],
  directed: true,
};

const J_N = JOHNSON_GRAPH.nodes.length;
const J_INF = Infinity;

function johnsonBuildAdj(edges, n) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push({ to: v, w });
  return adj;
}

function johnsonBase(operation, description, codeLines, state, consoleOutput, phase) {
  return { operation, description, codeLines, ...state, consoleOutput, phase };
}

function johnsonSteps() {
  const steps = [];
  const adj = johnsonBuildAdj(JOHNSON_GRAPH.edges, J_N);
  const originalEdges = JOHNSON_GRAPH.edges.map(([u, v, w]) => ({ u, v, w }));

  // ===== Phase 0: Show initial graph =====
  steps.push(johnsonBase('init',
    `เริ่ม Johnson's Algorithm — ${J_N} nodes, ${JOHNSON_GRAPH.edges.length} directed edges (มี negative edges แต่ไม่มี negative cycle)`,
    [1, 2], {
      h: Array.from({ length: J_N }, () => null),
      reweightedEdges: null,
      phase: 'initial',
      currentSource: -1,
      bellmanDist: null,
      dijkstraDist: null,
      finalDist: null,
    },
    `Graph:\n${JOHNSON_GRAPH.edges.map(([u, v, w]) => `${JOHNSON_GRAPH.nodes[u]} → ${JOHNSON_GRAPH.nodes[v]} (w=${w})`).join('\n')}\n\nจะแบ่งเป็น 3 เฟส:\n1. เพิ่ม source S + Bellman-Ford หา h(v)\n2. Reweight edges\n3. Dijkstra จากทุก node`,
    'เริ่มต้น'));

  // ===== Phase 1: Add virtual source S + Bellman-Ford =====
  // S = index J_N (virtual), connected to all nodes with weight 0
  steps.push(johnsonBase('add-source',
    `เฟส 1: เพิ่ม virtual source S เชื่อมทุก node ด้วย edge weight=0`,
    [3, 4, 5], {
      h: Array.from({ length: J_N }, () => J_INF),
      reweightedEdges: null,
      phase: 'bellman',
      currentSource: J_N, // S
      bellmanDist: Array.from({ length: J_N }, () => J_INF),
      dijkstraDist: null,
      finalDist: null,
    },
    `S → A (w=0)\nS → B (w=0)\nS → C (w=0)\nS → D (w=0)\nS → E (w=0)\n\ndist จาก S ทั้งหมดเริ่ม = ∞  จะ relax ทุก edge ${J_N} รอบ`,
    'เฟส 1: เพิ่ม S'));

  // Run Bellman-Ford from S (index J_N)
  // Virtual edges: S → i with weight 0 for all i
  // Plus original edges
  const allEdgesForBellman = [];
  for (let i = 0; i < J_N; i++) allEdgesForBellman.push({ u: J_N, v: i, w: 0, isVirtual: true });
  for (const [u, v, w] of JOHNSON_GRAPH.edges) allEdgesForBellman.push({ u, v, w, isVirtual: false });

  let bellmanDist = Array.from({ length: J_N + 1 }, () => J_INF);
  bellmanDist[J_N] = 0; // S → S = 0

  for (let iter = 1; iter <= J_N; iter++) {
    let anyUpdate = false;
    steps.push(johnsonBase('bellman-iter',
      `เฟส 1 — Bellman-Ford รอบที่ ${iter}/${J_N}: วน relax ทุก edge`,
      [6, 7, 8], {
        h: bellmanDist.slice(0, J_N),
        reweightedEdges: null,
        phase: 'bellman',
        currentSource: J_N,
        bellmanDist: bellmanDist.slice(0, J_N),
        bellmanIter: iter,
        dijkstraDist: null,
        finalDist: null,
      },
      undefined, `Bellman-Ford รอบ ${iter}`));

    for (const e of allEdgesForBellman) {
      const { u, v, w, isVirtual } = e;
      if (bellmanDist[u] !== J_INF && bellmanDist[u] + w < bellmanDist[v]) {
        const oldDist = bellmanDist[v];
        bellmanDist[v] = bellmanDist[u] + w;
        anyUpdate = true;
        const uLabel = u === J_N ? 'S' : JOHNSON_GRAPH.nodes[u];
        const vLabel = v === J_N ? 'S' : JOHNSON_GRAPH.nodes[v];
        steps.push(johnsonBase('bellman-relax',
          `relax ${uLabel}→${vLabel} (w=${w})${isVirtual ? ' [virtual]' : ''}: ${bellmanDist[u]} + ${w} = ${bellmanDist[v]} < ${oldDist === J_INF ? '∞' : oldDist} → อัปเดต h(${vLabel}) = ${bellmanDist[v]}`,
          [9, 10, 11], {
            h: bellmanDist.slice(0, J_N),
            reweightedEdges: null,
            phase: 'bellman',
            currentSource: J_N,
            bellmanDist: bellmanDist.slice(0, J_N),
            bellmanIter: iter,
            highlightEdge: [u, v],
            dijkstraDist: null,
            finalDist: null,
          },
          `h(${vLabel}) = ${bellmanDist[v]}`,
          'Bellman-Ford relax'));
      }
    }

    if (!anyUpdate) {
      steps.push(johnsonBase('bellman-done',
        `รอบ ${iter} ไม่มี update → Bellman-Ford เสถียรแล้ว`,
        [], {
          h: bellmanDist.slice(0, J_N),
          reweightedEdges: null,
          phase: 'bellman',
          currentSource: J_N,
          bellmanDist: bellmanDist.slice(0, J_N),
          dijkstraDist: null,
          finalDist: null,
        },
        `h values:\n${JOHNSON_GRAPH.nodes.map((n, i) => `  h(${n}) = ${bellmanDist[i]}`).join('\n')}`,
        'Bellman-Ford เสร็จ'));
      break;
    }
  }

  // Check negative cycle (extra iteration)
  let hasNegCycle = false;
  for (const e of allEdgesForBellman) {
    if (bellmanDist[e.u] !== J_INF && bellmanDist[e.u] + e.w < bellmanDist[e.v]) {
      hasNegCycle = true; break;
    }
  }

  if (hasNegCycle) {
    steps.push(johnsonBase('neg-cycle',
      `⚠ พบ negative cycle! ไม่สามารถหา shortest path ได้`,
      [12, 13], {
        h: bellmanDist.slice(0, J_N),
        reweightedEdges: null,
        phase: 'bellman',
        currentSource: J_N,
        bellmanDist: bellmanDist.slice(0, J_N),
        dijkstraDist: null,
        finalDist: null,
      },
      `Negative cycle detected — Johnson's algorithm ไม่สามารถทำงานได้`,
      'Negative cycle'));
    return steps;
  }

  const h = bellmanDist.slice(0, J_N);
  steps.push(johnsonBase('bellman-result',
    `เฟส 1 เสร็จ — ไม่พบ negative cycle  ได้ h(v) = shortest dist จาก S:\n${JOHNSON_GRAPH.nodes.map((n, i) => `  h(${n}) = ${h[i]}`).join('\n')}`,
    [], {
      h: h.slice(),
      reweightedEdges: null,
      phase: 'bellman',
      currentSource: J_N,
      bellmanDist: h.slice(),
      dijkstraDist: null,
      finalDist: null,
    },
    `h(v) values:\n${JOHNSON_GRAPH.nodes.map((n, i) => `  h(${n}) = ${h[i]}`).join('\n')}`,
    'เฟส 1 เสร็จ'));

  // ===== Phase 2: Reweight edges =====
  steps.push(johnsonBase('reweight-start',
    `เฟส 2: Reweight edges — w'(u,v) = w(u,v) + h(u) - h(v)  ทำให้ทุก weight ≥ 0`,
    [14, 15, 16], {
      h: h.slice(),
      reweightedEdges: null,
      phase: 'reweight',
      currentSource: -1,
      bellmanDist: h.slice(),
      dijkstraDist: null,
      finalDist: null,
    },
    `Formula: w'(u,v) = w(u,v) + h(u) - h(v)\n\nจะ reweight ทุก edge:`,
    'เฟส 2: Reweight'));

  const reweightedEdges = [];
  for (const [u, v, w] of JOHNSON_GRAPH.edges) {
    const newW = w + h[u] - h[v];
    reweightedEdges.push({ u, v, w: newW, origW: w });
    steps.push(johnsonBase('reweight-edge',
      `w'(${JOHNSON_GRAPH.nodes[u]},${JOHNSON_GRAPH.nodes[v]}) = ${w} + h(${JOHNSON_GRAPH.nodes[u]})=${h[u]} - h(${JOHNSON_GRAPH.nodes[v]})=${h[v]} = ${newW} ${newW >= 0 ? '✓ (≥ 0)' : '✗ (< 0!)'}`,
      [17, 18], {
        h: h.slice(),
        reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
        phase: 'reweight',
        currentSource: -1,
        bellmanDist: h.slice(),
        highlightEdge: [u, v],
        dijkstraDist: null,
        finalDist: null,
      },
      `${JOHNSON_GRAPH.nodes[u]}→${JOHNSON_GRAPH.nodes[v]}: ${w} → ${newW}`,
      'Reweight edge'));
  }

  steps.push(johnsonBase('reweight-done',
    `เฟส 2 เสร็จ — ทุก reweighted edge ≥ 0  ตอนนี้ใช้ Dijkstra ได้แล้ว`,
    [], {
      h: h.slice(),
      reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
      phase: 'reweight',
      currentSource: -1,
      bellmanDist: h.slice(),
      dijkstraDist: null,
      finalDist: null,
    },
    `Reweighted edges:\n${reweightedEdges.map((e) => `${JOHNSON_GRAPH.nodes[e.u]}→${JOHNSON_GRAPH.nodes[e.v]}: ${e.origW} → ${e.w}`).join('\n')}`,
    'เฟส 2 เสร็จ'));

  // ===== Phase 3: Run Dijkstra from each node =====
  const reweightedAdj = johnsonBuildAdj(reweightedEdges.map((e) => [e.u, e.v, e.w]), J_N);
  const finalDist = Array.from({ length: J_N }, () => Array.from({ length: J_N }, () => J_INF));

  steps.push(johnsonBase('dijkstra-start',
    `เฟส 3: รัน Dijkstra จากทุก node (${J_N} ครั้ง) ด้วย reweighted edges`,
    [19, 20], {
      h: h.slice(),
      reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
      phase: 'dijkstra',
      currentSource: -1,
      bellmanDist: h.slice(),
      dijkstraDist: null,
      finalDist: finalDist.map((r) => r.slice()),
    },
    `จะรัน Dijkstra ${J_N} ครั้ง (จาก A, B, C, D, E)\nแล้วปรับกลับ: dist(u,v) = dist'(u,v) - h(u) + h(v)`,
    'เฟส 3: Dijkstra'));

  for (let src = 0; src < J_N; src++) {
    // Run Dijkstra from src with reweighted edges
    const distPrime = Array.from({ length: J_N }, () => J_INF);
    const visited = new Set();
    distPrime[src] = 0;

    steps.push(johnsonBase('dijkstra-from',
      `Dijkstra จาก ${JOHNSON_GRAPH.nodes[src]} — ใช้ reweighted edges (ที่ไม่ติดลบ)`,
      [21, 22, 23], {
        h: h.slice(),
        reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
        phase: 'dijkstra',
        currentSource: src,
        bellmanDist: h.slice(),
        dijkstraDist: distPrime.slice(),
        dijkstraVisited: [...visited],
        finalDist: finalDist.map((r) => r.slice()),
      },
      `Source: ${JOHNSON_GRAPH.nodes[src]}\ndist'[${JOHNSON_GRAPH.nodes[src]}] = 0, อื่นๆ = ∞`,
      `Dijkstra จาก ${JOHNSON_GRAPH.nodes[src]}`));

    for (let cnt = 0; cnt < J_N; cnt++) {
      // Find min unvisited
      let u = -1, minD = J_INF;
      for (let i = 0; i < J_N; i++) {
        if (!visited.has(i) && distPrime[i] < minD) { minD = distPrime[i]; u = i; }
      }
      if (u === -1) break;
      visited.add(u);

      steps.push(johnsonBase('dijkstra-pick',
        `เลือก ${JOHNSON_GRAPH.nodes[u]} (dist'=${distPrime[u]}) — น้อยสุดใน unvisited → mark visited`,
        [24, 25, 26, 27], {
          h: h.slice(),
          reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
          phase: 'dijkstra',
          currentSource: src,
          bellmanDist: h.slice(),
          dijkstraDist: distPrime.slice(),
          dijkstraVisited: [...visited],
          dijkstraCurrent: u,
          finalDist: finalDist.map((r) => r.slice()),
        },
        `+ visit ${JOHNSON_GRAPH.nodes[u]}`,
        'Dijkstra pick'));

      // Relax neighbors
      for (const { to, w } of reweightedAdj[u]) {
        if (visited.has(to)) continue;
        if (distPrime[u] + w < distPrime[to]) {
          const oldD = distPrime[to];
          distPrime[to] = distPrime[u] + w;
          steps.push(johnsonBase('dijkstra-relax',
            `relax ${JOHNSON_GRAPH.nodes[u]}→${JOHNSON_GRAPH.nodes[to]} (w'=${w}): ${distPrime[u]} + ${w} = ${distPrime[to]} < ${oldD === J_INF ? '∞' : oldD} → อัปเดต dist'[${JOHNSON_GRAPH.nodes[to]}] = ${distPrime[to]}`,
            [28, 29, 30], {
              h: h.slice(),
              reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
              phase: 'dijkstra',
              currentSource: src,
              bellmanDist: h.slice(),
              dijkstraDist: distPrime.slice(),
              dijkstraVisited: [...visited],
              dijkstraCurrent: u,
              highlightEdge: [u, to],
              finalDist: finalDist.map((r) => r.slice()),
            },
            `dist'[${JOHNSON_GRAPH.nodes[to]}] = ${distPrime[to]}`,
            'Dijkstra relax'));
        }
      }
    }

    // Adjust back: dist(u,v) = dist'(u,v) - h(u) + h(v)
    for (let v = 0; v < J_N; v++) {
      if (distPrime[v] !== J_INF) {
        finalDist[src][v] = distPrime[v] - h[src] + h[v];
      }
    }

    steps.push(johnsonBase('dijkstra-adjust',
      `ปรับกลับสำหรับ source ${JOHNSON_GRAPH.nodes[src]}: dist(${JOHNSON_GRAPH.nodes[src]},v) = dist'(v) - h(${JOHNSON_GRAPH.nodes[src]}) + h(v)\n${JOHNSON_GRAPH.nodes.map((n, i) => `  dist(${JOHNSON_GRAPH.nodes[src]},${n}) = ${distPrime[i] === J_INF ? '∞' : distPrime[i]} - ${h[src]} + ${h[i]} = ${finalDist[src][i] === J_INF ? '∞' : finalDist[src][i]}`).join('\n')}`,
      [31, 32], {
        h: h.slice(),
        reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
        phase: 'dijkstra',
        currentSource: src,
        bellmanDist: h.slice(),
        dijkstraDist: distPrime.slice(),
        dijkstraVisited: [...visited],
        finalDist: finalDist.map((r) => r.slice()),
      },
      `Row ${JOHNSON_GRAPH.nodes[src]} ของ final distance matrix:\n${JOHNSON_GRAPH.nodes.map((n, i) => `  → ${n}: ${finalDist[src][i] === J_INF ? '∞' : finalDist[src][i]}`).join('\n')}`,
      `ปรับกลับ ${JOHNSON_GRAPH.nodes[src]}`));
  }

  // ===== Final result =====
  let matrixStr = '     ' + JOHNSON_GRAPH.nodes.map((n) => n.padStart(5)).join('') + '\n';
  for (let i = 0; i < J_N; i++) {
    matrixStr += JOHNSON_GRAPH.nodes[i].padEnd(4) + ' ';
    for (let j = 0; j < J_N; j++) {
      matrixStr += (finalDist[i][j] === J_INF ? '∞' : finalDist[i][j]).toString().padStart(5);
    }
    matrixStr += '\n';
  }

  steps.push(johnsonBase('done',
    `Johnson's Algorithm เสร็จสิ้น — ได้ all-pairs shortest path`,
    [], {
      h: h.slice(),
      reweightedEdges: reweightedEdges.map((e) => ({ ...e })),
      phase: 'final',
      currentSource: -1,
      bellmanDist: h.slice(),
      dijkstraDist: null,
      finalDist: finalDist.map((r) => r.slice()),
    },
    `Final distance matrix:\n${matrixStr.trim()}`,
    'เสร็จสิ้น'));

  return steps;
}

// ===== Renderer =====
function johnsonRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const h = step.h || [];
  const reweightedEdges = step.reweightedEdges;
  const phase = step.phase;
  const finalDist = step.finalDist;

  if (vizMeta) {
    let info = '';
    if (phase === 'initial') info = `${J_N} nodes · ${JOHNSON_GRAPH.edges.length} edges`;
    else if (phase === 'bellman') info = `เฟส 1: Bellman-Ford จาก S${step.bellmanIter ? ' (รอบ ' + step.bellmanIter + ')' : ''}`;
    else if (phase === 'reweight') info = `เฟส 2: Reweight edges`;
    else if (phase === 'dijkstra') info = `เฟส 3: Dijkstra${step.currentSource >= 0 && step.currentSource < J_N ? ' จาก ' + JOHNSON_GRAPH.nodes[step.currentSource] : ''}`;
    else if (phase === 'final') info = `Final: All-pairs shortest path`;
    vizMeta.textContent = info;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;gap:24px;padding:16px;flex-wrap:wrap;justify-content:center' });

  // ===== Left: Graph SVG =====
  const showVirtual = (phase === 'bellman' || phase === 'initial' && step.currentSource === J_N);
  const svgNodes = showVirtual ? [...JOHNSON_GRAPH.nodes, 'S'] : JOHNSON_GRAPH.nodes;
  const svgN = svgNodes.length;
  const positions = [];
  const radius = 110, cx = 180, cy = 150;
  for (let i = 0; i < svgN; i++) {
    const angle = (i / svgN) * 2 * Math.PI - Math.PI / 2;
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '360');
  svg.setAttribute('height', '320');
  svg.setAttribute('viewBox', '0 0 360 320');

  // Determine which edges to show
  let edgesToShow = [];
  if (phase === 'initial') {
    edgesToShow = JOHNSON_GRAPH.edges.map(([u, v, w]) => ({ u, v, w, displayW: w }));
  } else if (phase === 'bellman') {
    // Show original + virtual edges from S
    edgesToShow = JOHNSON_GRAPH.edges.map(([u, v, w]) => ({ u, v, w, displayW: w }));
    if (showVirtual) {
      for (let i = 0; i < J_N; i++) edgesToShow.push({ u: J_N, v: i, w: 0, displayW: 0, isVirtual: true });
    }
  } else if (phase === 'reweight' || phase === 'dijkstra' || phase === 'final') {
    // Show reweighted edges
    if (reweightedEdges) {
      edgesToShow = reweightedEdges.map((e) => ({ u: e.u, v: e.v, w: e.w, displayW: e.w, origW: e.origW }));
    }
  }

  // Draw edges
  edgesToShow.forEach((e) => {
    const u = e.u, v = e.v;
    if (u >= svgN || v >= svgN) return;
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
    if (e.isVirtual) {
      line.setAttribute('stroke', 'var(--text-dim)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '3,3');
      line.setAttribute('opacity', '0.5');
    } else if (isHl) {
      line.setAttribute('stroke', 'var(--amber)');
      line.setAttribute('stroke-width', '3');
    } else {
      line.setAttribute('stroke', 'var(--text-dim)');
      line.setAttribute('stroke-width', '1.5');
    }
    svg.appendChild(line);

    if (!e.isVirtual) {
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
    }

    // Weight label
    const midX = (positions[u].x + positions[v].x) / 2;
    const midY = (positions[u].y + positions[v].y) / 2;
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
    wText.setAttribute('font-size', '10');
    wText.setAttribute('font-family', 'monospace');
    wText.setAttribute('font-weight', 'bold');
    wText.setAttribute('fill', isHl ? 'white' : 'var(--text-muted)');
    wText.textContent = e.isVirtual ? '0' : String(e.displayW);
    svg.appendChild(wText);
  });

  // Draw nodes
  svgNodes.forEach((label, idx) => {
    const pos = positions[idx];
    const isReal = idx < J_N;
    const isSrc = step.currentSource === idx;
    const isCurrent = step.dijkstraCurrent === idx;
    const isVisited = step.dijkstraVisited && step.dijkstraVisited.includes(idx);

    let fill = 'var(--bg-card)', stroke = 'var(--text-dim)', textColor = 'var(--text)';
    if (!isReal) { fill = 'var(--bg-elev)'; stroke = 'var(--purple)'; strokeDasharray = '3,3'; }
    if (isSrc) { fill = 'var(--purple)'; stroke = 'var(--purple)'; textColor = 'white'; }
    if (isCurrent) { fill = 'var(--amber)'; stroke = 'var(--amber)'; textColor = 'white'; }
    else if (isVisited) { fill = 'var(--emerald)'; stroke = 'var(--emerald)'; textColor = 'white'; }

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

    // h(v) label below
    if (isReal && h[idx] != null && phase !== 'initial') {
      const hLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      hLabel.setAttribute('x', String(pos.x));
      hLabel.setAttribute('y', String(pos.y + 32));
      hLabel.setAttribute('text-anchor', 'middle');
      hLabel.setAttribute('font-size', '10');
      hLabel.setAttribute('font-family', 'monospace');
      hLabel.setAttribute('fill', 'var(--text-muted)');
      hLabel.textContent = `h=${h[idx] === J_INF ? '∞' : h[idx]}`;
      svg.appendChild(hLabel);
    }

    // dist' label (Dijkstra phase)
    if (isReal && step.dijkstraDist && step.dijkstraDist[idx] != null && phase === 'dijkstra') {
      const dLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      dLabel.setAttribute('x', String(pos.x));
      dLabel.setAttribute('y', String(pos.y - 28));
      dLabel.setAttribute('text-anchor', 'middle');
      dLabel.setAttribute('font-size', '10');
      dLabel.setAttribute('font-family', 'monospace');
      dLabel.setAttribute('fill', 'var(--amber)');
      dLabel.textContent = `d'=${step.dijkstraDist[idx] === J_INF ? '∞' : step.dijkstraDist[idx]}`;
      svg.appendChild(dLabel);
    }
  });

  wrap.appendChild(svg);

  // ===== Right: Info panel =====
  const info = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:12px;min-width:240px;max-width:300px' });

  // Phase indicator
  const phaseLabels = {
    'initial': 'เฟส 0: เตรียมกราฟ',
    'bellman': 'เฟส 1: Bellman-Ford (หา h(v))',
    'reweight': 'เฟส 2: Reweight edges',
    'dijkstra': 'เฟส 3: Dijkstra (ทุก node)',
    'final': 'ผลลัพธ์: All-Pairs Shortest Path',
  };
  info.appendChild(window.DS.el('div', {
    style: 'padding:8px 12px;background:var(--bg-elev);border-radius:8px;font-size:12px;font-weight:600;color:var(--amber);border:1px solid var(--border)',
  }, phaseLabels[phase] || phase));

  // h(v) values
  if (phase !== 'initial') {
    info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em' }, 'h(v) values (Bellman-Ford):'));
    const hRow = window.DS.el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap' });
    for (let i = 0; i < J_N; i++) {
      const chip = window.DS.el('div', {
        style: 'padding:4px 8px;background:var(--bg-elev);border:1px solid var(--border);border-radius:4px;font-family:monospace;font-size:11px',
      }, `${JOHNSON_GRAPH.nodes[i]}:${h[i] === J_INF || h[i] == null ? '∞' : h[i]}`);
      hRow.appendChild(chip);
    }
    info.appendChild(hRow);
  }

  // Final distance matrix
  if (finalDist && phase === 'final') {
    info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin-top:8px' }, 'Final distance matrix:'));
    const table = window.DS.el('table', { style: 'border-collapse:collapse;font-family:monospace;font-size:11px' });
    const thead = window.DS.el('tr');
    thead.appendChild(window.DS.el('th', { style: 'padding:4px 6px;color:var(--text-muted)' }, ''));
    for (let j = 0; j < J_N; j++) {
      thead.appendChild(window.DS.el('th', { style: 'padding:4px 6px;color:var(--text-muted)' }, JOHNSON_GRAPH.nodes[j]));
    }
    table.appendChild(thead);
    for (let i = 0; i < J_N; i++) {
      const tr = window.DS.el('tr');
      tr.appendChild(window.DS.el('th', { style: 'padding:4px 6px;color:var(--text-muted);text-align:right' }, JOHNSON_GRAPH.nodes[i]));
      for (let j = 0; j < J_N; j++) {
        const v = finalDist[i][j];
        tr.appendChild(window.DS.el('td', {
          style: `padding:4px 8px;text-align:center;${i === j ? 'color:var(--text-muted)' : 'color:var(--text)'};${v === 0 && i === j ? 'background:rgba(255,255,255,0.04)' : ''}`,
        }, v === J_INF ? '∞' : String(v)));
      }
      table.appendChild(tr);
    }
    info.appendChild(table);
  }

  // Reweighted edges info
  if (reweightedEdges && (phase === 'reweight' || phase === 'dijkstra' || phase === 'final')) {
    info.appendChild(window.DS.el('div', { style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin-top:8px' }, 'Reweighted edges (≥ 0):'));
    const edgesList = window.DS.el('div', { style: 'font-family:monospace;font-size:10px;color:var(--text);line-height:1.6' });
    reweightedEdges.forEach((e) => {
      edgesList.appendChild(window.DS.el('div', {},
        `${JOHNSON_GRAPH.nodes[e.u]}→${JOHNSON_GRAPH.nodes[e.v]}: ${e.origW}→${e.w}`));
    });
    info.appendChild(edgesList);
  }

  wrap.appendChild(info);
  vizArea.appendChild(wrap);
}

window.JOHNSON = {
  run: johnsonSteps,
  render: johnsonRender,
};
