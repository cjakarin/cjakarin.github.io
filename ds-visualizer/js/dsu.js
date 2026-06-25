// ============ Disjoint Set Union (Union-Find) ============
//
// Visual: forest of trees, each element shown as node with parent pointer
// Operations: find (with path compression), union (by rank)
// State: parent[] array + rank[] array, elements 0..N-1

const DSU_N = 8;

let dsuStepCounter = 0;
function dsuBase(operation, parent, rank, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase, edges = []) {
  return {
    operation, description, codeLines,
    parent: parent.slice(),
    rank: rank.slice(),
    roles: { ...roles },
    pointers: { ...pointers },
    consoleOutput, phase,
    edges,
  };
}

function dsuFind(parent, rank, x) {
  const steps = [];
  const path = [];

  steps.push(dsuBase('find', parent, rank,
    `เริ่ม find(${x}) — หา root (representative) ของ set ที่มี ${x}`, [1],
    { [`${x}`]: 'current' }, { current: x, root: null, path: [] }, undefined, 'เริ่มต้น'));

  let cur = x;
  path.push(cur);
  while (parent[cur] !== cur) {
    steps.push(dsuBase('find', parent, rank,
      `parent[${cur}] = ${parent[cur]} ≠ ${cur} → ไปขึ้น parent`, [2, 3],
      { [`${cur}`]: 'current', [`${parent[cur]}`]: 'target' },
      { current: cur, root: null, path: path.slice() }, undefined, 'เดินขึ้น parent'));
    cur = parent[cur];
    path.push(cur);
  }

  steps.push(dsuBase('find', parent, rank,
    `parent[${cur}] = ${cur} → ${cur} คือ root! คืนค่า ${cur}`, [2, 4],
    { [`${cur}`]: 'found' }, { current: cur, root: cur, path: path.slice() },
    `find(${x}) → ${cur}`, 'พบ root'));

  // Path compression: point all path nodes directly to root
  if (path.length > 2) {
    steps.push(dsuBase('find', parent, rank,
      `Path compression: ย้ายทุก node ใน path ให้ชี้ตรงไป root ${cur}`,
      [5, 6, 7],
      { [`${cur}`]: 'found' }, { current: cur, root: cur, path: path.slice() },
      undefined, 'Path compression'));

    const newParent = parent.slice();
    for (const node of path.slice(0, -1)) {
      newParent[node] = cur;
    }
    steps.push(dsuBase('find', newParent, rank,
      `หลัง path compression — ต้นไม้แบนราบขึ้น → ค้นหาครั้งต่อไปเร็วขึ้น ~O(1)`,
      [],
      { [`${cur}`]: 'found' }, { current: cur, root: cur, path: [] },
      `find(${x}) → ${cur} (path compressed)`, 'เสร็จสิ้น'));
  }

  return steps;
}

function dsuUnion(parent, rank, x, y) {
  const steps = [];

  steps.push(dsuBase('union', parent, rank,
    `เริ่ม union(${x}, ${y}) — หา root ของทั้งสอง set ก่อน`, [1],
    { [`${x}`]: 'current', [`${y}`]: 'target' },
    { current: x, root: null, path: [] }, undefined, 'เริ้มต้น'));

  // Find root of x
  let rx = x;
  const pathX = [x];
  while (parent[rx] !== rx) { rx = parent[rx]; pathX.push(rx); }
  steps.push(dsuBase('union', parent, rank,
    `find(${x}) → root = ${rx}`, [2],
    { [`${rx}`]: 'found', [`${x}`]: 'current' },
    { current: x, root: rx, path: [] }, undefined, `find(${x})=${rx}`));

  // Find root of y
  let ry = y;
  const pathY = [y];
  while (parent[ry] !== ry) { ry = parent[ry]; pathY.push(ry); }
  steps.push(dsuBase('union', parent, rank,
    `find(${y}) → root = ${ry}`, [3],
    { [`${ry}`]: 'found', [`${y}`]: 'current' },
    { current: y, root: ry, path: [] }, undefined, `find(${y})=${ry}`));

  if (rx === ry) {
    steps.push(dsuBase('union', parent, rank,
      `${rx} === ${ry} → อยู่ใน set เดียวกันอยู่แล้ว → ไม่ต้อง union`,
      [4, 5],
      { [`${rx}`]: 'found' }, { current: null, root: rx, path: [] },
      `union(${x}, ${y}) → อยู่ใน set เดียวกัน (root=${rx})`, 'เหมือนกัน'));
    return steps;
  }

  // Union by rank
  steps.push(dsuBase('union', parent, rank,
    `union by rank: เปรียบเทียบ rank[root_x=${rx}]=${rank[rx]} กับ rank[root_y=${ry}]=${rank[ry]}`,
    [6, 7, 8, 9],
    { [`${rx}`]: 'current', [`${ry}`]: 'target' },
    { current: rx, root: ry, path: [] }, undefined, 'เปรียบเทียบ rank'));

  const newParent = parent.slice();
  const newRank = rank.slice();

  if (rank[rx] < rank[ry]) {
    steps.push(dsuBase('union', parent, rank,
      `rank[${rx}]=${rank[rx]} < rank[${ry}]=${rank[ry]} → ย้าย ${rx} ไปอยู่ใต้ ${ry}`,
      [8],
      { [`${rx}`]: 'target', [`${ry}`]: 'current' },
      { current: rx, root: ry, path: [] }, undefined, 'ย้าย root_x → root_y'));
    newParent[rx] = ry;
  } else if (rank[rx] > rank[ry]) {
    steps.push(dsuBase('union', parent, rank,
      `rank[${rx}]=${rank[rx]} > rank[${ry}]=${rank[ry]} → ย้าย ${ry} ไปอยู่ใต้ ${rx}`,
      [9],
      { [`${rx}`]: 'current', [`${ry}`]: 'target' },
      { current: ry, root: rx, path: [] }, undefined, 'ย้าย root_y → root_x'));
    newParent[ry] = rx;
  } else {
    // Equal rank — pick rx as new root, increment rank
    steps.push(dsuBase('union', parent, rank,
      `rank เท่ากัน → ย้าย ${ry} ไปใต้ ${rx}  แล้ว rank[${rx}]++`,
      [10, 11],
      { [`${rx}`]: 'current', [`${ry}`]: 'target' },
      { current: ry, root: rx, path: [] }, undefined, 'ย้าย + bump rank'));
    newParent[ry] = rx;
    newRank[rx] += 1;
  }

  steps.push(dsuBase('union', newParent, newRank,
    `union เสร็จสิ้น — ตอนนี้ ${x} และ ${y} อยู่ใน set เดียวกัน`,
    [],
    { [`${newParent[rx] === ry ? ry : rx}`]: 'found' },
    { current: null, root: null, path: [] },
    `union(${x}, ${y}) → สำเร็จ`, 'เสร็จสิ้น'));

  return steps;
}

