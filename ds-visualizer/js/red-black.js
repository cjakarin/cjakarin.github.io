// ============ Red-Black Tree (Self-Balancing BST) ============
//
// Insert + rebalancing โดยใช้กฎ 5 ข้อ:
// 1. ทุก node เป็น RED หรือ BLACK
// 2. Root เป็น BLACK
// 3. ทุก NULL leaf เป็น BLACK
// 4. ถ้า node เป็น RED → children ต้องเป็น BLACK (ไม่มี RED-RED ติดกัน)
// 5. ทุก path จาก root สู่ leaf ต้องมีจำนวน BLACK nodes เท่ากัน (black-height)
//
// เมื่อ insert ทำใน 2 เฟส: BST insert ปกติ → fixup ด้วย recolor/rotation

let rbIdCounter = 0;
function rbId() {
  rbIdCounter += 1;
  return `rb${rbIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

// RB node: { id, value, color: 'RED'|'BLACK', left, right, parent }
// NIL node แทนด้วย null (implicit BLACK)

function rbSerialize(root) {
  const nodes = [];
  const edges = [];
  function dfs(node, parentId) {
    if (!node) return;
    const id = node.id;
    nodes.push({ id, value: node.value, color: node.color });
    if (parentId !== null) edges.push([parentId, id]);
    dfs(node.left, id);
    dfs(node.right, id);
  }
  dfs(root, null);
  return { nodes, edges };
}

function rbBase(operation, description, codeLines, root, roles = {}, highlight = null, consoleOutput, phase) {
  const serialized = rbSerialize(root);
  return {
    operation, description, codeLines,
    nodes: serialized.nodes,
    edges: serialized.edges,
    roles, highlight,
    consoleOutput, phase,
  };
}

function rbGetParent(node, parentMap) {
  return node ? (parentMap[node.id] || null) : null;
}

// Build parent map by walking the tree
function rbBuildParentMap(root, parentMap = {}, parent = null) {
  if (!root) return parentMap;
  if (parent) parentMap[root.id] = parent.id;
  rbBuildParentMap(root.left, parentMap, root);
  rbBuildParentMap(root.right, parentMap, root);
  return parentMap;
}

function rbRotateLeft(root, x, parentMap) {
  const y = x.right;
  x.right = y.left;
  if (y.left) parentMap[y.left.id] = x.id;
  y.left = x;
  // Update x's parent to point to y
  const xParentId = parentMap[x.id];
  if (!xParentId) {
    // x was root
    parentMap[y.id] = null;
    delete parentMap[x.id];
    parentMap[x.id] = y.id;
    return y;
  } else {
    const xParent = rbFindNode(root, xParentId);
    if (xParent.left === x) xParent.left = y;
    else xParent.right = y;
    parentMap[y.id] = xParentId;
    parentMap[x.id] = y.id;
    return root;
  }
}

function rbRotateRight(root, x, parentMap) {
  const y = x.left;
  x.left = y.right;
  if (y.right) parentMap[y.right.id] = x.id;
  y.right = x;
  const xParentId = parentMap[x.id];
  if (!xParentId) {
    parentMap[y.id] = null;
    delete parentMap[x.id];
    parentMap[x.id] = y.id;
    return y;
  } else {
    const xParent = rbFindNode(root, xParentId);
    if (xParent.left === x) xParent.left = y;
    else xParent.right = y;
    parentMap[y.id] = xParentId;
    parentMap[x.id] = y.id;
    return root;
  }
}

function rbFindNode(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  return rbFindNode(root.left, id) || rbFindNode(root.right, id);
}

function rbInsertSteps(root, value) {
  const steps = [];
  const parentMap = rbBuildParentMap(root);

  steps.push(rbBase('init',
    `เริ่ม insert(${value}) ลง Red-Black tree`,
    [1], root, {}, null, undefined, 'เริ่มต้น'));

  // Step 1: BST insert (new node is RED)
  let newNode = null;
  function bstInsert(node, value) {
    if (!node) {
      newNode = { id: rbId(), value, color: 'RED', left: null, right: null };
      steps.push(rbBase('insert-leaf',
        `ถึงตำแหน่งว่าง → สร้าง Node ใหม่ (value=${value}, color=RED เสมอ)`,
        [2, 3, 4, 5], root, { [newNode.id]: 'new' }, { nodeId: newNode.id, type: 'new' },
        `+ new RED node ${value}`,
        'insert at leaf'));
      return newNode;
    }
    steps.push(rbBase('compare',
      `เปรียบเทียบ ${value} กับ ${node.value} (color=${node.color})`,
      [6, 7], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
      undefined, 'compare'));

    if (value < node.value) {
      steps.push(rbBase('go-left',
        `${value} < ${node.value} → ลงซ้าย`,
        [8, 9], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
        undefined, 'go left'));
      node.left = bstInsert(node.left, value);
      if (node.left) parentMap[node.left.id] = node.id;
    } else if (value > node.value) {
      steps.push(rbBase('go-right',
        `${value} > ${node.value} → ลงขวา`,
        [10, 11], root, { [node.id]: 'current' }, { nodeId: node.id, type: 'current' },
        undefined, 'go right'));
      node.right = bstInsert(node.right, value);
      if (node.right) parentMap[node.right.id] = node.id;
    } else {
      steps.push(rbBase('duplicate',
        `${value} == ${node.value} → ไม่ insert (ค่าซ้ำ)`,
        [], root, { [node.id]: 'found' }, null, `duplicate — skipped`, 'duplicate'));
      return node;
    }
    return node;
  }

  root = bstInsert(root, value);
  if (newNode) parentMap[newNode.id] = null; // will be updated below
  // Rebuild parent map after insertion
  Object.keys(parentMap).forEach((k) => delete parentMap[k]);
  rbBuildParentMap(root, parentMap, null);

  if (!newNode) return steps; // duplicate, no fixup needed

  // Step 2: Fixup — handle RED-RED violations
  let current = newNode;
  let currentId = current.id;

  steps.push(rbBase('fixup-start',
    `เริ่ม fixup — ตรวจ RED-RED violation (ถ้า parent เป็น RED ต้องแก้)`,
    [12, 13], root, { [currentId]: 'current' }, null,
    undefined, 'fixup start'));

  function getParent(id) {
    return parentMap[id] ? rbFindNode(root, parentMap[id]) : null;
  }
  function getGrandparent(id) {
    const p = getParent(id);
    if (!p) return null;
    return getParent(p.id);
  }
  function getUncle(id) {
    const gp = getGrandparent(id);
    if (!gp) return null;
    const p = getParent(id);
    return gp.left === p ? gp.right : gp.left;
  }

  let iterations = 0;
  while (currentId && parentMap[currentId]) {
    iterations++;
    if (iterations > 20) break; // safety

    const parent = getParent(currentId);
    const gp = getGrandparent(currentId);
    const uncle = getUncle(currentId);

    if (!parent || !gp) break;

    if (parent.color === 'BLACK') {
      steps.push(rbBase('parent-black',
        `Parent ${parent.value} เป็น BLACK → ไม่มี violation หยุด fixup`,
        [14, 15], root, { [currentId]: 'current', [parent.id]: 'found' }, null,
        `no violation — done`,
        'parent BLACK'));
      break;
    }

    // Parent is RED — violation!
    if (uncle && uncle.color === 'RED') {
      // Case 1: Uncle is RED → recolor parent, uncle to BLACK, grandparent to RED
      // Then move violation up to grandparent
      steps.push(rbBase('case1',
        `Case 1: Uncle ${uncle.value} เป็น RED → recolor parent ${parent.value}=BLACK, uncle=BLACK, grandparent ${gp.value}=RED  แล้วย้าย violation ขึ้นไปที่ grandparent`,
        [16, 17, 18, 19, 20], root,
        { [currentId]: 'current', [parent.id]: 'target', [uncle.id]: 'target', [gp.id]: 'target' },
        null,
        `recolor: P=BLACK, U=BLACK, GP=RED`,
        'Case 1: recolor'));
      parent.color = 'BLACK';
      uncle.color = 'BLACK';
      gp.color = 'RED';
      currentId = gp.id;
      current = gp;
      steps.push(rbBase('case1-after',
        `หลัง recolor — ย้าย current ไปที่ grandparent ${gp.value} (RED) เพื่อตรวจต่อ`,
        [], root, { [currentId]: 'current' }, null,
        undefined, 'after Case 1'));
    } else {
      // Uncle is BLACK (or null) → Cases 2 & 3 (rotations)
      const parentIsLeftChild = (gp.left === parent);
      const currentIsLeftChild = (parent.left === current);

      if (parentIsLeftChild && !currentIsLeftChild) {
        // Case 2: LR — rotate parent left, then becomes Case 3
        steps.push(rbBase('case2-lr',
          `Case 2 (LR): parent เป็น left child, current เป็น right child → rotate left ที่ parent แล้วกลายเป็น Case 3`,
          [21, 22, 23, 24], root,
          { [currentId]: 'current', [parent.id]: 'target', [gp.id]: 'found' },
          null,
          undefined,
          'Case 2: LR rotate'));
        root = rbRotateLeft(root, parent, parentMap);
        // After rotation, current and parent swap roles
        currentId = parent.id;
        current = parent;
      } else if (!parentIsLeftChild && currentIsLeftChild) {
        // Case 2 mirror: RL — rotate parent right, then becomes Case 3
        steps.push(rbBase('case2-rl',
          `Case 2 (RL): parent เป็น right child, current เป็น left child → rotate right ที่ parent แล้วกลายเป็น Case 3`,
          [21, 22, 23, 24], root,
          { [currentId]: 'current', [parent.id]: 'target', [gp.id]: 'found' },
          null,
          undefined,
          'Case 2: RL rotate'));
        root = rbRotateRight(root, parent, parentMap);
        currentId = parent.id;
        current = parent;
      }

      // Re-fetch parent, gp, uncle (they may have changed)
      const parent2 = getParent(currentId);
      const gp2 = getGrandparent(currentId);
      if (!parent2 || !gp2) break;

      // Case 3: LL or RR — rotate grandparent
      const parentIsLeft2 = (gp2.left === parent2);
      const currentIsLeft2 = (parent2.left === current);

      if (parentIsLeft2 && currentIsLeft2) {
        // Case 3 LL: rotate grandparent right
        steps.push(rbBase('case3-ll',
          `Case 3 (LL): parent และ current เป็น left child → recolor parent=BLACK, grandparent=RED  แล้ว rotate right ที่ grandparent`,
          [25, 26, 27, 28], root,
          { [currentId]: 'current', [parent2.id]: 'target', [gp2.id]: 'found' },
          null,
          undefined,
          'Case 3: LL rotate'));
        parent2.color = 'BLACK';
        gp2.color = 'RED';
        root = rbRotateRight(root, gp2, parentMap);
      } else if (!parentIsLeft2 && !currentIsLeft2) {
        // Case 3 RR: rotate grandparent left
        steps.push(rbBase('case3-rr',
          `Case 3 (RR): parent และ current เป็น right child → recolor parent=BLACK, grandparent=RED  แล้ว rotate left ที่ grandparent`,
          [25, 26, 27, 28], root,
          { [currentId]: 'current', [parent2.id]: 'target', [gp2.id]: 'found' },
          null,
          undefined,
          'Case 3: RR rotate'));
        parent2.color = 'BLACK';
        gp2.color = 'RED';
        root = rbRotateLeft(root, gp2, parentMap);
      }
      steps.push(rbBase('case3-after',
        `หลัง Case 3 — violation ถูกแก้แล้ว หยุด fixup`,
        [], root, {}, null,
        `tree is balanced`,
        'after Case 3'));
      break;
    }
  }

  // Step 3: Ensure root is BLACK
  if (root && root.color === 'RED') {
    steps.push(rbBase('root-recolor',
      `หลัง fixup — root เป็น RED → recolor root เป็น BLACK (กฎข้อ 2)`,
      [29, 30], root, { [root.id]: 'found' }, null,
      `root = BLACK`,
      'root recolor'));
    root.color = 'BLACK';
  }

  steps.push(rbBase('done',
    `insert(${value}) เสร็จสิ้น — Red-Black tree ยังคงถูกต้องตาม 5 กฎ`,
    [], root, {}, null,
    `Tree is valid RB tree`,
    'เสร็จสิ้น'));

  return steps;
}

// Silent insert (for building initial tree)
function rbBuildTree(values) {
  let root = null;
  for (const v of values) {
    // Run insert with steps discarded
    const steps = rbInsertSteps(root, v);
    // Re-serialize final state
    const serialized = rbSerialize(root);
    // Apply final state by running through steps and taking last
    // (inefficient but works for small initial trees)
    // Actually we need to apply the actual transformations - let's use a silent insert
    root = rbSilentInsert(root, v);
  }
  return root;
}

function rbSilentInsert(root, value) {
  // BST insert
  let newNode = { id: rbId(), value, color: 'RED', left: null, right: null };
  if (!root) {
    newNode.color = 'BLACK';
    return newNode;
  }
  function bst(node, value) {
    if (!node) return newNode;
    if (value < node.value) node.left = bst(node.left, value);
    else if (value > node.value) node.right = bst(node.right, value);
    else return node;
    return node;
  }
  root = bst(root, value);

  // Build parent map
  const parentMap = {};
  rbBuildParentMap(root, parentMap, null);

  // Fixup
  let currentId = newNode.id;
  function getParent(id) { return parentMap[id] ? rbFindNode(root, parentMap[id]) : null; }
  function getGrandparent(id) { const p = getParent(id); return p ? getParent(p.id) : null; }
  function getUncle(id) {
    const gp = getGrandparent(id); if (!gp) return null;
    const p = getParent(id);
    return gp.left === p ? gp.right : gp.left;
  }

  while (currentId && parentMap[currentId]) {
    const parent = getParent(currentId);
    const gp = getGrandparent(currentId);
    const uncle = getUncle(currentId);
    if (!parent || !gp) break;
    if (parent.color === 'BLACK') break;

    if (uncle && uncle.color === 'RED') {
      parent.color = 'BLACK';
      uncle.color = 'BLACK';
      gp.color = 'RED';
      currentId = gp.id;
    } else {
      const parentIsLeft = (gp.left === parent);
      const currentIsLeft = (parent.left && parent.left.id === currentId);
      if (parentIsLeft && !currentIsLeft) {
        root = rbRotateLeft(root, parent, parentMap);
        currentId = parent.id;
      } else if (!parentIsLeft && currentIsLeft) {
        root = rbRotateRight(root, parent, parentMap);
        currentId = parent.id;
      }
      const p2 = getParent(currentId);
      const gp2 = getGrandparent(currentId);
      if (!p2 || !gp2) break;
      const pIsLeft2 = (gp2.left === p2);
      const cIsLeft2 = (p2.left && p2.left.id === currentId);
      p2.color = 'BLACK';
      gp2.color = 'RED';
      if (pIsLeft2 && cIsLeft2) root = rbRotateRight(root, gp2, parentMap);
      else if (!pIsLeft2 && !cIsLeft2) root = rbRotateLeft(root, gp2, parentMap);
      break;
    }
  }
  if (root && root.color === 'RED') root.color = 'BLACK';
  return root;
}

// Render: tree with RED/BLACK coloring
function rbRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes;
  const edges = step.edges;
  const roles = step.roles;
  const N = nodes.length;

  if (vizMeta) {
    const redCount = nodes.filter((n) => n.color === 'RED').length;
    vizMeta.textContent = `${N} nodes · ${redCount} RED · ${N - redCount} BLACK`;
  }

  if (N === 0) {
    vizArea.appendChild(window.DS.el('div', {
      style: 'color:var(--text-muted);font-family:monospace;padding:40px;text-align:center',
    }, 'Red-Black tree ว่าง — กด Insert เพื่อเริ่ม'));
    return;
  }

  // Build adjacency
  const children = {};
  nodes.forEach((n) => { children[n.id] = []; });
  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });
  const parentOf = {};
  edges.forEach(([p, c]) => { children[p].push(c); parentOf[c] = p; });
  const rootId = nodes.find((n) => !parentOf[n.id]).id;

  // Layout
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

  // Edges
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

  // Nodes
  nodes.forEach((node) => {
    const pos = positions[node.id];
    const role = roles[node.id] || '';

    // Base color from RB color
    let fill = node.color === 'RED' ? '#ef4444' : '#1a1f29';
    let stroke = node.color === 'RED' ? '#ef4444' : '#5e6677';
    let textColor = node.color === 'RED' ? 'white' : '#e6e9ef';

    // Override with role
    if (role === 'current') { fill = 'var(--amber)'; stroke = 'var(--amber)'; textColor = 'white'; }
    else if (role === 'new') { stroke = '#14b8a6'; }
    else if (role === 'found') { stroke = 'var(--emerald)'; stroke = 'var(--emerald)'; }
    else if (role === 'target') { stroke = 'var(--pink)'; stroke = 'var(--pink)'; }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.px));
    circle.setAttribute('cy', String(pos.py));
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', role ? '4' : '2');
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

    // Color label below
    const colorLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    colorLabel.setAttribute('x', String(pos.px));
    colorLabel.setAttribute('y', String(pos.py + 34));
    colorLabel.setAttribute('text-anchor', 'middle');
    colorLabel.setAttribute('font-size', '9');
    colorLabel.setAttribute('font-family', 'monospace');
    colorLabel.setAttribute('fill', node.color === 'RED' ? '#ef4444' : 'var(--text-muted)');
    colorLabel.textContent = node.color;
    svg.appendChild(colorLabel);
  });

  vizArea.appendChild(svg);
}

window.RB_TREE = {
  insert: rbInsertSteps,
  render: rbRender,
  buildTree: rbBuildTree,
  makeInitial: (values) => rbBuildTree(values),
};
