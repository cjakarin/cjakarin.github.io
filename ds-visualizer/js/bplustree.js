// ============ B+ Tree ============
//
// B+ Tree ที่ใช้ใน database indexing
// - Internal nodes: เก็บ keys สำหรับ routing (ไม่เก็บ data)
// - Leaf nodes: เก็บ keys จริง + เชื่อมกันเป็น linked list
// - ทุก leaf อยู่ในระดับเดียวกัน (balanced)
// - Order m=4: แต่ละ node มีได้สูงสุด 3 keys, อย่างน้อย 1 key (ยกเว้น root)
//
// Insert algorithm:
// 1. หา leaf node ที่เหมาะสม
// 2. แทรก key เข้า leaf (เรียงลำดับ)
// 3. ถ้า leaf เต็ม → split: แบ่งครึ่ง, copy up middle key ไป parent
// 4. ถ้า parent เต็ม → split: แบ่งครึ่ง, move up middle key ไป grandparent
// 5. ทำซ้ำจนถึง root (ถ้า root เต็ม → split root, สร้าง root ใหม่)

const BPT_ORDER = 4; // max children = 4, max keys = 3
const BPT_MAX_KEYS = BPT_ORDER - 1; // 3
const BPT_MIN_KEYS = Math.ceil(BPT_ORDER / 2) - 1; // 1

