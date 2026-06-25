// ============ Stack — Array Implementation ============
// Visual: vertical stack of array cells, top index points at top cell.

let saIdCounter = 0;
function saId() {
  saIdCounter += 1;
  return `sa${saIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function saBase(operation, arr, top, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { top, ...pointers },
    consoleOutput, phase,
  };
}

function saPush(arr, top, value) {
  const steps = [];
  const newId = saId();
  const newNode = { id: newId, value };

  steps.push(saBase('push', arr, top,
    `เริ่ม push(${value}) — ตรวจ overflow`, [1],
    top >= 0 ? { [arr[top].id]: 'top' } : {},
    { temp: null }));

  if (top >= 99) {
    steps.push(saBase('push', arr, top,
      `top >= MAX-1 → Stack Overflow!`, [1, 2],
      { [arr[top].id]: 'overflow' },
      {}, `Stack Overflow — push ล้มเหลว`, 'Overflow'));
    return steps;
  }

  steps.push(saBase('push', arr, top,
    `ไม่ overflow → top++ (จาก ${top} เป็น ${top + 1})`, [],
    top >= 0 ? { [arr[top].id]: 'top' } : {},
    {}, undefined, 'เพิ่ม top'));

  const newArr = [...arr, newNode];
  const newTop = top + 1;
  steps.push(saBase('push', newArr, newTop,
    `arr[top] = ${value}`, [4],
    { [newId]: 'new' },
    { temp: null }, undefined, 'เขียนค่า'));

  steps.push(saBase('push', newArr, newTop,
    `push(${value}) สำเร็จ  สแต็กมี ${newArr.length} สมาชิก`, [],
    { [newId]: 'top' }, {},
    `push(${value}) → สแต็กมี ${newArr.length} สมาชิก`, 'เสร็จสิ้น'));

  return steps;
}

function saPop(arr, top) {
  const steps = [];

  steps.push(saBase('pop', arr, top,
    `เริ่ม pop() — ตรวจ underflow`, [1],
    top >= 0 ? { [arr[top].id]: 'top' } : {},
    { temp: null }));

  if (top < 0) {
    steps.push(saBase('pop', arr, top,
      `top < 0 → Stack Underflow!`, [1, 2],
      {}, { temp: null }, `Stack Underflow — pop ล้มเหลว`, 'Underflow'));
    return steps;
  }

  const target = arr[top];
  steps.push(saBase('pop', arr, top,
    `val = arr[top] = ${target.value}`, [],
    { [target.id]: 'peeked' },
    { temp: top }, undefined, 'อ่านค่า'));

  steps.push(saBase('pop', arr, top,
    `top-- (จาก ${top} เป็น ${top - 1})`, [4],
    { [target.id]: 'removing' },
    { temp: top }, undefined, 'ลด top'));

  const newArr = arr.slice(0, -1);
  steps.push(saBase('pop', newArr, top - 1,
    `return val (${target.value})`, [],
    newArr.length > 0 ? { [newArr[newArr.length - 1].id]: 'top' } : {},
    {}, `pop() → คืนค่า ${target.value} (เหลือ ${newArr.length} สมาชิก)`, 'เสร็จสิ้น'));

  return steps;
}

function saPeek(arr, top) {
  const steps = [];

  steps.push(saBase('peek', arr, top,
    `เริ่ม peek() — ตรวจ underflow`, [1],
    top >= 0 ? { [arr[top].id]: 'top' } : {},
    { temp: null }));

  if (top < 0) {
    steps.push(saBase('peek', arr, top,
      `top < 0 → Stack Underflow!`, [1, 2],
      {}, {}, `Stack Underflow — สแต็กว่าง`, 'Underflow'));
    return steps;
  }

  const target = arr[top];
  steps.push(saBase('peek', arr, top,
    `คืน arr[top] = ${target.value}  (ไม่ได้ลบ แค่อ่านค่าบนสุด)`, [4],
    { [target.id]: 'peeked' },
    {}, `peek() → ${target.value}`, 'เสร็จสิ้น'));

  return steps;
}

// Render: vertical stack, top at top
function saRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const arr = step.nodes;
  const top = step.pointers.top;
  const roles = step.roles;

  if (vizMeta) {
    vizMeta.textContent = `top = ${top} · ${arr.length} element${arr.length !== 1 ? 's' : ''}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px' });

  // top pointer indicator (always at top)
  const topLane = window.DS.el('div', { style: 'display:flex;align-items:center;gap:8px;min-height:30px' });
  if (top >= 0) {
    topLane.appendChild(window.DS.makePointerChip('top', 'top'));
    topLane.appendChild(window.DS.el('div', { class: 'pointer-stem', style: 'height:12px' }));
    topLane.appendChild(window.DS.el('div', { class: 'pointer-arrow', style: 'color:var(--amber)' }));
  } else {
    topLane.appendChild(window.DS.makePointerChip('top = -1 (empty)', 'top'));
  }
  wrap.appendChild(topLane);

  // Stack cells: top first (reverse)
  if (arr.length === 0) {
    const empty = window.DS.el('div', {
      class: 'node', style: 'border-style:dashed;opacity:0.5;min-width:160px',
    });
    empty.appendChild(window.DS.el('div', { class: 'node-cell-data', style: 'color:var(--text-muted)' }, 'สแต็กว่าง'));
    wrap.appendChild(empty);
  } else {
    const stackBox = window.DS.el('div', { style: 'display:flex;flex-direction:column-reverse;gap:6px' });
    arr.forEach((node, idx) => {
      const role = roles[node.id] || '';
      const cell = window.DS.makeNodeBox({
        value: node.value,
        role,
        idxLabel: idx,
        metaContent: idx === 0 ? 'BASE' : '',
      });
      cell.style.minWidth = '160px';
      stackBox.appendChild(cell);
    });
    wrap.appendChild(stackBox);
  }

  // Bottom label
  wrap.appendChild(window.DS.el('div', {
    class: 'mono',
    style: 'font-size:10px;color:var(--text-muted)',
  }, '↑ เข้า/ออกที่นี่ (top)  ·  BASE (index 0) อยู่ล่างสุด'));

  vizArea.appendChild(wrap);
}

