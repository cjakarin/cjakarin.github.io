// ============ Linked List — Pointer Implementation ============
//
// Visual model: horizontal chain of node boxes [data | next]->[data | next]->...->NULL
// with `head` pointer at the start.

let llPtrIdCounter = 0;
function llPtrId() {
  llPtrIdCounter += 1;
  return `lp${llPtrIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function llPtrBase(operation, nodes, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation,
    description,
    codeLines,
    nodes: nodes.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { head: null, current: null, prev: null, newNode: null, ...pointers },
    consoleOutput,
    phase,
  };
}

function llPtrInsertHead(nodes, value) {
  const steps = [];
  const newId = llPtrId();
  const newNode = { id: newId, value };

  steps.push(llPtrBase('insertHead', nodes,
    `เริ่ม insertAtHead(${value})`, [1], {},
    { head: nodes[0]?.id || null }));

  steps.push(llPtrBase('insertHead', nodes,
    `Node* newNode = new Node(${value}) — สร้าง Node ใหม่`, [1],
    { [newId]: 'new' }, { head: nodes[0]?.id || null, newNode: newId }, undefined, 'สร้าง Node'));

  steps.push(llPtrBase('insertHead', nodes,
    `newNode->next = head — ชี้ next ของ newNode ไปยัง head เดิม`, [2],
    { [newId]: 'new', ...(nodes[0] ? { [nodes[0].id]: 'target' } : {}) },
    { head: nodes[0]?.id || null, newNode: newId }, undefined, 'โยง next'));

  const newArr = [newNode, ...nodes];
  steps.push(llPtrBase('insertHead', newArr,
    `head = newNode — ย้าย head มาชี้ newNode`, [3],
    { [newId]: 'found' }, { head: newId },
    `insertAtHead(${value}) → สำเร็จ  ลิสต์มี ${newArr.length} node`, 'เสร็จสิ้น'));

  return steps;
}

function llPtrInsertTail(nodes, value) {
  const steps = [];
  const newId = llPtrId();
  const newNode = { id: newId, value };

  steps.push(llPtrBase('insertTail', nodes,
    `เริ่ม insertAtTail(${value})`, [1], {},
    { head: nodes[0]?.id || null }));

  steps.push(llPtrBase('insertTail', nodes,
    `Node* newNode = new Node(${value})`, [1],
    { [newId]: 'new' }, { head: nodes[0]?.id || null, newNode: newId }, undefined, 'สร้าง Node'));

  if (nodes.length === 0) {
    const newArr = [newNode];
    steps.push(llPtrBase('insertTail', nodes,
      `head == nullptr → head = newNode`, [2, 3],
      { [newId]: 'new' }, { head: null, newNode: newId }, undefined, 'ลิสต์ว่าง'));
    steps.push(llPtrBase('insertTail', newArr,
      `insert สำเร็จ`, [3], { [newId]: 'found' }, { head: newId },
      `insertAtTail(${value}) → สำเร็จ (ลิสต์ว่าง)`, 'เสร็จสิ้น'));
    return steps;
  }

  steps.push(llPtrBase('insertTail', nodes,
    `current = head เพื่อเดินไปท้ายลิสต์`, [5],
    { [nodes[0].id]: 'current' }, { head: nodes[0].id, current: nodes[0].id, newNode: newId }, undefined, 'เริ่ม traverse'));

  let current = nodes[0];
  let i = 0;
  while (i < nodes.length - 1) {
    const next = nodes[i + 1];
    steps.push(llPtrBase('insertTail', nodes,
      `current->next != nullptr → current = current->next (ไป ${next.value})`, [6, 7],
      { [current.id]: 'prev', [next.id]: 'current' },
      { head: nodes[0].id, current: next.id, prev: current.id, newNode: newId }, undefined, 'เลื่อน current'));
    current = next;
    i++;
  }

  steps.push(llPtrBase('insertTail', nodes,
    `current->next == nullptr → หยุด ตอนนี้ current คือ Node สุดท้าย (${current.value})`, [6],
    { [current.id]: 'current' },
    { head: nodes[0].id, current: current.id, newNode: newId }, undefined, 'ถึงท้าย'));

  const newArr = [...nodes, newNode];
  steps.push(llPtrBase('insertTail', newArr,
    `current->next = newNode — โยง Node สุดท้ายเข้า newNode`, [8],
    { [current.id]: 'prev', [newId]: 'new' },
    { head: nodes[0].id, current: current.id, newNode: newId }, undefined, 'โยง Node'));

  steps.push(llPtrBase('insertTail', newArr,
    `insert สำเร็จ  ลิสต์มี ${newArr.length} node`, [],
    { [newId]: 'found' }, { head: nodes[0].id },
    `insertAtTail(${value}) → สำเร็จ`, 'เสร็จสิ้น'));

  return steps;
}

function llPtrInsertAt(nodes, value, pos) {
  const steps = [];
  const newId = llPtrId();
  const newNode = { id: newId, value };

  steps.push(llPtrBase('insertAt', nodes,
    `เริ่ม insertAtPosition(${value}, ${pos})`, [1], {},
    { head: nodes[0]?.id || null }));

  if (pos === 0) {
    steps.push(llPtrBase('insertAt', nodes,
      `pos == 0 → เรียก insertAtHead(${value})`, [1],
      {}, { head: nodes[0]?.id || null }, undefined, 'เรียก insertHead'));
    return llPtrInsertHead(nodes, value);
  }

  steps.push(llPtrBase('insertAt', nodes,
    `Node* newNode = new Node(${value})`, [2],
    { [newId]: 'new' }, { head: nodes[0]?.id || null, newNode: newId }, undefined, 'สร้าง Node'));

  if (nodes.length === 0) {
    steps.push(llPtrBase('insertAt', nodes,
      `head == nullptr → ยกเลิก (ไม่สามารถ insert ที่ pos=${pos} ได้)`, [3, 4, 5, 6],
      { [newId]: 'new' }, { head: null, newNode: newId }, undefined, 'ลิสต์ว่าง'));
    return steps;
  }

  steps.push(llPtrBase('insertAt', nodes,
    `current = head`, [3],
    { [nodes[0].id]: 'current' },
    { head: nodes[0].id, current: nodes[0].id, newNode: newId }, undefined, 'เริ่ม traverse'));

  let current = nodes[0];
  for (let i = 0; i < pos - 1; i++) {
    if (!current || !nodes[i + 1]) {
      steps.push(llPtrBase('insertAt', nodes,
        `current == nullptr → ตำแหน่งเกินขนาดลิสต์ ยกเลิก`, [4, 5, 6],
        {}, { head: nodes[0].id, current: null, newNode: newId }, undefined, 'เกินขอบเขต'));
      return steps;
    }
    const next = nodes[i + 1];
    steps.push(llPtrBase('insertAt', nodes,
      `i=${i} < ${pos - 1} → current = current->next (ไป ${next.value})`, [4, 5],
      { [current.id]: 'prev', [next.id]: 'current' },
      { head: nodes[0].id, current: next.id, prev: current.id, newNode: newId }, undefined, 'เลื่อน current'));
    current = next;
  }

  if (!current) {
    steps.push(llPtrBase('insertAt', nodes,
      `current == nullptr → ยกเลิก`, [6],
      {}, { head: nodes[0].id, current: null, newNode: newId }, undefined, 'เกินขอบเขต'));
    return steps;
  }

  const nextNode = nodes[pos];
  steps.push(llPtrBase('insertAt', nodes,
    `newNode->next = current->next`, [7],
    {
      [newId]: 'new', [current.id]: 'current',
      ...(nextNode ? { [nextNode.id]: 'target' } : {}),
    },
    { head: nodes[0].id, current: current.id, newNode: newId }, undefined, 'โยง newNode->next'));

  const idx = nodes.indexOf(current);
  const newArr = [...nodes.slice(0, idx + 1), newNode, ...nodes.slice(idx + 1)];
  steps.push(llPtrBase('insertAt', newArr,
    `current->next = newNode`, [8],
    { [current.id]: 'prev', [newId]: 'new' },
    { head: nodes[0].id, current: current.id, newNode: newId }, undefined, 'โยง current->next'));

  steps.push(llPtrBase('insertAt', newArr,
    `insert สำเร็จ  ลิสต์มี ${newArr.length} node`, [],
    { [newId]: 'found' }, { head: nodes[0].id },
    `insertAtPosition(${value}, ${pos}) → สำเร็จ`, 'เสร็จสิ้น'));

  return steps;
}

function llPtrDeleteAt(nodes, pos) {
  const steps = [];

  steps.push(llPtrBase('deleteAt', nodes,
    `เริ่ม deleteAt(${pos})`, [1], {},
    { head: nodes[0]?.id || null }));

  if (nodes.length === 0 || pos < 0) {
    steps.push(llPtrBase('deleteAt', nodes,
      `head == nullptr หรือ pos < 0 → ยกเลิก`, [1], {},
      { head: null }, `Delete ล้มเหลว — ลิสต์ว่าง`, 'ลิสต์ว่าง'));
    return steps;
  }

  if (pos === 0) {
    const target = nodes[0];
    steps.push(llPtrBase('deleteAt', nodes,
      `pos == 0 → ลบที่หัว  temp = head`, [2, 3],
      { [target.id]: 'removing' }, { head: target.id }, undefined, 'ลบที่หัว'));
    const newArr = nodes.slice(1);
    steps.push(llPtrBase('deleteAt', newArr,
      `head = head->next`, [4],
      {}, { head: newArr[0]?.id || null }, undefined, 'ย้าย head'));
    steps.push(llPtrBase('deleteAt', newArr,
      `delete temp — ลบ ${target.value} สำเร็จ`, [5],
      {}, { head: newArr[0]?.id || null },
      `deleteAt(0) → ลบ ${target.value} สำเร็จ`, 'เสร็จสิ้น'));
    return steps;
  }

  steps.push(llPtrBase('deleteAt', nodes,
    `prev = head, เดินไป (pos-1)`, [7],
    { [nodes[0].id]: 'current' },
    { head: nodes[0].id, current: nodes[0].id }, undefined, 'เริ่ม traverse'));

  let prev = nodes[0];
  for (let i = 0; i < pos - 1; i++) {
    if (!prev || !nodes[i + 1]) {
      steps.push(llPtrBase('deleteAt', nodes,
        `prev->next == nullptr → ตำแหน่งเกินขนาด ยกเลิก`, [8],
        {}, { head: nodes[0].id }, `Delete ล้มเหลว — pos เกินขนาด`, 'เกินขอบเขต'));
      return steps;
    }
    const next = nodes[i + 1];
    steps.push(llPtrBase('deleteAt', nodes,
      `i=${i} < ${pos - 1} → prev = prev->next (ไป ${next.value})`, [8, 9],
      { [prev.id]: 'prev', [next.id]: 'current' },
      { head: nodes[0].id, prev: next.id, current: next.id }, undefined, 'เลื่อน prev'));
    prev = next;
  }

  if (!prev || !nodes[pos]) {
    steps.push(llPtrBase('deleteAt', nodes,
      `prev->next == nullptr → ไม่มี Node ที่จะลบ`, [10],
      {}, { head: nodes[0].id }, `Delete ล้มเหลว — pos เกินขนาด`, 'เกินขอบเขต'));
    return steps;
  }

  const target = nodes[pos];
  const afterTarget = nodes[pos + 1];
  steps.push(llPtrBase('deleteAt', nodes,
    `temp = prev->next (=${target.value})`, [11],
    { [prev.id]: 'prev', [target.id]: 'removing' },
    { head: nodes[0].id, prev: prev.id, current: target.id }, undefined, 'เก็บ temp'));

  steps.push(llPtrBase('deleteAt', nodes,
    `prev->next = temp->next — โยงข้าม temp`, [12],
    {
      [prev.id]: 'prev', [target.id]: 'removing',
      ...(afterTarget ? { [afterTarget.id]: 'target' } : {}),
    },
    { head: nodes[0].id, prev: prev.id, current: target.id }, undefined, 'โยงข้าม'));

  const newArr = nodes.filter((n) => n.id !== target.id);
  steps.push(llPtrBase('deleteAt', newArr,
    `delete temp — ลบ ${target.value} สำเร็จ`, [13],
    {}, { head: newArr[0]?.id || null },
    `deleteAt(${pos}) → ลบ ${target.value} สำเร็จ`, 'เสร็จสิ้น'));

  return steps;
}

function llPtrSearch(nodes, value) {
  const steps = [];

  if (nodes.length === 0) {
    steps.push(llPtrBase('search', nodes,
      `head == nullptr → คืน -1 ทันที`, [1, 2, 3, 8],
      {}, { head: null }, `ไม่พบ ${value} (ลิสต์ว่าง)`, 'ลิสต์ว่าง'));
    return steps;
  }

  steps.push(llPtrBase('search', nodes,
    `เริ่ม search(${value}) — current = head, index = 0`, [1, 2],
    { [nodes[0].id]: 'current' }, { head: nodes[0].id, current: nodes[0].id }));

  let current = nodes[0];
  for (let i = 0; i < nodes.length; i++) {
    if (current.value === value) {
      steps.push(llPtrBase('search', nodes,
        `current->data (${current.value}) == ${value} → พบ! คืน index ${i}`, [4, 5],
        { [current.id]: 'found' }, { head: nodes[0].id, current: current.id },
        `search(${value}) → พบที่ index ${i}`, 'พบ'));
      return steps;
    }
    const next = nodes[i + 1];
    steps.push(llPtrBase('search', nodes,
      next
        ? `current->data (${current.value}) != ${value} → current = current->next, index++`
        : `current->data (${current.value}) != ${value} → current = current->next (nullptr)`,
      [6, 7],
      next
        ? { [current.id]: 'prev', [next.id]: 'current' }
        : { [current.id]: 'current' },
      { head: nodes[0].id, current: next?.id || null, prev: current.id }, undefined, 'ไม่ตรง'));
    current = next;
  }

  steps.push(llPtrBase('search', nodes,
    `current == nullptr → ไม่พบ ${value} → คืน -1`, [8],
    {}, { head: nodes[0].id, current: null },
    `search(${value}) → ไม่พบ`, 'ไม่พบ'));
  return steps;
}

function llPtrTraverse(nodes) {
  const steps = [];

  if (nodes.length === 0) {
    steps.push(llPtrBase('traverse', nodes,
      `ลิสต์ว่าง — พิมพ์ "NULL" ทันที`, [1, 2, 5],
      {}, { head: null }, `Output: NULL`, 'ลิสต์ว่าง'));
    return steps;
  }

  steps.push(llPtrBase('traverse', nodes,
    `เริ่ม traverse — current = head`, [1],
    { [nodes[0].id]: 'current' }, { head: nodes[0].id, current: nodes[0].id }));

  let output = '';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const newOutput = output + (i > 0 ? ' -> ' : '') + node.value;
    steps.push(llPtrBase('traverse', nodes,
      `current != nullptr → พิมพ์ current->data (${node.value})`, [2, 3],
      { [node.id]: 'current' }, { head: nodes[0].id, current: node.id },
      `Output: ${newOutput}`));
    output = newOutput;

    const next = nodes[i + 1];
    steps.push(llPtrBase('traverse', nodes,
      next
        ? `current = current->next (ไป ${next.value})`
        : `current = current->next (nullptr)`,
      [4],
      next
        ? { [node.id]: 'prev', [next.id]: 'current' }
        : { [node.id]: 'current' },
      { head: nodes[0].id, current: next?.id || null, prev: node.id }));
  }

  steps.push(llPtrBase('traverse', nodes,
    `current == nullptr → พิมพ์ "NULL"`, [5],
    {}, { head: nodes[0].id, current: null }, `Output: ${output} -> NULL`));
  return steps;
}

// ============ Visualization renderer ============

function llPtrRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const nodes = step.nodes;
  const roles = step.roles;
  const pointers = step.pointers;

  if (vizMeta) {
    vizMeta.textContent = `${nodes.length} node${nodes.length !== 1 ? 's' : ''}`;
  }

  const inner = window.DS.el('div', { class: 'viz-inner' });

  // head pointer on left
  const headLane = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;min-height:50px;flex-shrink:0' });
  if (pointers.head) {
    headLane.appendChild(window.DS.makePointerChip('head', 'head'));
    headLane.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
    headLane.appendChild(window.DS.el('div', { class: 'pointer-arrow', style: 'color:var(--emerald)' }));
  } else {
    headLane.appendChild(window.DS.makePointerChip('head = nullptr', 'head'));
  }
  inner.appendChild(headLane);

  // nodes
  if (nodes.length === 0) {
    const nullBox = window.DS.el('div', {
      class: 'node', style: 'border-style:dashed;opacity:0.6',
    });
    nullBox.appendChild(window.DS.el('div', { class: 'node-cell-data', style: 'color:var(--text-muted)' }, 'empty'));
    inner.appendChild(nullBox);
  } else {
    nodes.forEach((node, idx) => {
      const role = roles[node.id] || '';

      // Pointer chips above the node
      const stack = window.DS.el('div', { class: 'pointer-stack', style: 'margin-right:8px' });
      const chips = window.DS.el('div', { class: 'pointer-chips-row' });
      if (pointers.current === node.id) chips.appendChild(window.DS.makePointerChip('current', 'current'));
      if (pointers.prev === node.id) chips.appendChild(window.DS.makePointerChip('prev', 'prev'));
      if (pointers.newNode === node.id && role === 'new') chips.appendChild(window.DS.makePointerChip('new', 'new'));
      if (role === 'found') chips.appendChild(window.DS.makePointerChip('พบ!', 'found'));
      if (role === 'target') chips.appendChild(window.DS.makePointerChip('target', 'target'));
      if (role === 'removing') chips.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
      stack.appendChild(chips);
      if (chips.children.length > 0) {
        stack.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
      }
      inner.appendChild(stack);

      // Node box [data | next]
      const isLast = idx === nodes.length - 1;
      const metaContent = isLast
        ? '<span style="color:var(--pink)">nullptr</span>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      inner.appendChild(window.DS.makeNodeBox({
        value: node.value, role, idxLabel: idx, metaContent,
      }));

      // Arrow connector (except after last node, which already shows nullptr)
      if (!isLast) {
        inner.appendChild(window.DS.makeArrowConnector(false));
      } else {
        // small gap then nullptr indicator already in cell, no extra arrow
      }
    });

    // Final arrow to NULL
    inner.appendChild(window.DS.makeArrowConnector(true));
  }

  vizArea.appendChild(inner);
}

window.LL_POINTER = {
  insertHead: llPtrInsertHead,
  insertTail: llPtrInsertTail,
  insertAt: llPtrInsertAt,
  deleteAt: llPtrDeleteAt,
  search: llPtrSearch,
  traverse: llPtrTraverse,
  render: llPtrRender,
  makeInitial: (values) => values.map((v) => ({ id: llPtrId(), value: v })),
};
