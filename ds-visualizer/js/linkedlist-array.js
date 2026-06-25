// ============ Linked List — Array Implementation ============
//
// Visual model: a horizontal array of cells [idx|value], with `size` pointer.
// insertHead: shift all elements right, then place value at index 0
// insertTail: place at arr[size], size++
// insertAt: shift right from pos onwards, place at pos
// deleteAt: shift left from pos+1, size--
// search: linear scan
// traverse: print each

const LL_ARRAY_OPS = {
  insertHead: 'insertHead',
  insertTail: 'insertTail',
  insertAt: 'insertAt',
  deleteAt: 'deleteAt',
  search: 'search',
  traverse: 'traverse',
};

let llArrIdCounter = 0;
function llArrId() {
  llArrIdCounter += 1;
  return `la${llArrIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function llArrBaseStep(operation, arr, size, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation,
    description,
    codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { size, ...pointers },
    consoleOutput,
    phase,
  };
}

function llArrInsertHead(arr, size, value) {
  const steps = [];
  const newId = llArrId();
  const newNode = { id: newId, value };

  steps.push(llArrBaseStep('insertHead', arr, size,
    `เริ่ม insertAtHead(${value}) — ตรวจ size < MAX`, [1], {},
    { current: null }));

  if (size >= 100) {
    steps.push(llArrBaseStep('insertHead', arr, size,
      `size >= MAX → array เต็ม ไม่สามารถ insert ได้`, [1], {},
      {}, `Array Full — insert ล้มเหลว`, 'Overflow'));
    return steps;
  }

  // Show shifting right
  for (let i = size - 1; i >= 0; i--) {
    const shiftedArr = arr.slice(0, i)
      .concat([{ ...arr[i], _shifting: true }])
      .concat(arr.slice(i + 1));
    // For display, we move arr[i] to position i+1
    const displayArr = arr.slice(0, i)
      .concat(arr.slice(i, i + 1))  // original at i
      .concat(arr.slice(i + 1));
    // Show "shift" by marking arr[i] as moving to i+1
    const visualArr = arr.slice();
    // We'll create a transient state where the element at i is highlighted as 'target'
    // and the next position (i+1) shows where it'll go.
    const targetId = arr[i].id;
    steps.push(llArrBaseStep('insertHead', arr, size,
      `เลื่อน arr[${i}] (=${arr[i].value}) ไปยัง arr[${i + 1}]`, [2, 3],
      { [targetId]: 'current' }, { current: i }));
  }

  // After all shifts, place value at 0
  // Build new array: [newNode, ...originalArr]
  const newArr = [newNode, ...arr];
  const newSize = size + 1;
  steps.push(llArrBaseStep('insertHead', newArr, newSize,
    `กำหนด arr[0] = ${value}  แล้ว size++ (จาก ${size} เป็น ${newSize})`, [4, 5],
    { [newId]: 'new' }, { current: 0 },
    `insertAtHead(${value}) → สำเร็จ  ขนาด = ${newSize}`, 'เสร็จสิ้น'));

  return steps;
}

function llArrInsertTail(arr, size, value) {
  const steps = [];
  const newId = llArrId();
  const newNode = { id: newId, value };

  steps.push(llArrBaseStep('insertTail', arr, size,
    `เริ่ม insertAtTail(${value}) — ตรวจ size < MAX`, [1], {}, { current: null }));

  if (size >= 100) {
    steps.push(llArrBaseStep('insertTail', arr, size,
      `size >= MAX → array เต็ม`, [1], {}, {}, `Array Full — insert ล้มเหลว`, 'Overflow'));
    return steps;
  }

  steps.push(llArrBaseStep('insertTail', arr, size,
    `ไม่เต็ม → กำหนด arr[size] = arr[${size}] = ${value}`, [2],
    {}, { current: size }));

  const newArr = [...arr, newNode];
  const newSize = size + 1;
  steps.push(llArrBaseStep('insertTail', newArr, newSize,
    `size++ (จาก ${size} เป็น ${newSize}) — insert สำเร็จ`, [3],
    { [newId]: 'new' }, { current: size },
    `insertAtTail(${value}) → สำเร็จ  ขนาด = ${newSize}`, 'เสร็จสิ้น'));

  return steps;
}

function llArrInsertAt(arr, size, value, pos) {
  const steps = [];
  const newId = llArrId();
  const newNode = { id: newId, value };

  steps.push(llArrBaseStep('insertAt', arr, size,
    `เริ่ม insertAt(${value}, ${pos}) — ตรวจขอบเขต`, [1], {}, { current: null }));

  if (size >= 100 || pos < 0 || pos > size) {
    steps.push(llArrBaseStep('insertAt', arr, size,
      `ขอบเขตไม่ถูกต้อง (size=${size}, pos=${pos}) → ยกเลิก`, [1], {}, {},
      `Insert ล้มเหลว — pos ไม่ถูกต้อง`, 'Out of bounds'));
    return steps;
  }

  // Shift elements right from pos onwards
  for (let i = size - 1; i >= pos; i--) {
    steps.push(llArrBaseStep('insertAt', arr, size,
      `เลื่อน arr[${i}] (=${arr[i].value}) ไปยัง arr[${i + 1}]`, [2, 3],
      { [arr[i].id]: 'current' }, { current: i }));
  }

  // Place at pos
  const newArr = arr.slice(0, pos).concat([newNode]).concat(arr.slice(pos));
  const newSize = size + 1;
  steps.push(llArrBaseStep('insertAt', newArr, newSize,
    `กำหนด arr[pos] = arr[${pos}] = ${value}  แล้ว size++`, [4, 5],
    { [newId]: 'new' }, { current: pos },
    `insertAt(${value}, ${pos}) → สำเร็จ  ขนาด = ${newSize}`, 'เสร็จสิ้น'));

  return steps;
}

function llArrDeleteAt(arr, size, pos) {
  const steps = [];

  steps.push(llArrBaseStep('deleteAt', arr, size,
    `เริ่ม deleteAt(${pos}) — ตรวจขอบเขต`, [1], {}, { current: null }));

  if (pos < 0 || pos >= size) {
    steps.push(llArrBaseStep('deleteAt', arr, size,
      `ขอบเขตไม่ถูกต้อง (size=${size}, pos=${pos}) → ยกเลิก`, [1], {}, {},
      `Delete ล้มเหลว — pos ไม่ถูกต้อง`, 'Out of bounds'));
    return steps;
  }

  const target = arr[pos];
  steps.push(llArrBaseStep('deleteAt', arr, size,
    `ต้องการลบ arr[${pos}] = ${target.value}`, [1],
    { [target.id]: 'removing' }, { current: pos }));

  // Shift left
  for (let i = pos; i < size - 1; i++) {
    steps.push(llArrBaseStep('deleteAt', arr, size,
      `เลื่อน arr[${i + 1}] (=${arr[i + 1].value}) ไปยัง arr[${i}]`, [2, 3],
      { [arr[i + 1].id]: 'current' }, { current: i }));
  }

  // Final: arr without last, size--
  const newArr = arr.slice(0, size - 1);
  const newSize = size - 1;
  steps.push(llArrBaseStep('deleteAt', newArr, newSize,
    `size-- (จาก ${size} เป็น ${newSize}) — ลบ ${target.value} สำเร็จ`, [4],
    {}, { current: null },
    `deleteAt(${pos}) → ลบ ${target.value} สำเร็จ  ขนาด = ${newSize}`, 'เสร็จสิ้น'));

  return steps;
}

function llArrSearch(arr, size, value) {
  const steps = [];

  steps.push(llArrBaseStep('search', arr, size,
    `เริ่ม search(${value}) — วน i ตั้งแต่ 0 ถึง ${size - 1}`, [1], {}, { current: 0 }));

  for (let i = 0; i < size; i++) {
    if (arr[i].value === value) {
      steps.push(llArrBaseStep('search', arr, size,
        `arr[${i}] == ${value} → พบ! คืน index ${i}`, [2, 3],
        { [arr[i].id]: 'found' }, { current: i },
        `search(${value}) → พบที่ index ${i}`, 'พบ'));
      return steps;
    }
    steps.push(llArrBaseStep('search', arr, size,
      `arr[${i}] = ${arr[i].value} ≠ ${value} → i++`, [2],
      { [arr[i].id]: 'current' }, { current: i }));
  }

  steps.push(llArrBaseStep('search', arr, size,
    `วนครบทุก index แล้ว ไม่พบ ${value} → คืน -1`, [4],
    {}, { current: null },
    `search(${value}) → ไม่พบ`, 'ไม่พบ'));
  return steps;
}

function llArrTraverse(arr, size) {
  const steps = [];
  let output = '';

  steps.push(llArrBaseStep('traverse', arr, size,
    `เริ่ม traverse — วน i = 0..${size - 1}`, [1], {}, { current: 0 }));

  for (let i = 0; i < size; i++) {
    const newOutput = output + (i > 0 ? ' -> ' : '') + arr[i].value;
    steps.push(llArrBaseStep('traverse', arr, size,
      `พิมพ์ arr[${i}] = ${arr[i].value}`, [2],
      { [arr[i].id]: 'current' }, { current: i }, `Output: ${newOutput}`));
    output = newOutput;
  }

  steps.push(llArrBaseStep('traverse', arr, size,
    `วนจบ — พิมพ์ "NULL" ปิดท้าย`, [3],
    {}, { current: null }, `Output: ${output} -> NULL`));
  return steps;
}

// ============ Visualization renderer ============

function llArrRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const arr = step.nodes;
  const size = step.pointers.size;
  const roles = step.roles;
  const current = step.pointers.current;

  if (vizMeta) {
    vizMeta.textContent = `size = ${size} · ${arr.length} element${arr.length !== 1 ? 's' : ''}`;
  }

  const inner = window.DS.el('div', { class: 'viz-inner' });

  // size pointer (above the array, above the size-th position)
  // We display: arr[0], arr[1], ..., arr[size-1], [empty slot at index size]
  // size pointer points at the "next" empty position

  // Top row: pointer chips above each cell
  const topRow = window.DS.el('div', { style: 'display:flex;gap:8px;align-items:flex-end;justify-content:center;min-height:50px' });
  for (let i = 0; i < arr.length + 1; i++) {
    const stack = window.DS.el('div', { class: 'pointer-stack' });
    const chips = window.DS.el('div', { class: 'pointer-chips-row' });
    // size pointer at index === size
    if (i === size) {
      chips.appendChild(window.DS.makePointerChip('size', 'current'));
    }
    // current pointer
    if (i === current) {
      chips.appendChild(window.DS.makePointerChip('i', 'target'));
    }
    stack.appendChild(chips);
    if (i === size || i === current) {
      stack.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
    }
    topRow.appendChild(stack);
  }
  inner.appendChild(topRow);

  // Array row: cells + empty slot at size
  const arrRow = window.DS.el('div', { style: 'display:flex;align-items:stretch;gap:8px' });
  for (let i = 0; i < arr.length; i++) {
    const node = arr[i];
    const role = roles[node.id] || '';
    arrRow.appendChild(window.DS.makeNodeBox({
      value: node.value,
      role,
      idxLabel: i,
      metaContent: i === size - 1 ? 'last' : '',
    }));
  }
  // Empty slot at index = size
  const emptySlot = window.DS.el('div', {
    class: 'node',
    style: 'border-style:dashed;opacity:0.5;min-width:100px',
  });
  emptySlot.appendChild(window.DS.el('div', { class: 'node-idx' }, String(size)));
  emptySlot.appendChild(window.DS.el('div', { class: 'node-cell-data', style: 'color:var(--text-muted)' }, '—'));
  emptySlot.appendChild(window.DS.el('div', { class: 'node-cell-meta' }, 'empty'));
  arrRow.appendChild(emptySlot);
  inner.appendChild(arrRow);

  // Bottom labels
  const bottomRow = window.DS.el('div', { style: 'display:flex;gap:8px;justify-content:center;min-height:16px;margin-top:4px' });
  for (let i = 0; i < arr.length + 1; i++) {
    bottomRow.appendChild(window.DS.el('div', { class: 'node-below-label', style: 'width:100px;text-align:center' },
      i === 0 ? '↑ ต้น array' : (i === size ? '↑ ตำแหน่งต่อไป' : '')));
  }
  inner.appendChild(bottomRow);

  vizArea.appendChild(inner);
}

window.LL_ARRAY = {
  insertHead: llArrInsertHead,
  insertTail: llArrInsertTail,
  insertAt: llArrInsertAt,
  deleteAt: llArrDeleteAt,
  search: llArrSearch,
  traverse: llArrTraverse,
  render: llArrRender,
  makeInitial: (values) => values.map((v) => ({ id: llArrId(), value: v })),
};
