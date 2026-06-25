// ============ Hash Table Visualizers ============
//
// 4 implementations:
//   1. Separate Chaining (linked list per bucket)
//   2. Linear Probing: probe (h+i) % SIZE
//   3. Quadratic Probing: probe (h+i²) % SIZE
//   4. Double Hashing: probe (h + i*h2) % SIZE where h2 = 7 - (key % 7)

const HASH_SIZE = 11; // prime for nice distribution

function hash1(key) {
  return ((key % HASH_SIZE) + HASH_SIZE) % HASH_SIZE;
}
function hash2(key) {
  // For double hashing — never returns 0 (since 7 is prime and key%7 ∈ [0,6])
  return 7 - (((key % 7) + 7) % 7);
}

let hashIdCounter = 0;
function hashId() {
  hashIdCounter += 1;
  return `h${hashIdCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function hashBase(operation, description, codeLines, buckets, roles = {}, pointers = {}, consoleOutput, phase) {
  return {
    operation, description, codeLines,
    buckets: buckets.map((b) => Array.isArray(b) ? b.map((n) => ({ ...n })) : (b ? { ...b } : null)),
    roles: { ...roles },
    pointers: { ...pointers },
    consoleOutput, phase,
  };
}

// ============ Separate Chaining ============
//
// State: array of HASH_SIZE buckets, each bucket = array of {id, key, value}
// Visual: vertical column of buckets, each bucket has chain extending right

function scInsert(buckets, key, value) {
  const steps = [];
  const idx = hash1(key);

  steps.push(hashBase('insert', `เริ่ม insert(${key}, ${value}) — คำนวณ hash(${key}) = ${key} % ${HASH_SIZE} = ${idx}`, [1, 2],
    buckets, {}, { currentBucket: idx, currentChain: null, probeIdx: null },
    undefined, 'คำนวณ hash'));

  steps.push(hashBase('insert', `ไปที่ bucket[${idx}] เพื่อตรวจ chain`, [3],
    buckets, {}, { currentBucket: idx, currentChain: null, probeIdx: null },
    undefined, 'เข้า bucket'));

  const chain = buckets[idx];
  for (let i = 0; i < chain.length; i++) {
    if (chain[i].key === key) {
      steps.push(hashBase('insert', `chain[${i}].key == ${key} → พบ key ซ้ำ → อัปเดต value เป็น ${value}`, [4, 5, 6],
        buckets, { [chain[i].id]: 'found' },
        { currentBucket: idx, currentChain: i, probeIdx: null },
        `update(${key}) → value = ${value}`, 'พบ key ซ้ำ'));
      // Apply update
      const newBuckets = buckets.map((b, bi) => bi === idx ? b.map((n, ni) => ni === i ? { ...n, value } : n) : b);
      steps.push(hashBase('insert', `อัปเดตเสร็จสิ้น`, [],
        newBuckets, { [chain[i].id]: 'found' },
        { currentBucket: idx, currentChain: null, probeIdx: null },
        `update(${key}) → สำเร็จ`, 'เสร็จสิ้น'));
      return steps;
    }
    steps.push(hashBase('insert', `chain[${i}].key = ${chain[i].key} ≠ ${key} → ไปต่อที่ node ถัดไป`, [4],
      buckets, { [chain[i].id]: 'current' },
      { currentBucket: idx, currentChain: i, probeIdx: null },
      undefined, 'เดิน chain'));
  }

  if (chain.length > 0) {
    steps.push(hashBase('insert', `chain สุดท้าย == nullptr → ไม่พบ key ${key} → แทรก Node ใหม่ที่ท้าย chain`, [4, 7, 8],
      buckets, { [chain[chain.length - 1].id]: 'prev' },
      { currentBucket: idx, currentChain: chain.length - 1, probeIdx: null },
      undefined, 'ถึงท้าย chain'));
  } else {
    steps.push(hashBase('insert', `chain ว่าง → แทรก Node ใหม่เป็น node แรกของ bucket`, [4, 7, 8],
      buckets, {},
      { currentBucket: idx, currentChain: null, probeIdx: null },
      undefined, 'bucket ว่าง'));
  }

  const newId = hashId();
  const newNode = { id: newId, key, value };
  const newBuckets = buckets.map((b, bi) => bi === idx ? [...b, newNode] : b);
  steps.push(hashBase('insert', `แทรก Node ใหม่ (key=${key}, value=${value}) ที่ท้าย chain ของ bucket[${idx}]`, [8],
    newBuckets, { [newId]: 'new' },
    { currentBucket: idx, currentChain: newBuckets[idx].length - 1, probeIdx: null },
    `insert(${key}, ${value}) → สำเร็จ (chain ยาว ${newBuckets[idx].length})`, 'เสร็จสิ้น'));

  return steps;
}

function scSearch(buckets, key) {
  const steps = [];
  const idx = hash1(key);

  steps.push(hashBase('search', `เริ่ม search(${key}) — hash(${key}) = ${idx}`, [1, 2],
    buckets, {}, { currentBucket: idx, currentChain: null, probeIdx: null },
    undefined, 'คำนวณ hash'));

  const chain = buckets[idx];
  for (let i = 0; i < chain.length; i++) {
    if (chain[i].key === key) {
      steps.push(hashBase('search', `chain[${i}].key == ${key} → พบ! คืน value = ${chain[i].value}`, [3, 4],
        buckets, { [chain[i].id]: 'found' },
        { currentBucket: idx, currentChain: i, probeIdx: null },
        `search(${key}) → พบ value=${chain[i].value}`, 'พบ'));
      return steps;
    }
    steps.push(hashBase('search', `chain[${i}].key = ${chain[i].key} ≠ ${key} → ไปต่อ`, [3],
      buckets, { [chain[i].id]: 'current' },
      { currentBucket: idx, currentChain: i, probeIdx: null },
      undefined, 'เดิน chain'));
  }

  steps.push(hashBase('search', `chain == nullptr → ไม่พบ key ${key}`, [3, 5],
    buckets, {},
    { currentBucket: idx, currentChain: null, probeIdx: null },
    `search(${key}) → ไม่พบ`, 'ไม่พบ'));
  return steps;
}

function scDelete(buckets, key) {
  const steps = [];
  const idx = hash1(key);

  steps.push(hashBase('delete', `เริ่ม delete(${key}) — hash(${key}) = ${idx}`, [1, 2],
    buckets, {}, { currentBucket: idx, currentChain: null, probeIdx: null },
    undefined, 'คำนวณ hash'));

  const chain = buckets[idx];
  for (let i = 0; i < chain.length; i++) {
    if (chain[i].key === key) {
      steps.push(hashBase('delete', `chain[${i}].key == ${key} → พบ! เตรียมลบ`, [3, 4],
        buckets, { [chain[i].id]: 'removing' },
        { currentBucket: idx, currentChain: i, probeIdx: null },
        undefined, 'พบเป้าหมาย'));
      // Apply delete
      const newBuckets = buckets.map((b, bi) => bi === idx ? b.filter((_, ni) => ni !== i) : b);
      steps.push(hashBase('delete', `ลบ Node (key=${key}) ออกจาก chain → ปรับ next pointer ของ node ก่อนหน้า`, [5, 6],
        newBuckets, {},
        { currentBucket: idx, currentChain: null, probeIdx: null },
        `delete(${key}) → สำเร็จ (chain เหลือ ${newBuckets[idx].length})`, 'เสร็จสิ้น'));
      return steps;
    }
    steps.push(hashBase('delete', `chain[${i}].key = ${chain[i].key} ≠ ${key} → ไปต่อ`, [3],
      buckets, { [chain[i].id]: 'current' },
      { currentBucket: idx, currentChain: i, probeIdx: null },
      undefined, 'เดิน chain'));
  }

  steps.push(hashBase('delete', `chain == nullptr → ไม่พบ key ${key}`, [3, 7],
    buckets, {},
    { currentBucket: idx, currentChain: null, probeIdx: null },
    `delete(${key}) → ไม่พบ`, 'ไม่พบ'));
  return steps;
}

// Render: vertical buckets with chains extending right
function scRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const buckets = step.buckets;
  const roles = step.roles;
  const p = step.pointers;

  if (vizMeta) {
    const total = buckets.reduce((s, b) => s + b.length, 0);
    vizMeta.textContent = `size = ${HASH_SIZE} · ${total} element${total !== 1 ? 's' : ''} · load factor = ${(total / HASH_SIZE).toFixed(2)}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:6px;padding:12px;min-width:max-content' });

  buckets.forEach((chain, idx) => {
    const row = window.DS.el('div', { style: 'display:flex;align-items:center;gap:6px;min-height:48px' });

    // bucket index cell
    const isCurrent = p.currentBucket === idx;
    const bucketCell = window.DS.el('div', {
      class: 'node' + (isCurrent ? ' node-role-current' : ''),
      style: 'min-width:60px;font-family:monospace;font-size:12px;background:var(--bg-elev);',
    });
    bucketCell.appendChild(window.DS.el('div', {
      style: 'padding:8px 12px;text-align:center;color:var(--text-muted);border-right:1px solid var(--border)',
    }, `[${idx}]`));
    bucketCell.appendChild(window.DS.el('div', {
      style: 'padding:8px 12px;font-weight:600;color:' + (isCurrent ? 'var(--amber)' : 'var(--text-muted)'),
    }, chain.length === 0 ? '∅' : `→`));
    row.appendChild(bucketCell);

    // chain nodes
    if (chain.length === 0) {
      row.appendChild(window.DS.el('div', {
        style: 'color:var(--text-dim);font-family:monospace;font-size:11px;padding:8px',
      }, isCurrent ? '(empty chain)' : ''));
    } else {
      chain.forEach((node, ci) => {
        const role = roles[node.id] || '';
        const isCurrentChain = p.currentBucket === idx && p.currentChain === ci;

        const chipsWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
        const chips = window.DS.el('div', { style: 'display:flex;gap:3px;min-height:16px' });
        if (role === 'current') chips.appendChild(window.DS.makePointerChip('cur', 'current'));
        if (role === 'prev') chips.appendChild(window.DS.makePointerChip('prev', 'prev'));
        if (role === 'found') chips.appendChild(window.DS.makePointerChip('พบ', 'found'));
        if (role === 'new') chips.appendChild(window.DS.makePointerChip('new', 'new'));
        if (role === 'removing') chips.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
        chipsWrap.appendChild(chips);

        const box = window.DS.makeNodeBox({
          value: `${node.key}:${node.value}`,
          role,
          idxLabel: ci,
          showIdx: false,
        });
        chipsWrap.appendChild(box);
        row.appendChild(chipsWrap);

        // Arrow to next node
        if (ci < chain.length - 1) {
          const arrow = window.DS.el('div', { class: 'arrow-connector', style: 'color:var(--text-muted)' });
          arrow.appendChild(window.DS.el('div', { class: 'arrow-line', style: 'width:20px' }));
          arrow.appendChild(window.DS.el('div', { class: 'arrow-tip' }));
          row.appendChild(arrow);
        } else {
          // nullptr at end
          row.appendChild(window.DS.el('div', {
            style: 'color:var(--pink);font-family:monospace;font-size:11px;padding:4px 8px;background:var(--bg-muted);border-radius:6px',
          }, 'NULL'));
        }
      });
    }

    wrap.appendChild(row);
  });

  vizArea.appendChild(wrap);
}

