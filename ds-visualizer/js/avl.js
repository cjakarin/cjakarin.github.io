// ============ AVL Tree (Self-Balancing BST) ============
//
// Insert + rotations (LL, RR, LR, RL) เพื่อรักษา balance factor ∈ {-1, 0, 1}
// ความสูง tree อยู่ใน O(log n) เสมอ

let avlIdCounter = 0;
function avlId() {
  avlIdCounter += 1;
  return `avl${avlIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

// AVL node: { id, value, left, right, height }
// We use object references (not array) for cleaner tree structure

function avlHeight(node) {
  return node ? node.height : 0;
}
function avlBalance(node) {
  return node ? avlHeight(node.left) - avlHeight(node.right) : 0;
}
function avlUpdateHeight(node) {
  if (node) node.height = 1 + Math.max(avlHeight(node.left), avlHeight(node.right));
}

// Serialize tree to flat node list + edge list for rendering
function avlSerialize(root) {
  const nodes = [];
  const edges = [];
  function dfs(node, parentId) {
    if (!node) return;
    const id = node.id;
    nodes.push({ id, value: node.value, height: node.height, balance: avlBalance(node) });
    if (parentId !== null) edges.push([parentId, id]);
    dfs(node.left, id);
    dfs(node.right, id);
  }
  dfs(root, null);
  return { nodes, edges };
}

function avlBase(operation, description, codeLines, root, roles = {}, highlight = null, consoleOutput, phase) {
  const serialized = avlSerialize(root);
  return {
    operation, description, codeLines,
    nodes: serialized.nodes,
    edges: serialized.edges,
    roles, highlight,
    consoleOutput, phase,
  };
}

function avlRotateRight(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  avlUpdateHeight(y);
  avlUpdateHeight(x);
  return x;
}

function avlRotateLeft(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  avlUpdateHeight(x);
  avlUpdateHeight(y);
  return y;
}

function avlInsertSteps(root, value) {
  const steps = [];
  const path = []; // track nodes along the insertion path

  steps.push(avlBase('init',
    `เริ่ม insert(${value}) ลง AVL tree`,
    [1], root, {}, null, undefined, 'เริ่มต้น'));

  // Step 1: standard BST insert (recursive) — track path
  function insert(node, value) {
    if (!node) {
      const newNode = { id: avlId(), value, left: null, right: null, height: 1 };
      steps.push(avlBase('insert-leaf',
        `ถึงตำแหน่งว่าง → สร้าง Node ใหม่ (value=${value}, height=1)`,
        [2, 3, 4], root, { [newNode.id]: 'new' }, { nodeId: newNode.id, type: 'new' },
        `+ new node ${value}`,
        'insert at leaf'));
      return newNode;
    }

    path.push(node.id);
    steps.push(avlBase('compare',
      `เปรียบเทียบ ${value} กับ ${node.value} (height=${node.height}, balance=${avlBalance(node)})`,
      [5, 6], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
      undefined, 'compare'));

    if (value < node.value) {
      steps.push(avlBase('go-left',
        `${value} < ${node.value} → ลงซ้าย`,
        [7, 8], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
        undefined, 'go left'));
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      steps.push(avlBase('go-right',
        `${value} > ${node.value} → ลงขวา`,
        [9, 10], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
        undefined, 'go right'));
      node.right = insert(node.right, value);
    } else {
      steps.push(avlBase('duplicate',
        `${value} == ${node.value} → ไม่ insert (AVL ไม่รับค่าซ้ำ)`,
        [], root, { [node.id]: 'found' }, { nodeId: node.id, type: 'current' },
        `duplicate — skipped`,
        'duplicate'));
      return node;
    }

    // Update height
    avlUpdateHeight(node);
    const bf = avlBalance(node);
    steps.push(avlBase('update-height',
      `กลับขึ้นมาที่ ${node.value}: update height=${node.height}, balance factor=${bf}`,
      [11, 12], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
      `h=${node.height}, bf=${bf}`,
      'update height'));

    // 4 cases of imbalance
    // LL Case
    if (bf > 1 && value < node.left.value) {
      steps.push(avlBase('ll-case',
        `LL Case: balance=${bf} > 1 และ ${value} < ${node.left.value} (insert ทางซ้ายของ left child) → rotate right`,
        [13, 14, 15], root, { [node.id]: 'current', [node.left.id]: 'target' }, { nodeId: node.id, type: 'rotate', rotation: 'LL' },
        undefined, 'LL → rotate right'));
      node = avlRotateRight(node);
      steps.push(avlBase('after-rotate',
        `หลัง rotate right: ${node.value} กลายเป็น root ของ subtree`,
        [], root, { [node.id]: 'found' }, null,
        `rotated (LL)`,
        'after rotation'));
    }
    // RR Case
    else if (bf < -1 && value > node.right.value) {
      steps.push(avlBase('rr-case',
        `RR Case: balance=${bf} < -1 และ ${value} > ${node.right.value} (insert ทางขวาของ right child) → rotate left`,
        [16, 17, 18], root, { [node.id]: 'current', [node.right.id]: 'target' }, { nodeId: node.id, type: 'rotate', rotation: 'RR' },
        undefined, 'RR → rotate left'));
      node = avlRotateLeft(node);
      steps.push(avlBase('after-rotate',
        `หลัง rotate left: ${node.value} กลายเป็น root ของ subtree`,
        [], root, { [node.id]: 'found' }, null,
        `rotated (RR)`,
        'after rotation'));
    }
    // LR Case
    else if (bf > 1 && value > node.left.value) {
      steps.push(avlBase('lr-case',
        `LR Case: balance=${bf} > 1 และ ${value} > ${node.left.value} (insert ทางขวาของ left child) → rotate left ที่ left child แล้ว rotate right ที่ node`,
        [19, 20, 21, 22], root, { [node.id]: 'current', [node.left.id]: 'target' }, { nodeId: node.id, type: 'rotate', rotation: 'LR' },
        undefined, 'LR → double rotate'));
      node.left = avlRotateLeft(node.left);
      node = avlRotateRight(node);
      steps.push(avlBase('after-rotate',
        `หลัง double rotation (LR): ${node.value} กลายเป็น root ของ subtree`,
        [], root, { [node.id]: 'found' }, null,
        `rotated (LR)`,
        'after rotation'));
    }
    // RL Case
    else if (bf < -1 && value < node.right.value) {
      steps.push(avlBase('rl-case',
        `RL Case: balance=${bf} < -1 และ ${value} < ${node.right.value} (insert ทางซ้ายของ right child) → rotate right ที่ right child แล้ว rotate left ที่ node`,
        [23, 24, 25, 26], root, { [node.id]: 'current', [node.right.id]: 'target' }, { nodeId: node.id, type: 'rotate', rotation: 'RL' },
        undefined, 'RL → double rotate'));
      node.right = avlRotateRight(node.right);
      node = avlRotateLeft(node);
      steps.push(avlBase('after-rotate',
        `หลัง double rotation (RL): ${node.value} กลายเป็น root ของ subtree`,
        [], root, { [node.id]: 'found' }, null,
        `rotated (RL)`,
        'after rotation'));
    }

    return node;
  }

  root = insert(root, value);

  steps.push(avlBase('done',
    `insert(${value}) เสร็จสิ้น — AVL tree ยังคง balanced (height ใน O(log n))`,
    [], root, {}, null,
    `Tree height: ${avlHeight(root)}`,
    'เสร็จสิ้น'));

  return steps;
}

// Build sample AVL tree from values
function avlBuildTree(values) {
  let root = null;
  for (const v of values) {
    // Use the same insert but without recording steps (silent insert)
    function silentInsert(node, value) {
      if (!node) return { id: avlId(), value, left: null, right: null, height: 1 };
      if (value < node.value) node.left = silentInsert(node.left, value);
      else if (value > node.value) node.right = silentInsert(node.right, value);
      else return node;
      avlUpdateHeight(node);
      const bf = avlBalance(node);
      if (bf > 1 && value < node.left.value) return avlRotateRight(node);
      if (bf < -1 && value > node.right.value) return avlRotateLeft(node);
      if (bf > 1 && value > node.left.value) { node.left = avlRotateLeft(node.left); return avlRotateRight(node); }
      if (bf < -1 && value < node.right.value) { node.right = avlRotateRight(node.right); return avlRotateLeft(node); }
      return node;
    }
    root = silentInsert(root, v);
  }
  return root;
}

// Render: tree with values + height/balance labels
function avlRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes;
  const edges = step.edges;
  const roles = step.roles;
  const N = nodes.length;

  if (vizMeta) {
    const maxHeight = nodes.reduce((m, n) => Math.max(m, n.height), 0);
    vizMeta.textContent = `${N} nodes · tree height = ${maxHeight} · log₂(N+1) = ${N > 0 ? Math.ceil(Math.log2(N + 1)) : 0}`;
  }

  if (N === 0) {
    vizArea.appendChild(window.DS.el('div', {
      style: 'color:var(--text-muted);font-family:monospace;padding:40px;text-align:center',
    }, 'AVL tree ว่าง — กด Insert เพื่อเริ่ม'));
    return;
  }

  // Build adjacency for layout
  const children = {};
  nodes.forEach((n) => { children[n.id] = []; });
  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });
  const parentOf = {};
  edges.forEach(([p, c]) => {
    children[p].push(c);
    parentOf[c] = p;
  });
  const rootId = nodes.find((n) => !parentOf[n.id]).id;

  // Layout: in-order x position
  const positions = {};
  let xCounter = 0;
  function layout(id, depth) {
    const node = nodeMap[id];
    const kids = children[id];
    const leftKid = kids.find((k) => nodeMap[k].value < node.value);
    const rightKid = kids.find((k) => nodeMap[k].value > node.value);
    let leftX, rightX;
    if (leftKid) leftX = layout(leftKid, depth + 1);
    const myX = xCounter++;
    if (rightKid) rightX = layout(rightKid, depth + 1);
    positions[id] = { x: myX, y: depth };
    return myX;
  }
  layout(rootId, 0);

  // Compute pixel positions
  const xSpacing = 56;
  const ySpacing = 70;
  const offsetX = 30;
  const offsetY = 30;
  Object.keys(positions).forEach((id) => {
    positions[id].px = offsetX + positions[id].x * xSpacing;
    positions[id].py = offsetY + positions[id].y * ySpacing;
  });

  // Find max x for SVG width
  const maxX = Math.max(...Object.values(positions).map((p) => p.px));
  const maxY = Math.max(...Object.values(positions).map((p) => p.py));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(maxX + 60));
  svg.setAttribute('height', String(maxY + 80));

  // Draw edges
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

  // Draw nodes
  nodes.forEach((node) => {
    const pos = positions[node.id];
    const role = roles[node.id] || '';
    let fill = 'var(--bg-card)';
    let stroke = 'var(--text-dim)';
    let textColor = 'var(--text)';
    if (role === 'current') { fill = 'var(--amber)'; stroke = 'var(--amber)'; textColor = 'white'; }
    else if (role === 'new') { fill = 'var(--teal)'; stroke = 'var(--teal)'; textColor = 'white'; }
    else if (role === 'found') { fill = 'var(--emerald)'; stroke = 'var(--emerald)'; textColor = 'white'; }
    else if (role === 'target') { fill = 'var(--pink)'; stroke = 'var(--pink)'; textColor = 'white'; }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.px));
    circle.setAttribute('cy', String(pos.py));
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(pos.px));
    text.setAttribute('y', String(pos.py + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', textColor);
    text.textContent = String(node.value);
    svg.appendChild(text);

    // Height + balance label below
    const info = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    info.setAttribute('x', String(pos.px));
    info.setAttribute('y', String(pos.py + 34));
    info.setAttribute('text-anchor', 'middle');
    info.setAttribute('font-size', '10');
    info.setAttribute('font-family', 'monospace');
    info.setAttribute('fill', 'var(--text-muted)');
    info.textContent = `h=${node.height} bf=${node.balance}`;
    svg.appendChild(info);
  });

  vizArea.appendChild(svg);
}

window.AVL = {
  insert: avlInsertSteps,
  render: avlRender,
  buildTree: avlBuildTree,
  makeInitial: (values) => avlBuildTree(values),
};
