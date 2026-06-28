// ============ AVL Tree (Self-Balancing BST) ============
//
// BST ที่ balance เองด้วย rotations (LL, RR, LR, RL)
// - height(node) = longest path จาก node ลงไป leaf
// - balance(node) = height(left) - height(right) ∈ {-1, 0, 1}
// - ถ้า |balance| > 1 → rotate
// Time: insert/search/delete = O(log n)

let avlIdCounter = 0;
function avlId() {
  avlIdCounter += 1;
  return `avl${avlIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function avlHeight(node) { return node ? node.height : 0; }
function avlBalance(node) { return node ? avlHeight(node.left) - avlHeight(node.right) : 0; }
function avlUpdateHeight(node) {
  if (node) node.height = 1 + Math.max(avlHeight(node.left), avlHeight(node.right));
}

function avlRotateRight(y) {
  const x = y.left;
  y.left = x.right;
  x.right = y;
  avlUpdateHeight(y);
  avlUpdateHeight(x);
  return x;
}
function avlRotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left = x;
  avlUpdateHeight(x);
  avlUpdateHeight(y);
  return y;
}

// ===== Serialize tree → flat nodes/edges for renderer =====
function avlSerialize(root) {
  const nodes = [];
  const edges = [];
  function walk(node, parent) {
    if (!node) return;
    nodes.push({ id: node.id, value: node.value, height: node.height });
    if (parent) edges.push({ from: parent.id, to: node.id, side: parent.left === node ? 'left' : 'right' });
    walk(node.left, node);
    walk(node.right, node);
  }
  walk(root, null);
  return { nodes, edges };
}

function avlStep(operation, description, codeLines, root, roles = {}, consoleOutput, phase, highlight = {}) {
  const { nodes, edges } = avlSerialize(root);
  return {
    operation, description, codeLines,
    nodes, edges,
    roles: { ...roles },
    consoleOutput, phase,
    highlight: { ...highlight },
  };
}

// ===== Insert with step recording =====
function avlInsert(root, value) {
  const steps = [];
  const newId = avlId();

  steps.push(avlStep('insert',
    `เริ่ม insert(${value})${root ? '' : ' — tree ว่าง จะสร้าง root ใหม่'}`,
    [21], root, {}, undefined, 'เริ่มต้น'));

  function insert(node, v) {
    // Step: visit node (or create new)
    if (!node) {
      const newNode = { id: newId, value: v, left: null, right: null, height: 1 };
      steps.push(avlStep('insert',
        `node == nullptr → สร้าง Node ใหม่{value=${v}, height=1}  คืนเป็น root ของ subtree นี้`,
        [22], root || newNode, { [newId]: 'new' },
        `+ insert ${v} (new leaf)`, 'สร้าง node ใหม่'));
      return newNode;
    }

    steps.push(avlStep('insert',
      `visit node ${node.value} (height=${node.height}) — เปรียบเทียบ ${v} กับ ${node.value}`,
      [21, 23], root, { [node.id]: 'current' }, undefined, `visit ${node.value}`));

    if (v < node.value) {
      steps.push(avlStep('insert',
        `${v} < ${node.value} → recurse ลง left subtree`,
        [23], root, { [node.id]: 'current' }, undefined, `ไป left`));
      node.left = insert(node.left, v);
    } else if (v > node.value) {
      steps.push(avlStep('insert',
        `${v} > ${node.value} → recurse ลง right subtree`,
        [24], root, { [node.id]: 'current' }, undefined, `ไป right`));
      node.right = insert(node.right, v);
    } else {
      steps.push(avlStep('insert',
        `${v} == ${node.value} → ไม่ insert (BST ไม่เก็บ duplicate)`,
        [25], root, { [node.id]: 'found' },
        `insert(${v}) → มีอยู่แล้ว (skip)`, 'duplicate'));
      return node;
    }

    // Update height
    avlUpdateHeight(node);
    const bf = avlBalance(node);
    steps.push(avlStep('insert',
      `กลับขึ้นที่ ${node.value}: update height = 1 + max(h(left)=${avlHeight(node.left)}, h(right)=${avlHeight(node.right)}) = ${node.height}  · balance = ${bf}`,
      [26, 27], root, { [node.id]: 'current' }, undefined, `update height ${node.value}`));

    // 4 cases of rotation
    if (bf > 1 && v < node.left.value) {
      // LL: rotateRight
      steps.push(avlStep('insert',
        `LL Case: balance=${bf} > 1 และ ${v} < ${node.left.value} (inserted ทาง left ของ left) → rotateRight(${node.value})`,
        [28], root, { [node.id]: 'current', [node.left.id]: 'target' },
        undefined, 'LL → rotateRight'));
      const newRoot = avlRotateRight(node);
      steps.push(avlStep('insert',
        `หลัง rotateRight: ${node.value} ลงเป็น right child ของ ${newRoot.value}  ต้นไม้ balance แล้ว`,
        [8, 9, 10, 11, 12], newRoot, { [newRoot.id]: 'found', [node.id]: 'target' },
        `rotateRight(${node.value}) → balance แล้ว`, 'หลัง rotate'));
      return newRoot;
    }
    if (bf < -1 && v > node.right.value) {
      // RR: rotateLeft
      steps.push(avlStep('insert',
        `RR Case: balance=${bf} < -1 และ ${v} > ${node.right.value} (inserted ทาง right ของ right) → rotateLeft(${node.value})`,
        [29], root, { [node.id]: 'current', [node.right.id]: 'target' },
        undefined, 'RR → rotateLeft'));
      const newRoot = avlRotateLeft(node);
      steps.push(avlStep('insert',
        `หลัง rotateLeft: ${node.value} ลงเป็น left child ของ ${newRoot.value}  ต้นไม้ balance แล้ว`,
        [14, 15, 16, 17, 18], newRoot, { [newRoot.id]: 'found', [node.id]: 'target' },
        `rotateLeft(${node.value}) → balance แล้ว`, 'หลัง rotate'));
      return newRoot;
    }
    if (bf > 1 && v > node.left.value) {
      // LR: rotateLeft(left) then rotateRight
      steps.push(avlStep('insert',
        `LR Case: balance=${bf} > 1 และ ${v} > ${node.left.value} (inserted ทาง right ของ left) → ต้อง rotate 2 ครั้ง`,
        [30], root, { [node.id]: 'current', [node.left.id]: 'target' },
        undefined, 'LR → 2 rotations'));
      node.left = avlRotateLeft(node.left);
      steps.push(avlStep('insert',
        `ขั้นที่ 1: rotateLeft(${node.left === null ? '?' : '?'}) — ทำให้กลายเป็น LL case`,
        [14, 15, 16, 17, 18], root, { [node.id]: 'current', [node.left.id]: 'target' },
        undefined, 'rotateLeft(left)'));
      const newRoot = avlRotateRight(node);
      steps.push(avlStep('insert',
        `ขั้นที่ 2: rotateRight(${node.value}) — ต้นไม้ balance แล้ว`,
        [8, 9, 10, 11, 12, 30], newRoot, { [newRoot.id]: 'found', [node.id]: 'target' },
        `LR fixed → balance แล้ว`, 'หลัง rotate'));
      return newRoot;
    }
    if (bf < -1 && v < node.right.value) {
      // RL: rotateRight(right) then rotateLeft
      steps.push(avlStep('insert',
        `RL Case: balance=${bf} < -1 และ ${v} < ${node.right.value} (inserted ทาง left ของ right) → ต้อง rotate 2 ครั้ง`,
        [31], root, { [node.id]: 'current', [node.right.id]: 'target' },
        undefined, 'RL → 2 rotations'));
      node.right = avlRotateRight(node.right);
      steps.push(avlStep('insert',
        `ขั้นที่ 1: rotateRight(right) — ทำให้กลายเป็น RR case`,
        [8, 9, 10, 11, 12], root, { [node.id]: 'current', [node.right.id]: 'target' },
        undefined, 'rotateRight(right)'));
      const newRoot = avlRotateLeft(node);
      steps.push(avlStep('insert',
        `ขั้นที่ 2: rotateLeft(${node.value}) — ต้นไม้ balance แล้ว`,
        [14, 15, 16, 17, 18, 31], newRoot, { [newRoot.id]: 'found', [node.id]: 'target' },
        `RL fixed → balance แล้ว`, 'หลัง rotate'));
      return newRoot;
    }

    steps.push(avlStep('insert',
      `balance=${bf} ∈ {-1, 0, 1} → ไม่ต้อง rotate  คืน ${node.value} เป็น root ของ subtree`,
      [32], root, { [node.id]: 'found' }, undefined, `balance OK`));
    return node;
  }

  const newRoot = insert(root, value);

  // Final step
  steps.push(avlStep('insert',
    `insert(${value}) เสร็จสิ้น — AVL tree balance แล้ว (height ∈ O(log n))`,
    [], newRoot, {}, `insert(${value}) → สำเร็จ`, 'เสร็จสิ้น'));

  return { steps, root: newRoot };
}

// ===== Rebuild tree from a list of values (silent — no step recording) =====
function avlMakeInitial(values) {
  let root = null;
  for (const v of values) {
    const result = avlInsertSilent(root, v);
    root = result;
  }
  return root;
}
function avlInsertSilent(node, v) {
  if (!node) return { id: avlId(), value: v, left: null, right: null, height: 1 };
  if (v < node.value) node.left = avlInsertSilent(node.left, v);
  else if (v > node.value) node.right = avlInsertSilent(node.right, v);
  else return node;
  avlUpdateHeight(node);
  const bf = avlBalance(node);
  if (bf > 1 && v < node.left.value) return avlRotateRight(node);
  if (bf < -1 && v > node.right.value) return avlRotateLeft(node);
  if (bf > 1 && v > node.left.value) { node.left = avlRotateLeft(node.left); return avlRotateRight(node); }
  if (bf < -1 && v < node.right.value) { node.right = avlRotateRight(node.right); return avlRotateLeft(node); }
  return node;
}

// ===== Renderer =====
function avlRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes || [];
  const edges = step.edges || [];
  const roles = step.roles || {};

  if (vizMeta) {
    vizMeta.textContent = `${nodes.length} node${nodes.length !== 1 ? 's' : ''}${nodes.length > 0 ? ` · height = ${nodes[0] ? nodes[0].height : 0}` : ''}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:20px;padding:16px;align-items:center' });

  if (nodes.length === 0) {
    wrap.appendChild(window.DS.el('div', {
      style: 'color:var(--text-muted);font-family:monospace;font-size:13px;padding:40px',
    }, 'Tree ว่าง — กด Insert เพื่อเพิ่ม node แรก'));
    vizArea.appendChild(wrap);
    return;
  }

  // Build node map
  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Build children map
  const children = {};
  nodes.forEach((n) => { children[n.id] = { left: null, right: null }; });
  edges.forEach((e) => {
    if (children[e.from]) children[e.from][e.side] = e.to;
  });

  // Find root: a node that's not a child of anyone
  const childIds = new Set(edges.map((e) => e.to));
  const rootId = nodes.find((n) => !childIds.has(n.id)).id;

  // Layout using in-order traversal
  const positions = {};
  let xCounter = 0;
  function layout(id, depth) {
    if (!id) return;
    const ch = children[id];
    if (!ch.left && !ch.right) {
      positions[id] = { x: xCounter * 60 + 30, y: depth * 80 + 30 };
      xCounter++;
      return;
    }
    if (ch.left) layout(ch.left, depth + 1);
    const leftX = ch.left ? positions[ch.left].x : null;
    layout(ch.right, depth + 1);
    const rightX = ch.right ? positions[ch.right].x : null;
    if (leftX != null && rightX != null) {
      positions[id] = { x: (leftX + rightX) / 2, y: depth * 80 + 30 };
    } else if (leftX != null) {
      positions[id] = { x: leftX + 30, y: depth * 80 + 30 };
    } else {
      positions[id] = { x: rightX - 30, y: depth * 80 + 30 };
    }
  }
  layout(rootId, 0);

  // Compute tree bounds
  let maxX = 0, maxY = 0;
  for (const id in positions) {
    maxX = Math.max(maxX, positions[id].x);
    maxY = Math.max(maxY, positions[id].y);
  }
  const svgWidth = Math.max(maxX + 60, 200);
  const svgHeight = maxY + 60;

  const svg = window.DS.el('svg', { width: String(svgWidth), height: String(svgHeight) });
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  // Draw edges first
  edges.forEach((e) => {
    const from = positions[e.from];
    const to = positions[e.to];
    if (!from || !to) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(from.x));
    line.setAttribute('y1', String(from.y + 22));
    line.setAttribute('x2', String(to.x));
    line.setAttribute('y2', String(to.y - 22));
    line.setAttribute('stroke', 'var(--text-dim)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  });

  // Draw nodes
  nodes.forEach((n) => {
    const pos = positions[n.id];
    if (!pos) return;
    const role = roles[n.id] || '';
    let fill = 'var(--bg-card)', stroke = 'var(--text-dim)', textColor = 'var(--text)';
    if (role === 'current') { fill = 'rgba(245,158,11,0.15)'; stroke = 'var(--amber)'; }
    else if (role === 'new') { fill = 'rgba(20,184,166,0.15)'; stroke = 'var(--teal)'; textColor = 'var(--teal)'; }
    else if (role === 'target') { fill = 'rgba(236,72,153,0.15)'; stroke = 'var(--pink)'; }
    else if (role === 'found') { fill = 'rgba(16,185,129,0.15)'; stroke = 'var(--emerald)'; }
    else if (role === 'prev') { fill = 'rgba(168,85,247,0.15)'; stroke = 'var(--purple)'; }

    // Pointer chip above
    if (role) {
      const chipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      chipBg.setAttribute('x', String(pos.x - 18));
      chipBg.setAttribute('y', String(pos.y - 40));
      chipBg.setAttribute('width', '36');
      chipBg.setAttribute('height', '14');
      chipBg.setAttribute('rx', '3');
      let chipColor = 'var(--text-dim)';
      if (role === 'current') chipColor = 'var(--amber)';
      else if (role === 'new') chipColor = 'var(--teal)';
      else if (role === 'target') chipColor = 'var(--pink)';
      else if (role === 'found') chipColor = 'var(--emerald)';
      else if (role === 'prev') chipColor = 'var(--purple)';
      chipBg.setAttribute('fill', chipColor);
      svg.appendChild(chipBg);

      const chipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chipText.setAttribute('x', String(pos.x));
      chipText.setAttribute('y', String(pos.y - 30));
      chipText.setAttribute('text-anchor', 'middle');
      chipText.setAttribute('font-size', '9');
      chipText.setAttribute('font-family', 'monospace');
      chipText.setAttribute('font-weight', 'bold');
      chipText.setAttribute('fill', 'white');
      chipText.textContent = role;
      svg.appendChild(chipText);
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '20');
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
    text.textContent = String(n.value);
    svg.appendChild(text);

    // Height label below
    const hLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hLabel.setAttribute('x', String(pos.x));
    hLabel.setAttribute('y', String(pos.y + 34));
    hLabel.setAttribute('text-anchor', 'middle');
    hLabel.setAttribute('font-size', '9');
    hLabel.setAttribute('font-family', 'monospace');
    hLabel.setAttribute('fill', 'var(--text-muted)');
    hLabel.textContent = `h=${n.height}`;
    svg.appendChild(hLabel);
  });

  wrap.appendChild(svg);
  vizArea.appendChild(wrap);
}

window.AVL = {
  insert: avlInsert,
  render: avlRender,
  makeInitial: avlMakeInitial,
  serialize: avlSerialize,
};