window.HASH_CHAINING = {
  insert: scInsert,
  search: scSearch,
  delete: scDelete,
  render: scRender,
  makeInitial: () => {
    const buckets = Array.from({ length: HASH_SIZE }, () => []);
    // Sample data
    [{ k: 15, v: 'A' }, { k: 25, v: 'B' }, { k: 7, v: 'C' }, { k: 36, v: 'D' }].forEach(({ k, v }) => {
      const idx = hash1(k);
      buckets[idx].push({ id: hashId(), key: k, value: v });
    });
    return buckets;
  },
};

// ============ Open Addressing (shared structure) ============
//
// State: array of HASH_SIZE slots, each slot = null (empty) or {id, key, value, deleted?}
// Visual: horizontal row of slots, probe sequence shown as arrows

function oaMakeEmpty() {
  return Array.from({ length: HASH_SIZE }, () => null);
}

function oaProbeIdx(startIdx, i, mode, key) {
  // i = 0, 1, 2, ...
  if (mode === 'linear') return (startIdx + i) % HASH_SIZE;
  if (mode === 'quadratic') return (startIdx + i * i) % HASH_SIZE;
  if (mode === 'double') return (startIdx + i * hash2(key)) % HASH_SIZE;
  return startIdx;
}

function oaProbeFormula(mode, i, key) {
  if (mode === 'linear') return `(h + ${i}) % ${HASH_SIZE}`;
  if (mode === 'quadratic') return `(h + ${i}²) % ${HASH_SIZE}`;
  if (mode === 'double') return `(h + ${i}·${hash2(key)}) % ${HASH_SIZE}`;
  return '';
}

