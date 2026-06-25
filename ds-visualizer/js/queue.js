// ============ Queue — Array Implementation ============
// Visual: horizontal array with front/rear pointers.
// We use the compaction model: after dequeue, indices reset to 0..n-1.

let qaIdCounter = 0;
function qaId() {
  qaIdCounter += 1;
  return `qa${qaIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function qaBase(operation, arr, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { front: 0, rear: arr.length - 1, ...pointers },
    consoleOutput, phase,
  };
}

function qaEnqueue(arr, value) {
  const steps = [];
  const newId = qaId();
  const newNode = { id: newId, value };
  const liveFront = 0;
  const liveRear = arr.length - 1;

  steps.push(qaBase('enqueue', arr,
    `เริ่ม enqueue(${value}) — ตรวจ overflow`, [1],
    liveRear >= 0 ? { [arr[liveRear].id]: 'rear' } : {},
    { front: liveFront, rear: liveRear }));

  if (arr.length >= 100) {
    steps.push(qaBase('enqueue', arr,
      `rear >= MAX-1 → Queue Overflow!`, [1, 2],
      { [arr[liveRear].id]: 'overflow' },
      { front: liveFront, rear: liveRear },
      `Queue Overflow — enqueue ล้มเหลว`, 'Overflow'));
    return steps;
  }

  const virtualRear = liveRear + 1;
  steps.push(qaBase('enqueue', arr,
    `ไม่ overflow → rear++ (จาก ${liveRear} เป็น ${virtualRear})`, [],
    liveRear >= 0 ? { [arr[liveRear].id]: 'rear' } : {},
    { front: liveFront, rear: liveRear }, undefined, 'เพิ่ม rear'));

  const newArr = [...arr, newNode];
  steps.push(qaBase('enqueue', newArr,
    `arr[rear] = ${value}`, [4],
    { [newId]: 'new' },
    { front: liveFront, rear: virtualRear, newIdx: virtualRear }, undefined, 'เขียนค่า'));

  steps.push(qaBase('enqueue', newArr,
    `enqueue(${value}) สำเร็จ  คิวมี ${newArr.length} สมาชิก`, [],
    liveFront === virtualRear
      ? { [newId]: 'both' }
      : { [arr[liveFront].id]: 'front', [newId]: 'rear' },
    { front: liveFront, rear: virtualRear },
    `enqueue(${value}) → คิวมี ${newArr.length} สมาชิก`, 'เสร็จสิ้น'));

  return steps;
}

function qaDequeue(arr) {
  const steps = [];
  const liveFront = 0;
  const liveRear = arr.length - 1;
  const isEmpty = arr.length === 0;

  steps.push(qaBase('dequeue', arr,
    `เริ่ม dequeue() — ตรวจ underflow (front > rear?)`, [1],
    isEmpty ? {} : (liveFront === liveRear ? { [arr[liveFront].id]: 'both' } : { [arr[liveFront].id]: 'front', [arr[liveRear].id]: 'rear' }),
    { front: liveFront, rear: liveRear }));

  if (isEmpty) {
    steps.push(qaBase('dequeue', arr,
      `front > rear → Queue Underflow!`, [1, 2],
      {}, { front: liveFront, rear: liveRear },
      `Queue Underflow — dequeue ล้มเหลว`, 'Underflow'));
    return steps;
  }

  const target = arr[liveFront];
  steps.push(qaBase('dequeue', arr,
    `val = arr[front] = ${target.value}`, [],
    { [target.id]: 'peeked' },
    { front: liveFront, rear: liveRear, temp: liveFront }, undefined, 'อ่านค่า'));

  steps.push(qaBase('dequeue', arr,
    `front++ (จาก ${liveFront} เป็น ${liveFront + 1})`, [4],
    { [target.id]: 'removing' },
    { front: liveFront + 1, rear: liveRear, temp: liveFront }, undefined, 'เลื่อน front'));

  const remaining = arr.slice(1);
  const compactFront = 0;
  const compactRear = remaining.length - 1;
  steps.push(qaBase('dequeue', remaining,
    `return val (${target.value}) — compact คิวใหม่ (front=0, rear=${compactRear})`, [],
    remaining.length > 0
      ? (compactFront === compactRear ? { [remaining[0].id]: 'both' } : { [remaining[0].id]: 'front', [remaining[compactRear].id]: 'rear' })
      : {},
    { front: compactFront, rear: compactRear },
    `dequeue() → คืนค่า ${target.value} (เหลือ ${remaining.length} สมาชิก)`, 'เสร็จสิ้น'));

  return steps;
}

function qaFront(arr) {
  const steps = [];
  const liveFront = 0;
  const liveRear = arr.length - 1;
  const isEmpty = arr.length === 0;

  steps.push(qaBase('front', arr,
    `เริ่ม front() — ตรวจ underflow`, [1],
    isEmpty ? {} : (liveFront === liveRear ? { [arr[liveFront].id]: 'both' } : { [arr[liveFront].id]: 'front', [arr[liveRear].id]: 'rear' }),
    { front: liveFront, rear: liveRear }));

  if (isEmpty) {
    steps.push(qaBase('front', arr,
      `front > rear → Queue Underflow!`, [1, 2],
      {}, { front: liveFront, rear: liveRear },
      `Queue Underflow — คิวว่าง`, 'Underflow'));
    return steps;
  }

  const target = arr[liveFront];
  steps.push(qaBase('front', arr,
    `คืน arr[front] = ${target.value}  (ไม่ได้ลบ แค่อ่านค่าหน้าสุด)`, [4],
    { [target.id]: 'peeked' },
    { front: liveFront, rear: liveRear },
    `front() → ${target.value}`, 'เสร็จสิ้น'));

  return steps;
}

function qaRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const arr = step.nodes;
  const { front, rear } = step.pointers;
  const roles = step.roles;
  const isEmpty = arr.length === 0 || front > rear;
  const liveCount = isEmpty ? 0 : rear - front + 1;
  const displayNodes = isEmpty ? [] : arr.slice(front, rear + 1);

  if (vizMeta) {
    vizMeta.textContent = `front=${front} · rear=${rear} · ${isEmpty ? 'ว่าง' : `${liveCount} สมาชิก`}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px' });

  // Direction labels
  const dirRow = window.DS.el('div', {
    style: 'display:flex;justify-content:space-between;width:100%;max-width:600px;font-size:10px;color:var(--text-muted);font-family:monospace',
  });
  dirRow.innerHTML = '<span>← DEQUEUE (ออก)</span><span>ENQUEUE (เข้า) →</span>';
  wrap.appendChild(dirRow);

  // Queue cells row
  const queueBox = window.DS.el('div', {
    style: 'display:flex;align-items:stretch;gap:6px;min-height:80px;padding:8px;border:2px dashed var(--border);border-radius:12px;background:rgba(255,255,255,0.02)',
  });

  if (displayNodes.length === 0) {
    const empty = window.DS.el('div', {
      style: 'padding:12px 24px;color:var(--text-muted);font-family:monospace;font-size:12px;align-self:center',
    }, 'คิวว่าง (front > rear)');
    queueBox.appendChild(empty);
  } else {
    displayNodes.forEach((node, displayIdx) => {
      const absoluteIdx = front + displayIdx;
      const role = roles[node.id] || '';
      const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });

      // Pointer chips above
      const chips = window.DS.el('div', { class: 'pointer-chips-row', style: 'min-height:36px;align-items:flex-end' });
      const chipInner = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
      const chipRow = window.DS.el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center' });
      if (role === 'front' || role === 'both') chipRow.appendChild(window.DS.makePointerChip('front', 'front'));
      if (role === 'rear' || role === 'both') chipRow.appendChild(window.DS.makePointerChip('rear', 'rear'));
      if (role === 'new') chipRow.appendChild(window.DS.makePointerChip('new', 'new'));
      if (role === 'peeked') chipRow.appendChild(window.DS.makePointerChip('peek', 'peek'));
      if (role === 'removing') chipRow.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
      chipInner.appendChild(chipRow);
      if (chipRow.children.length > 0) {
        chipInner.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
      }
      chips.appendChild(chipInner);
      cellWrap.appendChild(chips);

      // Node box
      const box = window.DS.makeNodeBox({
        value: node.value, role, idxLabel: absoluteIdx,
      });
      cellWrap.appendChild(box);

      // Label below
      cellWrap.appendChild(window.DS.el('div', {
        class: 'mono', style: 'font-size:10px;color:var(--text-muted);min-height:14px;text-align:center',
      }, displayIdx === 0 ? '← หน้าสุด' : (displayIdx === displayNodes.length - 1 && displayNodes.length > 1 ? 'ท้ายสุด →' : '')));

      queueBox.appendChild(cellWrap);
    });
  }
  wrap.appendChild(queueBox);

  // Index counter
  const counter = window.DS.el('div', {
    style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);font-family:monospace;flex-wrap:wrap;justify-content:center',
  });
  counter.innerHTML = `<span>front = <b style="color:var(--amber)">${front}</b></span><span>rear = <b style="color:var(--purple)">${rear}</b></span>${liveCount > 0 ? `<span>จำนวนสมาชิก = <b style="color:var(--emerald)">${liveCount}</b></span>` : ''}`;
  wrap.appendChild(counter);

  vizArea.appendChild(wrap);
}