// Render: forest of trees (one per set) + parent[] array
function dsuRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const parent = step.parent;
  const rank = step.rank;
  const roles = step.roles;
  const p = step.pointers;
  const N = parent.length;

  if (vizMeta) {
    const roots = new Set();
    for (let i = 0; i < N; i++) {
      let r = i;
      while (parent[r] !== r) r = parent[r];
      roots.add(r);
    }
    vizMeta.textContent = `N = ${N} · ${roots.size} set${roots.size !== 1 ? 's' : ''}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:20px;padding:16px;align-items:center' });

  // ===== Forest visualization =====
  // Find roots and group children
  const roots = [];
  for (let i = 0; i < N; i++) if (parent[i] === i) roots.push(i);

  // Build children map
  const children = {};
  for (let i = 0; i < N; i++) {
    if (parent[i] !== i) {
      if (!children[parent[i]]) children[parent[i]] = [];
      children[parent[i]].push(i);
    }
  }

  // Layout: each root as a tree
  const forestWrap = window.DS.el('div', { style: 'display:flex;gap:32px;flex-wrap:wrap;justify-content:center' });

  roots.forEach((root) => {
    const treeWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:12px' });

    // Compute tree depth for SVG sizing
    function maxDepth(node) {
      const kids = children[node] || [];
      if (kids.length === 0) return 1;
      return 1 + Math.max(...kids.map(maxDepth));
    }
    const depth = maxDepth(root);
    function countNodes(node) {
      const kids = children[node] || [];
      return 1 + kids.reduce((s, k) => s + countNodes(k), 0);
    }
    const totalNodes = countNodes(root);

    const nodeWidth = 50;
    const hSpacing = 60;
    const vSpacing = 80;
    const treeWidth = Math.max(totalNodes * hSpacing, 100);
    const treeHeight = depth * vSpacing;

    // Compute positions DFS
    const positions = {};
    let xCounter = 0;
    function layout(node, depth) {
      const kids = children[node] || [];
      if (kids.length === 0) {
        positions[node] = { x: xCounter * hSpacing + 30, y: depth * vSpacing + 30 };
        xCounter++;
        return;
      }
      kids.forEach((k) => layout(k, depth + 1));
      const firstX = positions[kids[0]].x;
      const lastX = positions[kids[kids.length - 1]].x;
      positions[node] = { x: (firstX + lastX) / 2, y: depth * vSpacing + 30 };
    }
    layout(root, 0);

    const svgWidth = Math.max(xCounter * hSpacing + 30, 80);
    const svg = window.DS.el('svg', { width: String(svgWidth), height: String(treeHeight + 60) });
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${treeHeight + 60}`);

    // Draw edges
    function drawEdges(node) {
      const kids = children[node] || [];
      kids.forEach((k) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(positions[node].x));
        line.setAttribute('y1', String(positions[node].y + 18));
        line.setAttribute('x2', String(positions[k].x));
        line.setAttribute('y2', String(positions[k].y - 18));
        line.setAttribute('stroke', 'var(--text-dim)');
        line.setAttribute('stroke-width', '1.5');
        svg.appendChild(line);
        drawEdges(k);
      });
    }
    drawEdges(root);

    const treeContainer = window.DS.el('div', { style: `position:relative;width:${svgWidth}px;height:${treeHeight + 60}px` });
    treeContainer.appendChild(svg);

    // Draw nodes
    function collectAll(node) {
      const result = [node];
      const kids = children[node] || [];
      kids.forEach((k) => result.push(...collectAll(k)));
      return result;
    }
    const allNodes = collectAll(root);
    allNodes.forEach((nodeIdx) => {
      const pos = positions[nodeIdx];
      const role = roles[`${nodeIdx}`] || '';
      const isCurrent = p.current === nodeIdx;
      const isRoot = p.root === nodeIdx;
      const isInPath = (p.path || []).includes(nodeIdx);

      const nodeWrap = window.DS.el('div', {
        style: `position:absolute;left:${pos.x - 25}px;top:${pos.y - 18}px;width:50px;display:flex;flex-direction:column;align-items:center`,
      });

      const chips = window.DS.el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap;justify-content:center;min-height:12px' });
      if (isCurrent) chips.appendChild(window.DS.makePointerChip('cur', 'current'));
      if (isRoot) chips.appendChild(window.DS.makePointerChip('root', 'found'));
      if (isInPath && !isCurrent && !isRoot) chips.appendChild(window.DS.makePointerChip('path', 'target'));
      nodeWrap.appendChild(chips);

      const circle = window.DS.el('div', {
        class: `node ${role ? 'node-role-' + role : ''} ${isInPath && !role ? 'node-role-target' : ''}`,
        style: 'border-radius:50%;width:40px;height:40px;padding:0;justify-content:center;align-items:center;display:flex',
      });
      circle.appendChild(window.DS.el('div', {
        class: 'node-cell-data',
        style: 'padding:0;font-size:13px;min-width:0',
      }, String(nodeIdx)));
      nodeWrap.appendChild(circle);

      // rank label below root
      if (parent[nodeIdx] === nodeIdx) {
        nodeWrap.appendChild(window.DS.el('div', {
          style: 'font-size:9px;font-family:monospace;color:var(--text-muted);margin-top:2px',
        }, `r=${rank[nodeIdx]}`));
      }

      treeContainer.appendChild(nodeWrap);
    });

    treeWrap.appendChild(treeContainer);
    forestWrap.appendChild(treeWrap);
  });

  wrap.appendChild(forestWrap);

  // ===== parent[] array =====
  const arrayWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;max-width:800px' });
  arrayWrap.appendChild(window.DS.el('div', {
    style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-align:center',
  }, 'parent[] array (parent[i] = parent of i, parent[root] = root):'));

  const row = window.DS.el('div', { style: 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap' });
  for (let i = 0; i < N; i++) {
    const role = roles[`${i}`] || '';
    const isCurrent = p.current === i;
    const isRoot = p.root === i;
    const isInPath = (p.path || []).includes(i);
    let bgClass = role;
    if (!bgClass && isCurrent) bgClass = 'current';
    if (!bgClass && isRoot) bgClass = 'found';

    const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
    const chips = window.DS.el('div', { style: 'display:flex;gap:2px;min-height:12px' });
    if (isCurrent) chips.appendChild(window.DS.makePointerChip('i', 'current'));
    if (isRoot) chips.appendChild(window.DS.makePointerChip('root', 'found'));
    cellWrap.appendChild(chips);

    const box = window.DS.makeNodeBox({
      value: parent[i],
      role: bgClass,
      idxLabel: i,
    });
    // Mark self-parent (root) specially
    if (parent[i] === i) {
      box.style.borderColor = 'var(--emerald)';
    }
    cellWrap.appendChild(box);
    row.appendChild(cellWrap);
  }
  arrayWrap.appendChild(row);

  // rank array
  const rankRow = window.DS.el('div', { style: 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin-top:8px' });
  for (let i = 0; i < N; i++) {
    const cell = window.DS.el('div', {
      class: 'node',
      style: 'border-style:dashed;opacity:0.7',
    });
    cell.appendChild(window.DS.el('div', { class: 'node-idx' }, String(i)));
    cell.appendChild(window.DS.el('div', {
      class: 'node-cell-data',
      style: 'padding:8px 12px;font-size:13px;color:var(--text-muted)',
    }, `r=${rank[i]}`));
    rankRow.appendChild(cell);
  }
  arrayWrap.appendChild(window.DS.el('div', {
    style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-align:center;margin-top:8px',
  }, 'rank[] array:'));
  arrayWrap.appendChild(rankRow);

  wrap.appendChild(arrayWrap);
  vizArea.appendChild(wrap);
}

window.DSU = {
  find: dsuFind,
  union: dsuUnion,
  render: dsuRender,
  makeInitial: (n = DSU_N) => ({
    parent: Array.from({ length: n }, (_, i) => i),
    rank: Array.from({ length: n }, () => 0),
  }),
};