function oaInsert(table, key, value, mode) {
  const steps = [];
  const startIdx = hash1(key);

  steps.push(hashBase('insert',
    `เริ่ม insert(${key}, ${value}) — h = hash(${key}) = ${key} % ${HASH_SIZE} = ${startIdx}`,
    [1, 2], table, {}, { probeStart: startIdx, probeIdx: startIdx, probeI: 0, probePath: [startIdx] },
    undefined, 'คำนวณ hash'));

  for (let i = 0; i < HASH_SIZE; i++) {
    const probeIdx = oaProbeIdx(startIdx, i, mode, key);
    const slot = table[probeIdx];
    const formula = oaProbeFormula(mode, i, key);

    if (!slot || slot.deleted) {
      // Empty or deleted slot — insert here
      steps.push(hashBase('insert',
        `probe ${i}: ${formula} = ${probeIdx} — ช่อง${!slot ? 'ว่าง' : 'ถูกลบ (tombstone)'} → แทรกที่นี่`,
        [3, 4, 5, 6], table,
        { [`slot${probeIdx}`]: 'new' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        undefined, `พบช่อง${!slot ? 'ว่าง' : 'ลบแล้ว'}`));

      // Apply insert
      const newTable = table.slice();
      newTable[probeIdx] = { id: hashId(), key, value, deleted: false };
      steps.push(hashBase('insert',
        `table[${probeIdx}] = (key=${key}, value=${value}) — insert สำเร็จ  ใช้ ${i + 1} ครั้งในการ probe`,
        [], newTable,
        { [`slot${probeIdx}`]: 'found' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `insert(${key}, ${value}) → สำเร็จที่ index ${probeIdx} (${i + 1} probes)`, 'เสร็จสิ้น'));
      return steps;
    }

    if (slot.key === key) {
      // Duplicate key — update
      steps.push(hashBase('insert',
        `probe ${i}: ${formula} = ${probeIdx} — table[${probeIdx}].key == ${key} → พบ key ซ้ำ → อัปเดต value`,
        [3, 4, 7, 8], table,
        { [`slot${probeIdx}`]: 'found' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        undefined, 'พบ key ซ้ำ'));
      const newTable = table.slice();
      newTable[probeIdx] = { ...slot, value };
      steps.push(hashBase('insert',
        `อัปเดต value = ${value} ที่ index ${probeIdx}`,
        [], newTable,
        { [`slot${probeIdx}`]: 'found' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `update(${key}) → value = ${value}`, 'เสร็จสิ้น'));
      return steps;
    }

    // Occupied by different key — continue probing
    steps.push(hashBase('insert',
      `probe ${i}: ${formula} = ${probeIdx} — table[${probeIdx}].key = ${slot.key} ≠ ${key} → ข้ามไปทำ probe ถัดไป`,
      [3, 4, 9], table,
      { [`slot${probeIdx}`]: 'current' },
      { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i + 1, mode, key) },
      undefined, `probe ชน → ข้าม`));
  }

  // Table full
  steps.push(hashBase('insert',
    `probe ครบ ${HASH_SIZE} ครั้ง → ตารางเต็ม → insert ล้มเหลว`,
    [9], table, {},
    { probeStart: startIdx, probeIdx: null, probeI: HASH_SIZE, probePath: [] },
    `insert(${key}, ${value}) → ล้มเหลว (Table Full)`, 'Table Full'));
  return steps;
}

function oaSearch(table, key, mode) {
  const steps = [];
  const startIdx = hash1(key);

  steps.push(hashBase('search',
    `เริ้ม search(${key}) — h = hash(${key}) = ${startIdx}`,
    [1, 2], table, {},
    { probeStart: startIdx, probeIdx: startIdx, probeI: 0, probePath: [startIdx] },
    undefined, 'คำนวณ hash'));

  for (let i = 0; i < HASH_SIZE; i++) {
    const probeIdx = oaProbeIdx(startIdx, i, mode, key);
    const slot = table[probeIdx];
    const formula = oaProbeFormula(mode, i, key);

    if (!slot) {
      // Empty slot — not found
      steps.push(hashBase('search',
        `probe ${i}: ${formula} = ${probeIdx} — ช่องว่าง → ไม่พบ key ${key} (หยุด probe)`,
        [3, 4, 5, 8], table,
        { [`slot${probeIdx}`]: 'target' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `search(${key}) → ไม่พบ`, 'ไม่พบ'));
      return steps;
    }

    if (!slot.deleted && slot.key === key) {
      // Found
      steps.push(hashBase('search',
        `probe ${i}: ${formula} = ${probeIdx} — table[${probeIdx}].key == ${key} → พบ! คืน value = ${slot.value}`,
        [3, 4, 5, 6], table,
        { [`slot${probeIdx}`]: 'found' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `search(${key}) → พบ value=${slot.value}`, 'พบ'));
      return steps;
    }

    // Occupied by different key or tombstone — continue
    const reason = slot.deleted ? 'tombstone (ข้าม)' : `key=${slot.key} ≠ ${key}`;
    steps.push(hashBase('search',
      `probe ${i}: ${formula} = ${probeIdx} — ${reason} → ไป probe ถัดไป`,
      [3, 4, 7], table,
      { [`slot${probeIdx}`]: slot.deleted ? 'removing' : 'current' },
      { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i + 1, mode, key) },
      undefined, `probe ชน → ข้าม`));
  }

  steps.push(hashBase('search',
    `probe ครบ ${HASH_SIZE} ครั้ง → ไม่พบ key ${key}`,
    [7], table, {},
    { probeStart: startIdx, probeIdx: null, probeI: HASH_SIZE, probePath: [] },
    `search(${key}) → ไม่พบ (probe ครบ)`, 'ไม่พบ'));
  return steps;
}

function oaDelete(table, key, mode) {
  const steps = [];
  const startIdx = hash1(key);

  steps.push(hashBase('delete',
    `เริ่ม delete(${key}) — h = hash(${key}) = ${startIdx}`,
    [1, 2], table, {},
    { probeStart: startIdx, probeIdx: startIdx, probeI: 0, probePath: [startIdx] },
    undefined, 'คำนวณ hash'));

  for (let i = 0; i < HASH_SIZE; i++) {
    const probeIdx = oaProbeIdx(startIdx, i, mode, key);
    const slot = table[probeIdx];
    const formula = oaProbeFormula(mode, i, key);

    if (!slot) {
      steps.push(hashBase('delete',
        `probe ${i}: ${formula} = ${probeIdx} — ช่องว่าง → ไม่พบ key ${key}`,
        [3, 4, 5, 9], table,
        { [`slot${probeIdx}`]: 'target' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `delete(${key}) → ไม่พบ`, 'ไม่พบ'));
      return steps;
    }

    if (!slot.deleted && slot.key === key) {
      steps.push(hashBase('delete',
        `probe ${i}: ${formula} = ${probeIdx} — table[${probeIdx}].key == ${key} → พบ! ทำเครื่องหมายเป็น DELETED (tombstone)`,
        [3, 4, 5, 6], table,
        { [`slot${probeIdx}`]: 'removing' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        undefined, 'พบเป้าหมาย'));

      // Apply delete: mark as tombstone
      const newTable = table.slice();
      newTable[probeIdx] = { ...slot, deleted: true };
      steps.push(hashBase('delete',
        `table[${probeIdx}].deleted = true — ทำเครื่องหมายเป็น tombstone (ไม่ได้ลบจริง เพื่อรักษา probe chain)`,
        [6, 7], newTable,
        { [`slot${probeIdx}`]: 'overflow' },
        { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i, mode, key) },
        `delete(${key}) → สำเร็จ (mark as DELETED)`, 'เสร็จสิ้น'));
      return steps;
    }

    const reason = slot.deleted ? 'tombstone (ข้าม)' : `key=${slot.key} ≠ ${key}`;
    steps.push(hashBase('delete',
      `probe ${i}: ${formula} = ${probeIdx} — ${reason} → ไป probe ถัดไป`,
      [3, 4, 8], table,
      { [`slot${probeIdx}`]: slot.deleted ? 'removing' : 'current' },
      { probeStart: startIdx, probeIdx, probeI: i, probePath: getProbePath(startIdx, i + 1, mode, key) },
      undefined, `probe ชน → ข้าม`));
  }

  steps.push(hashBase('delete',
    `probe ครบ ${HASH_SIZE} ครั้ง → ไม่พบ key ${key}`,
    [8], table, {},
    { probeStart: startIdx, probeIdx: null, probeI: HASH_SIZE, probePath: [] },
    `delete(${key}) → ไม่พบ (probe ครบ)`, 'ไม่พบ'));
  return steps;
}

function getProbePath(startIdx, maxI, mode, key) {
  const path = [];
  for (let i = 0; i <= maxI; i++) {
    path.push(oaProbeIdx(startIdx, i, mode, key));
  }
  return path;
}

// Render: horizontal row of slots with probe path arrows
function oaRender(vizArea, vizMeta, step) {
  window.DS.clearChildren(vizArea);
  const table = step.buckets; // array of slots
  const roles = step.roles;
  const p = step.pointers;

  if (vizMeta) {
    const used = table.filter((s) => s && !s.deleted).length;
    const tombs = table.filter((s) => s && s.deleted).length;
    vizMeta.textContent = `size = ${HASH_SIZE} · ${used} used${tombs > 0 ? ` · ${tombs} tombstone` : ''} · load factor = ${(used / HASH_SIZE).toFixed(2)}`;
  }

  const wrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:16px;padding:12px' });

  // Probe path info
  if (p.probeStart != null) {
    const info = window.DS.el('div', { style: 'font-family:monospace;font-size:11px;color:var(--text-muted);text-align:center' });
    const pathStr = (p.probePath || []).map((idx, i) => i === p.probeI ? `[${idx}]←` : `${idx}`).join(' → ');
    info.innerHTML = `<span style="color:var(--amber)">h = ${p.probeStart}</span> · probe path: ${pathStr || '(none)'}`;
    wrap.appendChild(info);
  }

  // Slots row
  const slotsRow = window.DS.el('div', { style: 'display:flex;gap:6px;justify-content:center;flex-wrap:wrap' });

  table.forEach((slot, idx) => {
    const roleKey = `slot${idx}`;
    const role = roles[roleKey] || '';
    const isOnPath = (p.probePath || []).includes(idx);
    const isCurrentProbe = p.probeIdx === idx;
    const isStart = p.probeStart === idx;

    const cellWrap = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });

    // Pointer chips above
    const chips = window.DS.el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px;min-height:28px' });
    const chipRow = window.DS.el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap;justify-content:center' });
    if (isStart) chipRow.appendChild(window.DS.makePointerChip('h', 'current'));
    if (isCurrentProbe && !isStart) chipRow.appendChild(window.DS.makePointerChip('probe', 'target'));
    if (role === 'found') chipRow.appendChild(window.DS.makePointerChip('พบ', 'found'));
    if (role === 'new') chipRow.appendChild(window.DS.makePointerChip('new', 'new'));
    if (role === 'removing') chipRow.appendChild(window.DS.makePointerChip('ลบ', 'removing'));
    if (role === 'overflow') chipRow.appendChild(window.DS.makePointerChip('DELETED', 'overflow'));
    chips.appendChild(chipRow);
    if (chipRow.children.length > 0) {
      chips.appendChild(window.DS.el('div', { class: 'pointer-stem' }));
    }
    cellWrap.appendChild(chips);

    // Slot box
    let bgClass = '';
    if (role) bgClass = `node-role-${role}`;
    else if (isOnPath) bgClass = 'node-role-target';
    else if (slot && !slot.deleted) bgClass = '';
    else bgClass = '';

    const box = window.DS.el('div', {
      class: `node ${bgClass}`,
      style: !slot || slot.deleted
        ? 'border-style:dashed;' + (slot && slot.deleted ? 'opacity:0.6;' : 'opacity:0.5;')
        : '',
    });
    box.appendChild(window.DS.el('div', {
      class: 'node-idx',
      style: isStart ? 'color:var(--amber);font-weight:700' : '',
    }, String(idx)));
    if (!slot) {
      box.appendChild(window.DS.el('div', {
        class: 'node-cell-data',
        style: 'color:var(--text-dim);font-size:14px;min-width:60px',
      }, '∅'));
    } else if (slot.deleted) {
      box.appendChild(window.DS.el('div', {
        class: 'node-cell-data',
        style: 'color:var(--text-muted);font-size:11px;min-width:60px;font-family:monospace',
      }, 'DEL'));
    } else {
      box.appendChild(window.DS.el('div', {
        class: 'node-cell-data',
        style: 'min-width:60px;font-size:13px',
      }, `${slot.key}`));
    }
    cellWrap.appendChild(box);

    // Below: probe order number
    const pathIdx = (p.probePath || []).indexOf(idx);
    const belowLabel = window.DS.el('div', {
      style: 'font-size:10px;font-family:monospace;color:var(--text-muted);min-height:14px;text-align:center',
    }, pathIdx >= 0 ? `#${pathIdx}` : '');
    cellWrap.appendChild(belowLabel);

    slotsRow.appendChild(cellWrap);
  });

  wrap.appendChild(slotsRow);

  // Legend below
  const legend = window.DS.el('div', { style: 'display:flex;gap:16px;font-size:11px;color:var(--text-muted);justify-content:center;flex-wrap:wrap' });
  legend.innerHTML = `
    <span><b style="color:var(--amber)">h</b> = hash ตำแหน่งเริ่มต้น</span>
    <span><b style="color:var(--pink)">probe</b> = ตำแหน่งที่กำลังตรวจ</span>
    <span><b>#0, #1, ...</b> = ลำดับการ probe</span>
    <span><b>∅</b> = ช่องว่าง</span>
    <span><b style="color:var(--rose)">DEL</b> = tombstone (ถูกลบ)</span>
  `;
  wrap.appendChild(legend);

  vizArea.appendChild(wrap);
}

// Factory for open addressing variants
function makeOpenAddressing(mode) {
  return {
    insert: (table, key, value) => oaInsert(table, key, value, mode),
    search: (table, key) => oaSearch(table, key, mode),
    delete: (table, key) => oaDelete(table, key, mode),
    render: oaRender,
    makeInitial: () => {
      const table = oaMakeEmpty();
      // Sample data: spread across the table
      [{ k: 15, v: 'A' }, { k: 25, v: 'B' }, { k: 7, v: 'C' }, { k: 36, v: 'D' }, { k: 4, v: 'E' }].forEach(({ k, v }) => {
        const startIdx = hash1(k);
        // Find empty slot using same probe sequence
        for (let i = 0; i < HASH_SIZE; i++) {
          const probeIdx = oaProbeIdx(startIdx, i, mode, k);
          if (!table[probeIdx]) {
            table[probeIdx] = { id: hashId(), key: k, value: v, deleted: false };
            break;
          }
        }
      });
      return table;
    },
    mode,
  };
}

window.HASH_LINEAR = makeOpenAddressing('linear');
window.HASH_QUADRATIC = makeOpenAddressing('quadratic');
window.HASH_DOUBLE = makeOpenAddressing('double');