window.QUEUE_ARRAY = {
  enqueue: qaEnqueue,
  dequeue: qaDequeue,
  front: qaFront,
  render: qaRender,
  makeInitial: (values) => values.map((v) => ({ id: qaId(), value: v })),
};

// ============ Queue — Pointer Implementation ============
// Visual: horizontal chain of node boxes [data | next] with front (left) and rear (right) pointers.

let qpIdCounter = 0;
function qpId() {
  qpIdCounter += 1;
  return `qp${qpIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function qpBase(operation, arr, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { frontId: null, rearId: null, newId: null, tempId: null, ...pointers },
    consoleOutput, phase,
  };
}

function qpEnqueue(arr, value) {
  const steps = [];
  const newId = qpId();
  const newNode = { id: newId, value };
  const isEmpty = arr.length === 0;

  steps.push(qpBase('enqueue', arr,
    `เริ่ม enqueue(${value})`, [1],
    arr.length > 0
      ? (arr.length === 1 ? { [arr[0].id]: 'both' } : { [arr[0].id]: 'front', [arr[arr.length - 1].id]: 'rear' })
      : {},
    { frontId: arr[0]?.id || null, rearId: arr[arr.length - 1]?.id || null }));

  steps.push(qpBase('enqueue', arr,
    `Node* newNode = new Node(${value})`, [1],
    { [newId]: 'new' },
    { frontId: arr[0]?.id || null, rearId: arr[arr.length - 1]?.id || null, newId }, undefined, 'สร้าง Node'));

  if (isEmpty) {
    const newArr = [newNode];
    steps.push(qpBase('enqueue', arr,
      `rear == nullptr → front = rear = newNode`, [2, 3],
      { [newId]: 'new' },
      { frontId: null, rearId: null, newId }, undefined, 'คิวว่าง'));
    steps.push(qpBase('enqueue', newArr,
      `enqueue สำเร็จ (คิวว่าง → front = rear = newNode)`, [3, 4],
      { [newId]: 'both' },
      { frontId: newId, rearId: newId },
      `enqueue(${value}) → สำเร็จ  คิวมี 1 สมาชิก`, 'เสร็จสิ้น'));
    return steps;
  }

  const oldRear = arr[arr.length - 1];
  steps.push(qpBase('enqueue', arr,
    `rear->next = newNode — โยง rear เดิมเข้า newNode`, [5],
    { [oldRear.id]: 'rear', [newId]: 'new' },
    { frontId: arr[0].id, rearId: oldRear.id, newId }, undefined, 'โยง next'));

  const newArr = [...arr, newNode];
  steps.push(qpBase('enqueue', newArr,
    `rear = newNode — ย้าย rear ไป newNode`, [6],
    { [arr[0].id]: 'front', [newId]: 'rear' },
    { frontId: arr[0].id, rearId: newId },
    `enqueue(${value}) → สำเร็จ  คิวมี ${newArr.length} สมาชิก`, 'เสร็จสิ้น'));

  return steps;
}

function qpDequeue(arr) {
  const steps = [];
  const isEmpty = arr.length === 0;

  steps.push(qpBase('dequeue', arr,
    `เริ่ม dequeue() — ตรวจ underflow (front == nullptr?)`, [1],
    arr.length > 0
      ? (arr.length === 1 ? { [arr[0].id]: 'both' } : { [arr[0].id]: 'front', [arr[arr.length - 1].id]: 'rear' })
      : {},
    { frontId: arr[0]?.id || null, rearId: arr[arr.length - 1]?.id || null }));

  if (isEmpty) {
    steps.push(qpBase('dequeue', arr,
      `front == nullptr → Queue Underflow!`, [1, 2, 3],
      {}, { frontId: null, rearId: null },
      `Queue Underflow — dequeue ล้มเหลว`, 'Underflow'));
    return steps;
  }

  const target = arr[0];
  steps.push(qpBase('dequeue', arr,
    `temp = front; val = temp->data = ${target.value}`, [4, 5],
    { [target.id]: 'peeked' },
    { frontId: target.id, rearId: arr[arr.length - 1].id, tempId: target.id }, undefined, 'อ่านค่า'));

  const nextNode = arr[1];
  steps.push(qpBase('dequeue', arr,
    nextNode
      ? `front = front->next (ไป ${nextNode.value})`
      : `front = front->next (nullptr) — คิวเหลือ 1 ตัว`,
    [6],
    { [target.id]: 'removing' },
    {
      frontId: nextNode?.id || null,
      rearId: arr[arr.length - 1].id,
      tempId: target.id,
    }, undefined, 'ย้าย front'));

  // If queue becomes empty after dequeue, rear should also be nullptr
  const newArr = arr.slice(1);
  let finalRoles, finalPointers;
  if (newArr.length === 0) {
    steps.push(qpBase('dequeue', arr,
      `front == nullptr → rear = nullptr (คิวว่าง)`, [7, 8],
      { [target.id]: 'removing' },
      { frontId: null, rearId: null, tempId: target.id }, undefined, 'คิวว่าง'));
    finalRoles = {};
    finalPointers = { frontId: null, rearId: null };
  } else if (newArr.length === 1) {
    finalRoles = { [newArr[0].id]: 'both' };
    finalPointers = { frontId: newArr[0].id, rearId: newArr[0].id };
  } else {
    finalRoles = { [newArr[0].id]: 'front', [newArr[newArr.length - 1].id]: 'rear' };
    finalPointers = { frontId: newArr[0].id, rearId: newArr[newArr.length - 1].id };
  }

  steps.push(qpBase('dequeue', newArr,
    `delete temp — ลบ ${target.value} สำเร็จ`, [9, 10],
    finalRoles, finalPointers,
    `dequeue() → คืนค่า ${target.value} (เหลือ ${newArr.length} สมาชิก)`, 'เสร็จสิ้น'));

  return steps;
}

function qpFront(arr) {
  const steps = [];
  const isEmpty = arr.length === 0;

  steps.push(qpBase('front', arr,
    `เริ่ม front() — ตรวจ empty`, [1],
    arr.length > 0
      ? (arr.length === 1 ? { [arr[0].id]: 'both' } : { [arr[0].id]: 'front', [arr[arr.length - 1].id]: 'rear' })
      : {},
    { frontId: arr[0]?.id || null, rearId: arr[arr.length - 1]?.id || null }));

  if (isEmpty) {
    steps.push(qpBase('front', arr,
      `front == nullptr → Queue is empty`, [1, 2, 3],
      {}, { frontId: null, rearId: null },
      `Queue Underflow — คิวว่าง`, 'Underflow'));
    return steps;
  }

  const target = arr[0];
  steps.push(qpBase('front', arr,
    `คืน front->data = ${target.value}  (ไม่ได้ลบ แค่อ่านค่าหน้าสุด)`, [4],
    { [target.id]: 'peeked' },
    { frontId: target.id, rearId: arr[arr.length - 1].id },
    `front() → ${target.value}`, 'เสร็จสิ้น'));

  return steps;
}

function qpRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);

  const arr = step.nodes;
  const roles = step.roles;
  const pointers = step.pointers;

  if (vizMeta) {
    vizMeta.textContent = `front ${pointers.frontId ? '≠ nullptr' : '= nullptr'} · ${arr.length} element${arr.length !== 1 ? 's' : ''}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px' });

  // Direction labels
  const dirRow = window.DS.el('div', {
    style: 'display:flex;justify-content:space-between;width:100%;max-width:600px;font-size:10px;color:var(--text-muted);font-family:monospace',
  });
  dirRow.innerHTML = '<span>← DEQUEUE (ออก)</span><span>ENQUEUE (เข้า) →</span>';
  wrap.appendChild(dirRow);

  // Queue body
  const queueBox = window.DS.el('div', {
    style: 'display:flex;align-items:stretch;gap:8px;min-height:80px;padding:8px;border:2px dashed var(--border);border-radius:12px;background:rgba(255,255,255,0.02)',
  });

  if (arr.length === 0) {
    const empty = window.DS.el('div', {
      style: 'padding:12px 24px;color:var(--text-muted);font-family:monospace;font-size:12px;align-self:center',
    }, 'คิวว่าง (front = rear = nullptr)');
    queueBox.appendChild(empty);
  } else {
    arr.forEach((node, idx) => {
      const role = roles[node.id] || '';
      const isLast = idx === arr.length - 1;
      const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });

      // Pointer chips above
      const chips = window.DS.el('div', { class: 'pointer-chips-row', style: 'min-height:36px;align-items:flex-end' });
      const chipInner = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
      const chipRow = window.DS.el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center' });
      if (role === 'front' || role === 'both') chipRow.appendChild(window.DS.makePointerChip('front', 'front'));
      if (role === 'rear' || role === 'both') chipRow.appendChild(window.DS.makePointerChip('rear', 'rear'));
      if (role === 'new') chipRow.appendChild(window.DS.makePointerChip('new', 'new'));
      if (role === 'peeked') chipRow.appendChild(window.DS.makePointerChip('peek', 'peek'));
      if (role === 'removing') chipRow.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
      chipInner.appendChild(chipRow);
      if (chipRow.children.length > 0) {
        chipInner.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
      }
      chips.appendChild(chipInner);
      cellWrap.appendChild(chips);

      // Node box [data | next] — next points right
      const metaContent = isLast
        ? '<span style="color:var(--pink)">nullptr</span>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      const box = window.DS.makeNodeBox({
        value: node.value, role, idxLabel: idx, metaContent,
      });
      cellWrap.appendChild(box);

      cellWrap.appendChild(window.DS.el('div', {
        class: 'mono', style: 'font-size:10px;color:var(--text-muted);min-height:14px;text-align:center',
      }, idx === 0 ? '← หน้าสุด' : (isLast && arr.length > 1 ? 'ท้ายสุด →' : '')));

      queueBox.appendChild(cellWrap);

      // Arrow connector between cells
      if (!isLast) {
        const arrow = window.DS.el('div', { class: 'arrow-connector', style: 'align-self:center' });
        arrow.appendChild(window.DS.el('div', { class: 'arrow-line' }));
        arrow.appendChild(window.DS.el('div', { class: 'arrow-tip' }));
        queueBox.appendChild(arrow);
      }
    });
  }
  wrap.appendChild(queueBox);

  // Pointer state info
  const info = window.DS.el('div', {
    style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);font-family:monospace;flex-wrap:wrap;justify-content:center',
  });
  info.innerHTML = `<span>front ${pointers.frontId ? `→ #${pointers.frontId.slice(0, 6)}` : '= nullptr'}</span><span>rear ${pointers.rearId ? `→ #${pointers.rearId.slice(0, 6)}` : '= nullptr'}</span>`;
  wrap.appendChild(info);

  vizArea.appendChild(wrap);
}

window.QUEUE_POINTER = {
  enqueue: qpEnqueue,
  dequeue: qpDequeue,
  front: qpFront,
  render: qpRender,
  makeInitial: (values) => values.map((v) => ({ id: qpId(), value: v })),
};
