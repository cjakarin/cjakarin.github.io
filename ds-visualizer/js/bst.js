// ============ Binary Search Tree (BST) ============
//
// BST พื้นฐาน — ไม่มี self-balancing
// Operations: insert, search, delete (with 3 cases), traverse (in-order)
// In-order traversal ของ BST จะได้ค่าเรียงจากน้อยไปมาก

let bstIdCounter = 0;
function bstId() {
  bstIdCounter += 1;
  return `bst${bstIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function bstHeight(node) { return node ? node.height : 0; }

function bstSerialize(root) {
  const nodes = [];
  const edges = [];
  function dfs(node, parentId) {
    if (!node) return;
    nodes.push({ id: node.id, value: node.value });
    if (parentId) edges.push([parentId, node.id]);
    dfs(node.left, node.id);
    dfs(node.right, node.id);
  }
  dfs(root, null);
  return { nodes, edges };
}

function bstBase(operation, description, codeLines, root, roles = {}, highlight = null, consoleOutput, phase) {
  const serialized = bstSerialize(root);
  return {
    operation, description, codeLines,
    nodes: serialized.nodes,
    edges: serialized.edges,
    roles, highlight,
    consoleOutput, phase,
  };
}

// Silent insert (for building initial tree)
function bstSilentInsert(root, value) {
  if (!root) return { id: bstId(), value, left: null, right: null };
  if (value < root.value) root.left = bstSilentInsert(root.left, value);
  else if (value > root.value) root.right = bstSilentInsert(root.right, value);
  return root;
}

function bstBuildTree(values) {
  let root = null;
  for (const v of values) root = bstSilentInsert(root, v);
  return root;
}

// ===== INSERT =====
function bstInsertSteps(root, value) {
  const steps = [];
  steps.push(bstBase('init', `เริ่ม insert(${value}) ลง BST`, [], root, {}, null, undefined, 'เริ่มต้น'));

  function insert(node, value) {
    if (!node) {
      const newNode = { id: bstId(), value, left: null, right: null };
      steps.push(bstBase('insert-leaf',
        `ถึงตำแหน่งว่าง → สร้าง Node ใหม่ (value=${value})`, [], root, { [newNode.id]: 'new' }, { nodeId: newNode.id },
        `+ new node ${value}`, 'insert at leaf'));
      return newNode;
    }
    steps.push(bstBase('compare',
      `เปรียบเทียบ ${value} กับ ${node.value}`, [], root, { [node.id]: 'current' }, { nodeId: node.id },
      undefined, 'compare'));

    if (value < node.value) {
      steps.push(bstBase('go-left', `${value} < ${node.value} → ลงซ้าย`, [], root, { [node.id]: 'current' }, { nodeId: node.id }, undefined, 'go left'));
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      steps.push(bstBase('go-right', `${value} > ${node.value} → ลงขวา`, [], root, { [node.id]: 'current' }, { nodeId: node.id }, undefined, 'go right'));
      node.right = insert(node.right, value);
    } else {
      steps.push(bstBase('duplicate', `${value} == ${node.value} → ค่าซ้ำ ไม่ insert`, [], root, { [node.id]: 'found' }, null, `duplicate — skipped`, 'duplicate'));
      return node;
    }
    return node;
  }

  root = insert(root, value);
  steps.push(bstBase('done', `insert(${value}) เสร็จสิ้น`, [], root, {}, null, undefined, 'เสร็จสิ้น'));
  return steps;
}

// ===== SEARCH =====
function bstSearchSteps(root, value) {
  const steps = [];
  steps.push(bstBase('init', `เริ่ม search(${value}) ใน BST`, [], root, {}, null, undefined, 'เริ่มต้น'));

  let current = root;
  let depth = 0;
  while (current) {
    steps.push(bstBase('compare', `เปรียบเทียบ ${value} กับ ${current.value} (depth ${depth})`, [], root, { [current.id]: 'current' }, { nodeId: current.id }, undefined, 'compare'));

    if (value === current.value) {
      steps.push(bstBase('found', `${value} == ${current.value} → พบ! (ที่ depth ${depth})`, [], root, { [current.id]: 'found' }, { nodeId: current.id }, `search(${value}) → พบที่ depth ${depth}`, 'พบ'));
      return steps;
    } else if (value < current.value) {
      steps.push(bstBase('go-left', `${value} < ${current.value} → ลงซ้าย`, [], root, { [current.id]: 'current' }, { nodeId: current.id }, undefined, 'go left'));
      current = current.left;
    } else {
      steps.push(bstBase('go-right', `${value} > ${current.value} → ลงขวา`, [], root, { [current.id]: 'current' }, { nodeId: current.id }, undefined, 'go right'));
      current = current.right;
    }
    depth++;
  }

  steps.push(bstBase('not-found', `ถึง nullptr → ไม่พบ ${value} ใน BST`, [], root, {}, null, `search(${value}) → ไม่พบ`, 'ไม่พบ'));
  return steps;
}

// ===== IN-ORDER TRAVERSAL =====
function bstTraverseSteps(root) {
  const steps = [];
  const order = [];
  steps.push(bstBase('init', `เริ่ม in-order traversal (left → node → right)`, [], root, {}, null, undefined, 'เริ่มต้น'));

  function inorder(node) {
    if (!node) return;
    steps.push(bstBase('go-left', `ไป left subtree ของ ${node.value}`, [], root, { [node.id]: 'current' }, { nodeId: node.id }, undefined, 'go left'));
    inorder(node.left);
    order.push(node.value);
    steps.push(bstBase('visit', `เยี่ยม ${node.value} → เพิ่มลงผลลัพธ์ (ลำดับที่ ${order.length})`, [], root, { [node.id]: 'found' }, { nodeId: node.id }, `Output: ${order.join(' → ')}`, 'visit'));
    steps.push(bstBase('go-right', `ไป right subtree ของ ${node.value}`, [], root, { [node.id]: 'current' }, { nodeId: node.id }, undefined, 'go right'));
    inorder(node.right);
  }

  inorder(root);
  steps.push(bstBase('done', `In-order traversal เสร็จสิ้น — ได้ลำดับที่เรียงจากน้อยไปมาก`, [], root, {}, null, `In-order: ${order.join(' → ')}`, 'เสร็จสิ้น'));
  return steps;
}

// ===== RENDER =====
function bstRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes;
  const edges = step.edges;
  const roles = step.roles;
  const N = nodes.length;

  if (vizMeta) {
    vizMeta.textContent = `${N} nodes`;
  }

  if (N === 0) {
    vizArea.appendChild(window.DS.el('div', { style: 'color:var(--text-muted);font-family:monospace;padding:40px;text-align:center' }, 'BST ว่าง — กด Insert เพื่อเริ่ม'));
    return;
  }

  const children = {};
  nodes.forEach((n) => { children[n.id] = []; });
  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });
  const parentOf = {};
  edges.forEach(([p, c]) => { children[p].push(c); parentOf[c] = p; });
  const rootId = nodes.find((n) => !parentOf[n.id]).id;

  const positions = {};
  let xCounter = 0;
  function layout(id, depth) {
    const node = nodeMap[id];
    const kids = children[id];
    const leftKid = kids.find((k) => nodeMap[k].value < node.value);
    const rightKid = kids.find((k) => nodeMap[k].value > node.value);
    if (leftKid) layout(leftKid, depth + 1);
    positions[id] = { x: xCounter++, y: depth };
    if (rightKid) layout(rightKid, depth + 1);
  }
  layout(rootId, 0);

  const xSpacing = 56, ySpacing = 70, offsetX = 30, offsetY = 30;
  Object.keys(positions).forEach((id) => {
    positions[id].px = offsetX + positions[id].x * xSpacing;
    positions[id].py = offsetY + positions[id].y * ySpacing;
  });

  const maxX = Math.max(...Object.values(positions).map((p) => p.px));
  const maxY = Math.max(...Object.values(positions).map((p) => p.py));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(maxX + 60));
  svg.setAttribute('height', String(maxY + 60));

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

  nodes.forEach((node) => {
    const pos = positions[node.id];
    const role = roles[node.id] || '';
    let fill = 'var(--bg-card)', stroke = 'var(--text-dim)', textColor = 'var(--text)';
    if (role === 'current') { fill = 'var(--amber)'; stroke = 'var(--amber)'; textColor = 'white'; }
    else if (role === 'new') { fill = 'var(--teal)'; stroke = 'var(--teal)'; textColor = 'white'; }
    else if (role === 'found') { fill = 'var(--emerald)'; stroke = 'var(--emerald)'; textColor = 'white'; }

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
  });

  vizArea.appendChild(svg);
}

window.BST = {
  insert: bstInsertSteps,
  search: bstSearchSteps,
  traverse: bstTraverseSteps,
  render: bstRender,
  buildTree: bstBuildTree,
  makeInitial: (values) => bstBuildTree(values),
};