window.STACK_ARRAY = {
  push: saPush,
  pop: saPop,
  peek: saPeek,
  render: saRender,
  makeInitial: (values) => values.map((v) => ({ id: saId(), value: v })),
};

// ============ Stack — Pointer Implementation ============
// Visual: vertical stack of node boxes [data | next] where next points DOWN.

let spIdCounter = 0;
function spId() {
  spIdCounter += 1;
  return `sp${spIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function spBase(operation, arr, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { top: arr.length - 1, ...pointers }, // top index for visual (top of stack)
    consoleOutput, phase,
  };
}

function spPush(arr, value) {
  const steps = [];
  const newId = spId();
  const newNode = { id: newId, value };

  steps.push(spBase('push', arr,
    `เริ่ม push(${value})`, [1],
    arr.length > 0 ? { [arr[arr.length - 1].id]: 'top' } : {},
    { topId: arr.length > 0 ? arr[arr.length - 1].id : null }));

  steps.push(spBase('push', arr,
    `Node* newNode = new Node(${value})`, [1],
    { [newId]: 'new' },
    { topId: arr.length > 0 ? arr[arr.length - 1].id : null, newId }, undefined, 'สร้าง Node'));

  steps.push(spBase('push', arr,
    `newNode->next = top — ชี้ next ของ newNode ไปยัง top เดิม`, [2],
    {
      [newId]: 'new',
      ...(arr.length > 0 ? { [arr[arr.length - 1].id]: 'target' } : {}),
    },
    { topId: arr.length > 0 ? arr[arr.length - 1].id : null, newId }, undefined, 'โยง next'));

  const newArr = [newNode, ...arr];
  steps.push(spBase('push', newArr,
    `top = newNode — ย้าย top มาชี้ newNode`, [3],
    { [newId]: 'found' },
    { topId: newId },
    `push(${value}) → สำเร็จ  สแต็กมี ${newArr.length} สมาชิก`, 'เสร็จสิ้น'));

  return steps;
}

function spPop(arr) {
  const steps = [];

  steps.push(spBase('pop', arr,
    `เริ่ม pop() — ตรวจ underflow (top == nullptr?)`, [1],
    arr.length > 0 ? { [arr[0].id]: 'top' } : {},
    { topId: arr.length > 0 ? arr[0].id : null }));

  if (arr.length === 0) {
    steps.push(spBase('pop', arr,
      `top == nullptr → Stack Underflow!`, [1, 2, 3],
      {}, { topId: null }, `Stack Underflow — pop ล้มเหลว`, 'Underflow'));
    return steps;
  }

  const target = arr[0];
  steps.push(spBase('pop', arr,
    `temp = top; val = temp->data = ${target.value}`, [4, 5],
    { [target.id]: 'peeked' },
    { topId: target.id, tempId: target.id }, undefined, 'อ่านค่า'));

  steps.push(spBase('pop', arr,
    `top = top->next — ย้าย top ไป Node ถัดไป`, [6],
    { [target.id]: 'removing' },
    { topId: arr[1]?.id || null, tempId: target.id }, undefined, 'ย้าย top'));

  const newArr = arr.slice(1);
  steps.push(spBase('pop', newArr,
    `delete temp — ลบ ${target.value} สำเร็จ`, [7, 8],
    newArr.length > 0 ? { [newArr[0].id]: 'top' } : {},
    { topId: newArr[0]?.id || null },
    `pop() → คืนค่า ${target.value} (เหลือ ${newArr.length} สมาชิก)`, 'เสร็จสิ้น'));

  return steps;
}

function spPeek(arr) {
  const steps = [];

  steps.push(spBase('peek', arr,
    `เริ่ม peek() — ตรวจ empty`, [1],
    arr.length > 0 ? { [arr[0].id]: 'top' } : {},
    { topId: arr.length > 0 ? arr[0].id : null }));

  if (arr.length === 0) {
    steps.push(spBase('peek', arr,
      `top == nullptr → Stack is empty`, [1, 2, 3],
      {}, { topId: null }, `Stack Underflow — สแต็กว่าง`, 'Underflow'));
    return steps;
  }

  const target = arr[0];
  steps.push(spBase('peek', arr,
    `คืน top->data = ${target.value}  (ไม่ได้ลบ แค่อ่านค่าบนสุด)`, [4],
    { [target.id]: 'peeked' },
    { topId: target.id }, `peek() → ${target.value}`, 'เสร็จสิ้น'));

  return steps;
}

function spRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const arr = step.nodes; // arr[0] = top, arr[last] = bottom
  const roles = step.roles;
  const pointers = step.pointers;

  if (vizMeta) {
    vizMeta.textContent = `top ${pointers.topId ? '≠ nullptr' : '= nullptr'} · ${arr.length} element${arr.length !== 1 ? 's' : ''}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px' });

  // top pointer indicator
  const topLane = window.DS.el('div', { style: 'display:flex;align-items:center;gap:8px;min-height:30px' });
  if (pointers.topId) {
    topLane.appendChild(window.DS.makePointerChip('top', 'top'));
    topLane.appendChild(window.DS.el('div', { class: 'pointer-stem', style: 'height:12px' }));
    topLane.appendChild(window.DS.el('div', { class: 'pointer-arrow', style: 'color:var(--amber)' }));
  } else {
    topLane.appendChild(window.DS.makePointerChip('top = nullptr', 'top'));
  }
  wrap.appendChild(topLane);

  if (arr.length === 0) {
    const empty = window.DS.el('div', {
      class: 'node', style: 'border-style:dashed;opacity:0.5;min-width:160px',
    });
    empty.appendChild(window.DS.el('div', { class: 'node-cell-data', style: 'color:var(--text-muted)' }, 'สแต็กว่าง'));
    wrap.appendChild(empty);
  } else {
    const stackBox = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px' });
    arr.forEach((node, idx) => {
      const role = roles[node.id] || '';

      // Pointer chips above (only for top, temp, peeked, etc.)
      const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });

      const chips = window.DS.el('div', { class: 'pointer-chips-row', style: 'min-height:18px' });
      if (pointers.tempId === node.id && role !== 'removing') chips.appendChild(window.DS.makePointerChip('temp', 'temp'));
      if (role === 'peeked') chips.appendChild(window.DS.makePointerChip('peek', 'peek'));
      if (role === 'new') chips.appendChild(window.DS.makePointerChip('new', 'new'));
      if (role === 'removing') chips.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
      cellWrap.appendChild(chips);

      // Node box [data | next]  — for pointer stack, next points DOWN (to previous top)
      const isLast = idx === arr.length - 1; // bottom of stack
      const metaContent = isLast
        ? '<span style="color:var(--pink)">nullptr</span>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
      const box = window.DS.makeNodeBox({
        value: node.value, role,
        idxLabel: idx,
        metaContent,
      });
      box.style.minWidth = '160px';
      cellWrap.appendChild(box);

      // Label below
      cellWrap.appendChild(window.DS.el('div', {
        class: 'mono', style: 'font-size:10px;color:var(--text-muted);min-height:14px',
      }, idx === 0 ? '↑ บนสุด (top)' : (isLast ? 'BASE (bottom)' : '')));

      stackBox.appendChild(cellWrap);
    });
    wrap.appendChild(stackBox);
  }

  wrap.appendChild(window.DS.el('div', {
    class: 'mono', style: 'font-size:10px;color:var(--text-muted)',
  }, '↑ เข้า/ออกที่นี่ (top)'));

  vizArea.appendChild(wrap);
}

window.STACK_POINTER = {
  push: spPush,
  pop: spPop,
  peek: spPeek,
  render: spRender,
  makeInitial: (values) => values.map((v) => ({ id: spId(), value: v })).reverse(), // store reversed so arr[0] is top
};