let bptIdCounter = 0;
function bptId() {
  bptIdCounter += 1;
  return `bpt${bptIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

// B+ Tree node: { id, keys: [], children: [], isLeaf: bool, next: id|null }
// For leaf: children = null, keys = actual data keys, next = next leaf id
// For internal: children = array of child node ids, keys = routing keys

function bptSerialize(root, nodeMap) {
  const nodes = [];
  const edges = [];
  function dfs(nodeId, parentId, depth) {
    const node = nodeMap[nodeId];
    if (!node) return;
    nodes.push({ id: node.id, keys: node.keys.slice(), isLeaf: node.isLeaf, depth, next: node.next });
    if (parentId) edges.push([parentId, node.id]);
    if (!node.isLeaf && node.children) {
      node.children.forEach((cid) => dfs(cid, node.id, depth + 1));
    }
  }
  dfs(root.id, null, 0);
  return { nodes, edges };
}

function bptBase(operation, description, codeLines, root, nodeMap, roles = {}, highlight = null, consoleOutput, phase) {
  const serialized = bptSerialize(root, nodeMap);
  return {
    operation, description, codeLines,
    nodes: serialized.nodes,
    edges: serialized.edges,
    roles, highlight,
    consoleOutput, phase,
  };
}

// Deep copy nodeMap (for snapshots)
function bptCopyMap(nodeMap) {
  const copy = {};
  for (const [id, node] of Object.entries(nodeMap)) {
    copy[id] = { id: node.id, keys: node.keys.slice(), children: node.children ? node.children.slice() : null, isLeaf: node.isLeaf, next: node.next };
  }
  return copy;
}

// Find leaf node for a given key
function bptFindLeaf(rootId, nodeMap, key) {
  let current = nodeMap[rootId];
  while (!current.isLeaf) {
    let i = 0;
    while (i < current.keys.length && key >= current.keys[i]) i++;
    current = nodeMap[current.children[i]];
  }
  return current;
}

// Insert into B+ Tree — returns steps array
function bptInsertSteps(rootId, nodeMap, value) {
  const steps = [];

  steps.push(bptBase('init', `เริ่ม insert(${value}) ลง B+ Tree (order ${BPT_ORDER})`, [], nodeMap[rootId], nodeMap, {}, null, undefined, 'เริ่มต้น'));

  // Step 1: Find the leaf node
  const path = [];
  let current = nodeMap[rootId];
  while (!current.isLeaf) {
    path.push(current.id);
    let i = 0;
    while (i < current.keys.length && value >= current.keys[i]) i++;
    steps.push(bptBase('traverse',
      `เปรียบเทียบ ${value} กับ keys [${current.keys.join(', ')}] → ไป child[${i}]`, [], nodeMap[rootId], nodeMap, { [current.id]: 'current' }, { nodeId: current.id, childIdx: i },
      undefined, 'traverse internal'));
    current = nodeMap[current.children[i]];
  }

  // Step 2: Insert into leaf
  const leaf = current;
  let insertPos = 0;
  while (insertPos < leaf.keys.length && leaf.keys[insertPos] < value) insertPos++;

  if (leaf.keys.includes(value)) {
    steps.push(bptBase('duplicate', `${value} มีอยู่แล้วใน leaf [${leaf.keys.join(', ')}] → ไม่ insert`, [], nodeMap[rootId], nodeMap, { [leaf.id]: 'found' }, null, `duplicate — skipped`, 'duplicate'));
    return steps;
  }

  leaf.keys.splice(insertPos, 0, value);
  steps.push(bptBase('insert-leaf',
    `แทรก ${value} ลงใน leaf ที่ตำแหน่ง ${insertPos} → leaf = [${leaf.keys.join(', ')}]`, [], nodeMap[rootId], nodeMap, { [leaf.id]: 'new' }, { nodeId: leaf.id },
    `leaf = [${leaf.keys.join(', ')}]`,
    'insert into leaf'));

  // Step 3: Check if leaf needs splitting
  if (leaf.keys.length <= BPT_MAX_KEYS) {
    steps.push(bptBase('done', `insert(${value}) เสร็จสิ้น — leaf ไม่เต็ม (มี ${leaf.keys.length}/${BPT_MAX_KEYS} keys)`, [], nodeMap[rootId], nodeMap, { [leaf.id]: 'found' }, null, undefined, 'เสร็จสิ้น'));
    return steps;
  }

  // Step 4: Split leaf node
  steps.push(bptBase('split-leaf-start',
    `Leaf เต็ม! (${leaf.keys.length} > ${BPT_MAX_KEYS} keys) → ต้อง split`, [], nodeMap[rootId], nodeMap, { [leaf.id]: 'current' }, { nodeId: leaf.id },
    undefined, 'leaf full — split'));

  const mid = Math.ceil(leaf.keys.length / 2);
  const leftKeys = leaf.keys.slice(0, mid);
  const rightKeys = leaf.keys.slice(mid);
  const copyUpKey = rightKeys[0]; // B+ Tree: copy up (not move up)

  // Create new right leaf
  const newLeafId = bptId();
  const newLeaf = { id: newLeafId, keys: rightKeys, children: null, isLeaf: true, next: leaf.next };
  // Update original leaf
  leaf.keys = leftKeys;
  leaf.next = newLeafId;
  nodeMap[newLeafId] = newLeaf;

  steps.push(bptBase('split-leaf-done',
    `Split leaf: left=[${leftKeys.join(', ')}], right=[${rightKeys.join(', ')}]  copy up key=${copyUpKey} ไป parent  (leaf เชื่อมกันด้วย linked list)`, [], nodeMap[rootId], nodeMap, { [leaf.id]: 'current', [newLeafId]: 'new' }, { nodeId: newLeafId },
    `left=[${leftKeys.join(', ')}] right=[${rightKeys.join(', ')}] copyUp=${copyUpKey}`,
    'leaf split done'));

  // Step 5: Insert copyUpKey into parent, with new child pointer
  const result = bptInsertIntoParent(rootId, nodeMap, leaf.id, copyUpKey, newLeafId, path, steps);
  // bptInsertIntoParent may return { rootId, steps } if splitting happened,
  // or it may just return nothing if no split needed (steps already has 'done' pushed)
  if (result && result.steps) {
    return result.steps;
  }
  return steps;
}

function bptInsertIntoParent(rootId, nodeMap, leftChildId, key, rightChildId, path, steps) {
  // If left child is root → create new root
  if (path.length === 0) {
    const newRootId = bptId();
    const newRoot = { id: newRootId, keys: [key], children: [leftChildId, rightChildId], isLeaf: false, next: null };
    nodeMap[newRootId] = newRoot;

    steps.push(bptBase('new-root',
      `left child คือ root → สร้าง root ใหม่: keys=[${key}], children=[${nodeMap[leftChildId].keys.join('|')}, ${nodeMap[rightChildId].keys.join('|')}]`, [], nodeMap[newRootId], nodeMap, { [newRootId]: 'new' }, { nodeId: newRootId },
      `new root: [${key}]`,
      'new root'));

    return { rootId: newRootId, steps };
  }

  // Get parent
  const parentId = path[path.length - 1];
  const parent = nodeMap[parentId];

  // Find position to insert key
  let pos = 0;
  while (pos < parent.keys.length && key > parent.keys[pos]) pos++;

  parent.keys.splice(pos, 0, key);
  parent.children.splice(pos + 1, 0, rightChildId);

  steps.push(bptBase('insert-parent',
    `แทรก key=${key} ลง parent ที่ตำแหน่ง ${pos} → parent keys=[${parent.keys.join(', ')}], children=${parent.children.length}`, [], nodeMap[rootId], nodeMap, { [parentId]: 'current' }, { nodeId: parentId },
    `parent keys=[${parent.keys.join(', ')}]`,
    'insert into parent'));

  // Check if parent needs splitting
  if (parent.keys.length <= BPT_MAX_KEYS) {
    steps.push(bptBase('done', `insert เสร็จสิ้น — parent ไม่เต็ม`, [], nodeMap[rootId], nodeMap, { [parentId]: 'found' }, null, undefined, 'เสร็จสิ้น'));
    return { rootId, steps };
  }

  // Split internal node
  steps.push(bptBase('split-internal-start',
    `Internal node เต็ม! (${parent.keys.length} > ${BPT_MAX_KEYS} keys) → ต้อง split`, [], nodeMap[rootId], nodeMap, { [parentId]: 'current' }, { nodeId: parentId },
    undefined, 'internal full — split'));

  const midIdx = Math.floor(parent.keys.length / 2);
  const moveUpKey = parent.keys[midIdx];
  const leftKeys = parent.keys.slice(0, midIdx);
  const rightKeys = parent.keys.slice(midIdx + 1);
  const leftChildren = parent.children.slice(0, midIdx + 1);
  const rightChildren = parent.children.slice(midIdx + 1);

  // Create new right internal node
  const newInternalId = bptId();
  const newInternal = { id: newInternalId, keys: rightKeys, children: rightChildren, isLeaf: false, next: null };
  // Update original
  parent.keys = leftKeys;
  parent.children = leftChildren;
  nodeMap[newInternalId] = newInternal;

  steps.push(bptBase('split-internal-done',
    `Split internal: left keys=[${leftKeys.join(', ')}], right keys=[${rightKeys.join(', ')}]  move up key=${moveUpKey} (ไม่ copy — key ถูกย้ายขึ้นไป)`, [], nodeMap[rootId], nodeMap, { [parentId]: 'current', [newInternalId]: 'new' }, { nodeId: newInternalId },
    `left=[${leftKeys.join(', ')}] right=[${rightKeys.join(', ')}] moveUp=${moveUpKey}`,
    'internal split done'));

  // Recursively insert moveUpKey into grandparent
  path.pop();
  return bptInsertIntoParent(rootId, nodeMap, parentId, moveUpKey, newInternalId, path, steps);
}

// Build initial B+ Tree from values (silent)
function bptBuildTree(values) {
  bptIdCounter = 0;
  const rootId = bptId();
  const nodeMap = {};
  nodeMap[rootId] = { id: rootId, keys: [], children: null, isLeaf: true, next: null };

  for (const v of values) {
    const result = bptInsertSteps(rootId, nodeMap, v);
    // After insert, rootId might change
    // We need to track the actual root — find it by looking for node with no parent
    const allIds = new Set(Object.keys(nodeMap));
    for (const [id, node] of Object.entries(nodeMap)) {
      if (node.children) {
        node.children.forEach((cid) => allIds.delete(cid));
      }
    }
    // The remaining ID is the root
    const actualRootId = allIds.values().next().value;
    if (actualRootId !== rootId) {
      // Root changed — update rootId for next iteration
      // But we can't change the const, so we need to restructure
      // Actually, let's just rebuild from scratch each time using a mutable approach
    }
  }

  // Find actual root
  const allIds = new Set(Object.keys(nodeMap));
  for (const [id, node] of Object.entries(nodeMap)) {
    if (node.children) {
      node.children.forEach((cid) => allIds.delete(cid));
    }
  }
  const actualRootId = allIds.values().next().value;
  return { rootId: actualRootId, nodeMap };
}

// Wrapper that handles root changes
function bptBuildTreeMutable(values) {
  bptIdCounter = 0;
  let rootId = bptId();
  const nodeMap = {};
  nodeMap[rootId] = { id: rootId, keys: [], children: null, isLeaf: true, next: null };

  for (const v of values) {
    const steps = bptInsertSteps(rootId, nodeMap, v);
    // Find actual root after insert
    const allIds = new Set(Object.keys(nodeMap));
    for (const [id, node] of Object.entries(nodeMap)) {
      if (node.children) {
        node.children.forEach((cid) => allIds.delete(cid));
      }
    }
    rootId = allIds.values().next().value;
  }

  return { rootId, nodeMap };
}

// Render B+ Tree
function bptRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes;
  const edges = step.edges;
  const roles = step.roles;
  const N = nodes.length;

  if (vizMeta) {
    const leafCount = nodes.filter((n) => n.isLeaf).length;
    const internalCount = nodes.filter((n) => !n.isLeaf).length;
    vizMeta.textContent = `${N} nodes (${internalCount} internal, ${leafCount} leaf) · order ${BPT_ORDER}`;
  }

  if (N === 0) {
    vizArea.appendChild(window.DS.el('div', { style: 'color:var(--text-muted);font-family:monospace;padding:40px;text-align:center' }, 'B+ Tree ว่าง — กด Insert เพื่อเริ่ม'));
    return;
  }

  // Group nodes by depth
  const maxDepth = Math.max(...nodes.map((n) => n.depth || 0));
  const nodesByDepth = {};
  nodes.forEach((n) => {
    if (!nodesByDepth[n.depth]) nodesByDepth[n.depth] = [];
    nodesByDepth[n.depth].push(n);
  });

  // Sort each level by left-to-right order (using in-order traversal)
  // Build nodeMap — reconstruct children from edges
  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = { id: n.id, keys: n.keys, isLeaf: n.isLeaf, depth: n.depth, next: n.next, children: [] };
  });
  edges.forEach(([p, c]) => {
    if (nodeMap[p]) nodeMap[p].children.push(c);
  });
  // Sort children by first key for correct left-to-right order
  nodes.forEach((n) => {
    if (!n.isLeaf && nodeMap[n.id] && nodeMap[n.id].children.length > 1) {
      nodeMap[n.id].children.sort((a, b) => {
        const ka = nodeMap[a] && nodeMap[a].keys.length > 0 ? nodeMap[a].keys[0] : 0;
        const kb = nodeMap[b] && nodeMap[b].keys.length > 0 ? nodeMap[b].keys[0] : 0;
        return ka - kb;
      });
    }
  });

  // Compute x positions using in-order traversal of leaves
  const leafOrder = [];
  function findLeftmostLeaf(nodeId) {
    const node = nodeMap[nodeId];
    if (node.isLeaf) return nodeId;
    return findLeftmostLeaf(node.children[0]);
  }

  // Find root (node with no parent in edges)
  const childIds = new Set(edges.map(([_, c]) => c));
  const root = nodes.find((n) => !childIds.has(n.id));
  if (root && root.isLeaf) {
    leafOrder.push(root.id);
  } else if (root) {
    // Walk down to leftmost leaf safely
    let cur = root;
    while (cur && !cur.isLeaf) {
      if (!cur.children || cur.children.length === 0) break;
      const firstChildId = cur.children[0];
      cur = nodeMap[firstChildId];
    }
    if (cur && cur.isLeaf) {
      leafOrder.push(cur.id);
      let nextId = cur.next;
      while (nextId && nodeMap[nextId]) {
        leafOrder.push(nextId);
        nextId = nodeMap[nextId].next;
      }
    }
  }

  // Fallback: if leafOrder is empty, just use all leaf nodes in order
  if (leafOrder.length === 0) {
    nodes.forEach((n) => { if (n.isLeaf) leafOrder.push(n.id); });
  }

  // Assign x positions
  const positions = {};
  let xCounter = 0;
  leafOrder.forEach((id) => { positions[id] = { x: xCounter++ }; });

  // For internal nodes, x = average of children x
  function computeX(nodeId) {
    if (positions[nodeId] != null) return positions[nodeId].x;
    const node = nodeMap[nodeId];
    if (!node) return 0;
    if (node.isLeaf) { positions[nodeId] = { x: xCounter++ }; return positions[nodeId].x; }
    if (!node.children || node.children.length === 0) { positions[nodeId] = { x: xCounter++ }; return positions[nodeId].x; }
    const childXs = node.children.map((cid) => computeX(cid));
    const avgX = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    positions[nodeId] = { x: avgX };
    return avgX;
  }
  if (root) computeX(root.id);

  // Compute pixel positions
  const nodeWidth = 80;
  const xSpacing = 100;
  const ySpacing = 90;
  const offsetX = 40;
  const offsetY = 30;
  Object.keys(positions).forEach((id) => {
    positions[id].px = offsetX + positions[id].x * xSpacing;
    positions[id].py = offsetY + (nodeMap[id].depth || 0) * ySpacing;
  });

  const maxX = Math.max(...Object.values(positions).map((p) => p.px));
  const maxY = Math.max(...Object.values(positions).map((p) => p.py));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(Math.max(maxX + 80, 400)));
  svg.setAttribute('height', String(maxY + 80));

  // Draw edges (parent → child)
  edges.forEach(([p, c]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(positions[p].px));
    line.setAttribute('y1', String(positions[p].py + 18));
    line.setAttribute('x2', String(positions[c].px));
    line.setAttribute('y2', String(positions[c].py - 18));
    line.setAttribute('stroke', 'var(--text-dim)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  });

  // Draw leaf linked list connections (dashed arrows)
  const leaves = nodes.filter((n) => n.isLeaf).sort((a, b) => positions[a.id].x - positions[b.id].x);
  for (let i = 0; i < leaves.length - 1; i++) {
    const from = leaves[i];
    const to = leaves[i + 1];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(positions[from.id].px + 35));
    line.setAttribute('y1', String(positions[from.id].py));
    line.setAttribute('x2', String(positions[to.id].px - 35));
    line.setAttribute('y2', String(positions[to.id].py));
    line.setAttribute('stroke', 'var(--purple)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-dasharray', '4,3');
    line.setAttribute('opacity', '0.6');
    svg.appendChild(line);
  }

  // Draw nodes as rectangles with keys
  nodes.forEach((node) => {
    const pos = positions[node.id];
    const role = roles[node.id] || '';
    const w = Math.max(nodeWidth, node.keys.length * 24 + 10);
    const h = 32;

    let fill = node.isLeaf ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)';
    let stroke = node.isLeaf ? 'var(--emerald)' : 'var(--text-dim)';
    let strokeWidth = '2';
    if (role === 'current') { fill = 'rgba(245,158,11,0.2)'; stroke = 'var(--amber)'; strokeWidth = '3'; }
    else if (role === 'new') { fill = 'rgba(20,184,166,0.2)'; stroke = 'var(--teal)'; strokeWidth = '3'; }
    else if (role === 'found') { fill = 'rgba(16,185,129,0.25)'; stroke = 'var(--emerald)'; strokeWidth = '3'; }

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(pos.px - w / 2));
    rect.setAttribute('y', String(pos.py - h / 2));
    rect.setAttribute('width', String(w));
    rect.setAttribute('height', String(h));
    rect.setAttribute('rx', '4');
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(rect);

    // Draw key separators (vertical lines inside node)
    for (let i = 0; i < node.keys.length - 1; i++) {
      const sepX = pos.px - w / 2 + (i + 1) * (w / node.keys.length);
      const sepLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      sepLine.setAttribute('x1', String(sepX));
      sepLine.setAttribute('y1', String(pos.py - h / 2));
      sepLine.setAttribute('x2', String(sepX));
      sepLine.setAttribute('y2', String(pos.py + h / 2));
      sepLine.setAttribute('stroke', 'var(--border)');
      sepLine.setAttribute('stroke-width', '1');
      svg.appendChild(sepLine);
    }

    // Draw keys
    node.keys.forEach((key, i) => {
      const keyX = pos.px - w / 2 + (i + 0.5) * (w / node.keys.length);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(keyX));
      text.setAttribute('y', String(pos.py + 5));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-family', 'monospace');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', node.isLeaf ? 'var(--emerald)' : 'var(--text)');
      text.textContent = String(key);
      svg.appendChild(text);
    });

    // Label below: "leaf" or "internal"
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(pos.px));
    label.setAttribute('y', String(pos.py + h / 2 + 14));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '9');
    label.setAttribute('font-family', 'monospace');
    label.setAttribute('fill', 'var(--text-muted)');
    label.textContent = node.isLeaf ? 'leaf' : 'internal';
    svg.appendChild(label);
  });

  vizArea.appendChild(svg);

  // Legend below
  const legend = window.DS.el('div', { style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);justify-content:center;flex-wrap:wrap;margin-top:8px' });
  legend.innerHTML = `
    <span><span style="display:inline-block;width:14px;height:10px;background:rgba(16,185,129,0.1);border:1px solid var(--emerald);border-radius:2px;vertical-align:middle"></span> leaf node (เก็บ data)</span>
    <span><span style="display:inline-block;width:14px;height:10px;background:var(--bg-card);border:1px solid var(--text-dim);border-radius:2px;vertical-align:middle"></span> internal node (routing)</span>
    <span><span style="display:inline-block;width:14px;height:2px;background:var(--purple);border-top:1px dashed var(--purple);vertical-align:middle"></span> leaf linked list</span>
    <span>Order m=${BPT_ORDER} (max ${BPT_MAX_KEYS} keys/node)</span>
  `;
  vizArea.appendChild(legend);
}

window.BPTREE = {
  insert: bptInsertSteps,
  render: bptRender,
  buildTree: bptBuildTreeMutable,
  order: BPT_ORDER,
};
