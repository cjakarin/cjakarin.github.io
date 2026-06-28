// ============ Red-Black Tree (Self-Balancing BST) ============
//
// BST ที่ balance เองด้วยกฎ 5 ข้อ:
//   1. ทุก node มีสี RED หรือ BLACK
//   2. Root เป็น BLACK เสมอ
//   3. ทุก leaf (NIL) เป็น BLACK
//   4. RED node ต้องมีลูก BLACK เท่านั้น (ห้าม RED–RED ติดกัน)
//   5. ทุก path จาก node ไป leaf มีจำนวน BLACK node เท่ากัน (black-height)
// Insert: เพิ่มเป็น RED ก่อน แล้ว fixInsert ด้วย Case 1-3 (+ mirror)
// Time: insert/search/delete = O(log n)

let rbIdCounter = 0;
function rbId() {
  rbIdCounter += 1;
  return `rb${rbIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

const RB_RED = 'RED';
const RB_BLACK = 'BLACK';

function rbNode(value, color = RB_RED) {
  return { id: rbId(), value, color, left: null, right: null, parent: null };
}

// ===== Rotations (with parent tracking) =====
function rbRotateLeft(root, x) {
  const y = x.right;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.left) x.parent.left = y;
  else x.parent.right = y;
  y.left = x;
  x.parent = y;
  return root;
}
function rbRotateRight(root, x) {
  const y = x.left;
  x.left = y.right;
  if (y.right) y.right.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.right) x.parent.right = y;
  else x.parent.left = y;
  y.right = x;
  x.parent = y;
  return root;
}

// ===== Serialize tree → flat nodes/edges for renderer =====
function rbSerialize(root) {
  const nodes = [];
  const edges = [];
  function walk(node, parent) {
    if (!node) return;
    nodes.push({ id: node.id, value: node.value, color: node.color });
    if (parent) edges.push({ from: parent.id, to: node.id, side: parent.left === node ? 'left' : 'right' });
    walk(node.left, node);
    walk(node.right, node);
  }
  walk(root, null);
  return { nodes, edges };
}

function rbStep(operation, description, codeLines, root, roles = {}, consoleOutput, phase, highlight = {}) {
  const { nodes, edges } = rbSerialize(root);
  return {
    operation, description, codeLines,
    nodes, edges,
    roles: { ...roles },
    consoleOutput, phase,
    highlight: { ...highlight },
  };
}

// ===== Insert with step recording =====
function rbInsert(root, value) {
  const steps = [];

  // Step 1: BST insert (new node = RED)
  const z = rbNode(value, RB_RED);

  steps.push(rbStep('insert',
    `เริ่ม insert(${value})${root ? '' : ' — tree ว่าง จะสร้าง root ใหม่'}`,
    [24], root, {}, undefined, 'เริ่มต้น'));

  // BST insert (without balancing)
  let parent = null;
  let cur = root;
  while (cur) {
    parent = cur;
    steps.push(rbStep('insert',
      `BST insert: เปรียบเทียบ ${value} กับ ${cur.value}`,
      [24], root, { [cur.id]: 'current' }, undefined, `visit ${cur.value}`));
    if (value < cur.value) cur = cur.left;
    else if (value > cur.value) cur = cur.right;
    else {
      steps.push(rbStep('insert',
        `${value} == ${cur.value} → ไม่ insert (duplicate)`,
        [25], root, { [cur.id]: 'found' },
        `insert(${value}) → มีอยู่แล้ว (skip)`, 'duplicate'));
      return { steps, root };
    }
  }

  z.parent = parent;
  if (!parent) {
    root = z;
  } else if (value < parent.value) {
    parent.left = z;
  } else {
    parent.right = z;
  }

  steps.push(rbStep('insert',
    `แทรก Node ${value} เป็น RED ที่${parent ? ` ${value < parent.value ? 'left' : 'right'} ของ ${parent.value}` : ' root'}  (RED เพราะจะไม่กระทบ black-height)`,
    [25, 26], root, { [z.id]: 'new' },
    `+ insert ${value} (RED)`, 'BST insert'));

  // Step 2: fixInsert — fix RED–RED violations
  let zPtr = z;
  function isRed(n) { return n && n.color === RB_RED; }

  let iter = 0;
  while (zPtr.parent && isRed(zPtr.parent)) {
    iter++;
    const parent_ = zPtr.parent;
    const gp = parent_.parent;
    if (!gp) break; // shouldn't happen since root is BLACK

    const parentIsLeft = (parent_ === gp.left);
    const uncle = parentIsLeft ? gp.right : gp.left;

    steps.push(rbStep('insert',
      `fixInsert iter ${iter}: z=${zPtr.value} (RED)  parent=${parent_.value} (RED — ผิดกฎ!)  gp=${gp.value}${uncle ? `  uncle=${uncle.value} (${uncle.color})` : '  uncle=NIL (BLACK)'}`,
      [25, 26], root, { [zPtr.id]: 'current', [parent_.id]: 'target', [gp.id]: 'prev' },
      undefined, `fixInsert iter ${iter}`));

    if (isRed(uncle)) {
      // Case 1: uncle RED → recolor parent, uncle=BLACK, gp=RED, z=gp
      steps.push(rbStep('insert',
        `Case 1: uncle ${uncle ? uncle.value : 'NIL'} = RED → recolor: parent→BLACK, uncle→BLACK, gp→RED  แล้วเลื่อน z ขึ้นไปที่ gp`,
        [29], root, { [zPtr.id]: 'current', [parent_.id]: 'target', [gp.id]: 'prev', [uncle.id]: 'current' },
        undefined, 'Case 1: recolor'));
      parent_.color = RB_BLACK;
      uncle.color = RB_BLACK;
      gp.color = RB_RED;
      steps.push(rbStep('insert',
        `หลัง recolor: ${parent_.value}→BLACK, ${uncle.value}→BLACK, ${gp.value}→RED  เลื่อน z ขึ้นไปที่ ${gp.value}`,
        [29], root, { [gp.id]: 'current', [parent_.id]: 'target', [uncle.id]: 'target' },
        undefined, 'หลัง recolor'));
      zPtr = gp;
    } else {
      // Uncle is BLACK (or NIL) → Case 2 or Case 3
      if (parentIsLeft) {
        if (zPtr === parent_.right) {
          // Case 2 (left parent, right child): rotateLeft(parent) → now z = parent (becomes left child)
          steps.push(rbStep('insert',
            `Case 2 (L-R): z=${zPtr.value} เป็น right child ของ parent ${parent_.value} → rotateLeft(${parent_.value}) เพื่อทำให้เป็น Case 3`,
            [31], root, { [zPtr.id]: 'current', [parent_.id]: 'target', [gp.id]: 'prev' },
            undefined, 'Case 2: rotateLeft'));
          zPtr = parent_;
          root = rbRotateLeft(root, zPtr);
        }
        // Case 3 (left-left): recolor parent=BLACK, gp=RED, rotateRight(gp)
        steps.push(rbStep('insert',
          `Case 3 (L-L): recolor parent ${zPtr.parent.value}→BLACK, gp ${gp.value}→RED  แล้ว rotateRight(${gp.value})`,
          [32], root, { [zPtr.id]: 'current', [zPtr.parent.id]: 'target', [gp.id]: 'prev' },
          undefined, 'Case 3: recolor + rotateRight'));
        zPtr.parent.color = RB_BLACK;
        gp.color = RB_RED;
        root = rbRotateRight(root, gp);
        steps.push(rbStep('insert',
          `หลัง Case 3: ต้นไม้ balance แล้ว  หยุด fixInsert (ไม่มี RED–RED)`,
          [], root, { [zPtr.parent.id]: 'found' },
          undefined, 'หลัง Case 3'));
      } else {
        // Mirror: parent is right child of gp
        if (zPtr === parent_.left) {
          // Case 2 mirror (R-L): rotateRight(parent)
          steps.push(rbStep('insert',
            `Case 2 (R-L): z=${zPtr.value} เป็น left child ของ parent ${parent_.value} → rotateRight(${parent_.value}) เพื่อทำให้เป็น Case 3`,
            [38], root, { [zPtr.id]: 'current', [parent_.id]: 'target', [gp.id]: 'prev' },
            undefined, 'Case 2 mirror: rotateRight'));
          zPtr = parent_;
          root = rbRotateRight(root, zPtr);
        }
        // Case 3 mirror (R-R): recolor parent=BLACK, gp=RED, rotateLeft(gp)
        steps.push(rbStep('insert',
          `Case 3 (R-R): recolor parent ${zPtr.parent.value}→BLACK, gp ${gp.value}→RED  แล้ว rotateLeft(${gp.value})`,
          [39], root, { [zPtr.id]: 'current', [zPtr.parent.id]: 'target', [gp.id]: 'prev' },
          undefined, 'Case 3 mirror: recolor + rotateLeft'));
        zPtr.parent.color = RB_BLACK;
        gp.color = RB_RED;
        root = rbRotateLeft(root, gp);
        steps.push(rbStep('insert',
          `หลัง Case 3 mirror: ต้นไม้ balance แล้ว  หยุด fixInsert (ไม่มี RED–RED)`,
          [], root, { [zPtr.parent.id]: 'found' },
          undefined, 'หลัง Case 3'));
      }
      break; // Case 3 always fixes the violation
    }
  }

  // Step 3: ensure root is BLACK
  if (root.color !== RB_BLACK) {
    steps.push(rbStep('insert',
      `หลัง fixInsert: ทำให้แน่ใจว่า root ${root.value} เป็น BLACK (กฎข้อ 2)`,
      [43], root, { [root.id]: 'current' },
      undefined, 'root → BLACK'));
  }
  root.color = RB_BLACK;

  // Final step
  steps.push(rbStep('insert',
    `insert(${value}) เสร็จสิ้น — Red-Black tree ผ่านกฎ 5 ข้อแล้ว (height ∈ O(log n))`,
    [], root, {},
    `insert(${value}) → สำเร็จ`, 'เสร็จสิ้น'));

  return { steps, root };
}

// ===== Rebuild tree from a list of values (silent — no step recording) =====
function rbMakeInitial(values) {
  let root = null;
  for (const v of values) {
    root = rbInsertSilent(root, v);
  }
  return root;
}
function rbInsertSilent(root, value) {
  const z = rbNode(value, RB_RED);
  let parent = null;
  let cur = root;
  while (cur) {
    parent = cur;
    if (value < cur.value) cur = cur.left;
    else if (value > cur.value) cur = cur.right;
    else return root;
  }
  z.parent = parent;
  if (!parent) root = z;
  else if (value < parent.value) parent.left = z;
  else parent.right = z;

  let zPtr = z;
  function isRed(n) { return n && n.color === RB_RED; }
  while (zPtr.parent && isRed(zPtr.parent)) {
    const parent_ = zPtr.parent;
    const gp = parent_.parent;
    if (!gp) break;
    const parentIsLeft = (parent_ === gp.left);
    const uncle = parentIsLeft ? gp.right : gp.left;
    if (isRed(uncle)) {
      parent_.color = RB_BLACK;
      uncle.color = RB_BLACK;
      gp.color = RB_RED;
      zPtr = gp;
    } else {
      if (parentIsLeft) {
        if (zPtr === parent_.right) {
          zPtr = parent_;
          root = rbRotateLeft(root, zPtr);
        }
        zPtr.parent.color = RB_BLACK;
        gp.color = RB_RED;
        root = rbRotateRight(root, gp);
      } else {
        if (zPtr === parent_.left) {
          zPtr = parent_;
          root = rbRotateRight(root, zPtr);
        }
        zPtr.parent.color = RB_BLACK;
        gp.color = RB_RED;
        root = rbRotateLeft(root, gp);
      }
      break;
    }
  }
  root.color = RB_BLACK;
  return root;
}

// ===== Renderer =====
function rbRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const nodes = step.nodes || [];
  const edges = step.edges || [];
  const roles = step.roles || {};

  if (vizMeta) {
    const blackCount = nodes.filter((n) => n.color === RB_BLACK).length;
    vizMeta.textContent = `${nodes.length} node${nodes.length !== 1 ? 's' : ''} · ${blackCount} BLACK / ${nodes.length - blackCount} RED`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:20px;padding:16px;align-items:center' });

  if (nodes.length === 0) {
    wrap.appendChild(window.DS.el('div', {
      style: 'color:var(--text-muted);font-family:monospace;font-size:13px;padding:40px',
    }, 'Tree ว่าง — กด Insert เพื่อเพิ่ม node แรก'));
    vizArea.appendChild(wrap);
    return;
  }

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
    const isRed = n.color === RB_RED;

    // RB color: RED = red bg, BLACK = dark bg
    let fill = isRed ? '#ef4444' : '#1a1f29';
    let stroke = isRed ? '#ef4444' : 'var(--text-dim)';
    let textColor = isRed ? 'white' : 'var(--text)';

    // Role override (highlight ring only)
    let strokeWidth = '2';
    let ringStroke = null;
    if (role === 'current') { ringStroke = 'var(--amber)'; strokeWidth = '3'; }
    else if (role === 'new') { ringStroke = 'var(--teal)'; strokeWidth = '3'; }
    else if (role === 'target') { ringStroke = 'var(--pink)'; strokeWidth = '3'; }
    else if (role === 'found') { ringStroke = 'var(--emerald)'; strokeWidth = '3'; }
    else if (role === 'prev') { ringStroke = 'var(--purple)'; strokeWidth = '3'; }

    // Pointer chip above
    if (role) {
      const chipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      chipBg.setAttribute('x', String(pos.x - 22));
      chipBg.setAttribute('y', String(pos.y - 40));
      chipBg.setAttribute('width', '44');
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

    // Optional outer ring (highlight)
    if (ringStroke) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', String(pos.x));
      ring.setAttribute('cy', String(pos.y));
      ring.setAttribute('r', '23');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', ringStroke);
      ring.setAttribute('stroke-width', '2');
      ring.setAttribute('opacity', '0.6');
      svg.appendChild(ring);
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', strokeWidth);
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

    // Color label below
    const cLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    cLabel.setAttribute('x', String(pos.x));
    cLabel.setAttribute('y', String(pos.y + 34));
    cLabel.setAttribute('text-anchor', 'middle');
    cLabel.setAttribute('font-size', '9');
    cLabel.setAttribute('font-family', 'monospace');
    cLabel.setAttribute('fill', isRed ? '#ef4444' : 'var(--text-muted)');
    cLabel.textContent = isRed ? 'RED' : 'BLK';
    svg.appendChild(cLabel);
  });

  wrap.appendChild(svg);
  vizArea.appendChild(wrap);
}

window.RB_TREE = {
  insert: rbInsert,
  render: rbRender,
  makeInitial: rbMakeInitial,
  serialize: rbSerialize,
};
