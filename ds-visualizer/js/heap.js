// ============ Binary Heap / Priority Queue (Min-Heap) ============
//
// Visual: tree (top) + array (bottom), with parent/child pointers
// Operations: insert (heapify-up), extractMin (heapify-down)

const HEAP_DEFAULT = [50, 30, 40, 10, 20, 35, 25];

let heapIdCounter = 0;
function heapId() {
  heapIdCounter += 1;
  return `hp${heapIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function heapBase(operation, arr, description, codeLines, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    nodes: arr.map((n) => ({ ...n })),
    roles: { ...roles },
    pointers: { ...pointers },
    consoleOutput, phase,
  };
}

function parentIdx(i) { return Math.floor((i - 1) / 2); }
function leftIdx(i) { return 2 * i + 1; }
function rightIdx(i) { return 2 * i + 2; }

function heapInsert(arr, value) {
  const steps = [];
  const newId = heapId();
  const newNode = { id: newId, value };

  steps.push(heapBase('insert', arr,
    `เริ่ม insert(${value}) — เพิ่ม Node ใหม่ที่ท้าย array`, [1, 2],
    {}, { current: null, parent: null, swap: null }, undefined, 'เริ่มต้น'));

  // Step 1: append
  const newArr = [...arr, newNode];
  let i = newArr.length - 1;
  steps.push(heapBase('insert', newArr,
    `เพิ่ม Node ${value} ที่ตำแหน่ง index ${i} (ท้าย array)`, [2],
    { [newId]: 'new' }, { current: i, parent: null, swap: null }, undefined, 'append'));

  // Step 2: heapify-up
  while (i > 0) {
    const p = parentIdx(i);
    const parentNode = newArr[p];
    const curNode = newArr[i];

    steps.push(heapBase('insert', newArr,
      `heapify-up: เปรียบเทียบ arr[${i}]=${curNode.value} กับ parent arr[${p}]=${parentNode.value}`,
      [3, 4],
      { [curNode.id]: 'current', [parentNode.id]: 'prev' },
      { current: i, parent: p, swap: null }, undefined, 'เปรียบเทียบ parent'));

    if (curNode.value < parentNode.value) {
      // swap
      steps.push(heapBase('insert', newArr,
        `${curNode.value} < ${parentNode.value} → สลับ (swap กับ parent)`,
        [5, 6],
        { [curNode.id]: 'target', [parentNode.id]: 'current' },
        { current: i, parent: p, swap: 'up' }, undefined, 'สลับขึ้น'));

      // apply swap
      const swapped = newArr.map((n, idx) => {
        if (idx === i) return { ...parentNode };
        if (idx === p) return { ...curNode };
        return n;
      });
      newArr.splice(0, newArr.length, ...swapped);
      i = p;
      steps.push(heapBase('insert', newArr,
        `หลัง swap: ตอนนี้ ${curNode.value} อยู่ที่ index ${p}`, [],
        { [parentNode.id]: 'current' }, { current: i, parent: null, swap: null },
        undefined, 'หลัง swap'));
    } else {
      steps.push(heapBase('insert', newArr,
        `${curNode.value} >= ${parentNode.value} → หยุด heapify-up (ไม่สลับ)`,
        [4, 7],
        { [curNode.id]: 'found' }, { current: i, parent: p, swap: null },
        `insert(${value}) → สำเร็จ`, 'เสร็จสิ้น'));
      return steps;
    }
  }

  steps.push(heapBase('insert', newArr,
    `i == 0 → ถึง root แล้ว หยุด heapify-up`,
    [3, 7],
    { [newArr[0].id]: 'found' }, { current: 0, parent: null, swap: null },
    `insert(${value}) → สำเร็จ (root)`, 'เสร็จสิ้น'));
  return steps;
}

function heapExtractMin(arr) {
  const steps = [];

  steps.push(heapBase('extractMin', arr,
    `เริ่ม extractMin() — คืนค่า root (min)`, [1],
    arr.length > 0 ? { [arr[0].id]: 'target' } : {},
    { current: 0, parent: null, swap: null }, undefined, 'เริ่มต้น'));

  if (arr.length === 0) {
    steps.push(heapBase('extractMin', arr,
      `array ว่าง → คืน error (heap underflow)`, [1, 2],
      {}, { current: null },
      `extractMin() → Heap Empty`, 'Underflow'));
    return steps;
  }

  const minNode = arr[0];
  const lastNode = arr[arr.length - 1];
  steps.push(heapBase('extractMin', arr,
    `min = arr[0] = ${minNode.value}  เก็บไว้เพื่อ return`, [2, 3],
    { [minNode.id]: 'removing' }, { current: 0 }, undefined, 'เก็บ min'));

  if (arr.length === 1) {
    const empty = [];
    steps.push(heapBase('extractMin', empty,
      `array มี 1 element → ลบออก → คืนค่า ${minNode.value}`,
      [4, 5, 9], {}, { current: null },
      `extractMin() → คืนค่า ${minNode.value}`, 'เสร็จสิ้น'));
    return steps;
  }

  // Move last to root
  const afterMove = [lastNode, ...arr.slice(0, -1)];
  steps.push(heapBase('extractMin', afterMove,
    `ย้าย element สุดท้าย (${lastNode.value}) ไปที่ root`, [4, 5],
    { [lastNode.id]: 'new' }, { current: 0 }, undefined, 'ย้าย last → root'));

  // heapify-down
  let i = 0;
  let heap = afterMove;
  while (true) {
    const l = leftIdx(i);
    const r = rightIdx(i);
    let smallest = i;

    steps.push(heapBase('extractMin', heap,
      `heapify-down: ตรวจ arr[${i}]=${heap[i].value} เทียบกับ children (left=${l < heap.length ? heap[l].value : '-'}, right=${r < heap.length ? heap[r].value : '-'})`,
      [6, 7, 8, 9],
      { [heap[i].id]: 'current' }, { current: i, parent: null, swap: null },
      undefined, 'หา smallest'));

    if (l < heap.length && heap[l].value < heap[smallest].value) smallest = l;
    if (r < heap.length && heap[r].value < heap[smallest].value) smallest = r;

    if (smallest === i) {
      steps.push(heapBase('extractMin', heap,
        `arr[${i}]=${heap[i].value} <= ทุก child → หยุด heapify-down`,
        [10, 11],
        { [heap[i].id]: 'found' }, { current: i },
        `extractMin() → คืนค่า ${minNode.value}`, 'เสร็จสิ้น'));
      return steps;
    }

    steps.push(heapBase('extractMin', heap,
      `arr[${smallest}]=${heap[smallest].value} < arr[${i}]=${heap[i].value} → สลับลง`,
      [10],
      { [heap[i].id]: 'current', [heap[smallest].id]: 'target' },
      { current: i, parent: smallest, swap: 'down' }, undefined, 'สลับลง'));

    // apply swap
    const swapped = heap.map((n, idx) => {
      if (idx === i) return { ...heap[smallest] };
      if (idx === smallest) return { ...heap[i] };
      return n;
    });
    heap = swapped;
    i = smallest;
    steps.push(heapBase('extractMin', heap,
      `หลัง swap: ตอนนี้ ${heap[i].value} อยู่ที่ index ${i}`, [],
      { [heap[i].id]: 'current' }, { current: i }, undefined, 'หลัง swap'));
  }
}

// Render: tree (top) + array (bottom)
function heapRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const arr = step.nodes;
  const roles = step.roles;
  const p = step.pointers;

  if (vizMeta) {
    vizMeta.textContent = `size = ${arr.length}${arr.length > 0 ? ` · min = ${arr[0].value}` : ' · (empty)'}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:24px;padding:16px;align-items:center;min-width:max-content' });

  // ===== Tree view =====
  if (arr.length > 0) {
    const treeWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:8px' });
    const levels = Math.ceil(Math.log2(arr.length + 1));
    const levelStarts = [];
    for (let lv = 0; lv < levels; lv++) {
      const start = Math.pow(2, lv) - 1;
      const end = Math.min(Math.pow(2, lv + 1) - 1, arr.length);
      levelStarts.push({ start, end });
    }

    // SVG lines
    const svgWidth = Math.pow(2, levels) * 60;
    const svgHeight = levels * 80;
    const svg = window.DS.el('svg', { width: String(svgWidth), height: String(svgHeight) });
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';

    // Compute node positions
    const positions = [];
    levelStarts.forEach(({ start, end }, lv) => {
      const count = end - start;
      const levelSpacing = svgWidth / (count + 1);
      for (let i = 0; i < count; i++) {
        const idx = start + i;
        const x = levelSpacing * (i + 1);
        const y = lv * 80 + 30;
        positions[idx] = { x, y };
      }
    });

    // Draw edges
    for (let i = 1; i < arr.length; i++) {
      const pIdx = parentIdx(i);
      if (positions[i] && positions[pIdx]) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(positions[pIdx].x));
        line.setAttribute('y1', String(positions[pIdx].y + 18));
        line.setAttribute('x2', String(positions[i].x));
        line.setAttribute('y2', String(positions[i].y - 18));
        line.setAttribute('stroke', 'var(--text-dim)');
        line.setAttribute('stroke-width', '1.5');
        svg.appendChild(line);
      }
    }

    const treeContainer = window.DS.el('div', { style: 'position:relative;width:' + svgWidth + 'px;height:' + svgHeight + 'px' });
    treeContainer.appendChild(svg);

    // Draw nodes
    arr.forEach((node, idx) => {
      if (!positions[idx]) return;
      const pos = positions[idx];
      const role = roles[node.id] || '';
      const isCurrent = p.current === idx;
      const isParent = p.parent === idx;

      const nodeWrap = window.DS.el('div', {
        style: `position:absolute;left:${pos.x - 30}px;top:${pos.y - 18}px;width:60px;display:flex;flex-direction:column;align-items:center`,
      });

      // Pointer chips
      const chips = window.DS.el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap;justify-content:center;min-height:14px' });
      if (isCurrent) chips.appendChild(window.DS.makePointerChip('cur', 'current'));
      if (isParent) chips.appendChild(window.DS.makePointerChip('par', 'prev'));
      if (role === 'new') chips.appendChild(window.DS.makePointerChip('new', 'new'));
      if (role === 'target') chips.appendChild(window.DS.makePointerChip('swap', 'target'));
      if (role === 'found') chips.appendChild(window.DS.makePointerChip('done', 'found'));
      if (role === 'removing') chips.appendChild(window.DS.makePointerChip('del', 'removing'));
      nodeWrap.appendChild(chips);

      // Node circle
      const circle = window.DS.el('div', {
        class: `node ${role ? 'node-role-' + role : ''}`,
        style: 'border-radius:50%;width:48px;height:48px;padding:0;justify-content:center;align-items:center;display:flex',
      });
      circle.appendChild(window.DS.el('div', {
        class: 'node-cell-data',
        style: 'padding:0;font-size:14px;min-width:0',
      }, String(node.value)));
      nodeWrap.appendChild(circle);

      // Index label
      nodeWrap.appendChild(window.DS.el('div', {
        style: 'font-size:10px;font-family:monospace;color:var(--text-muted);margin-top:2px',
      }, `[${idx}]`));

      treeContainer.appendChild(nodeWrap);
    });

    treeWrap.appendChild(treeContainer);
    wrap.appendChild(treeWrap);
  } else {
    wrap.appendChild(window.DS.el('div', {
      style: 'color:var(--text-muted);font-family:monospace;font-size:13px;padding:20px',
    }, 'Heap ว่าง'));
  }

  // ===== Array view =====
  const arrayWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;max-width:800px' });
  arrayWrap.appendChild(window.DS.el('div', {
    style: 'font-size:11px;color:var(--text-muted);font-family:monospace;text-align:center',
  }, 'Array representation:'));

  if (arr.length > 0) {
    const row = window.DS.el('div', { style: 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap' });
    arr.forEach((node, idx) => {
      const role = roles[node.id] || '';
      const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
      const chips = window.DS.el('div', { style: 'display:flex;gap:2px;min-height:12px' });
      if (p.current === idx) chips.appendChild(window.DS.makePointerChip('i', 'current'));
      if (p.parent === idx) chips.appendChild(window.DS.makePointerChip('p', 'prev'));
      cellWrap.appendChild(chips);
      cellWrap.appendChild(window.DS.makeNodeBox({ value: node.value, role, idxLabel: idx }));
      row.appendChild(cellWrap);
    });
    arrayWrap.appendChild(row);
  }

  wrap.appendChild(arrayWrap);
  vizArea.appendChild(wrap);
}

window.HEAP = {
  insert: heapInsert,
  extractMin: heapExtractMin,
  render: heapRender,
  makeInitial: (values = HEAP_DEFAULT) => values.map((v) => ({ id: heapId(), value: v })),
};
