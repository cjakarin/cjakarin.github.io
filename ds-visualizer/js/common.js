// ============ Common utilities for all DS visualizer pages ============

// --- SVG icons (inline) ---
const ICONS = {
  plus: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  eye: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  play: '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pause: '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  skipBack: '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>',
  skipFwd: '<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>',
  back: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  info: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  listChecks: '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  layers: '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  arrowRight: '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowUp: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  logout: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  refresh: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  rotate: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  fileCode: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
};

// --- DOM helpers ---
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.setAttribute('style', v);
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      // Convert onClick → click, onMouseDown → mousedown, etc.
      e.addEventListener(k.slice(2).toLowerCase(), v);
    }
    else if (v !== null && v !== undefined) e.setAttribute(k, v);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null || c === false) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

function clearChildren(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

// --- ID generator that won't collide across rapid ops ---
let idCounter = 0;
function makeId(prefix = 'n') {
  idCounter += 1;
  return `${prefix}${idCounter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ============ Playback Controller ============
//
// Manages: steps[], currentStepIndex, isPlaying, speed.
// Calls renderer(step) whenever the visible step changes.
// Calls onComplete() when playback finishes naturally.

class Playback {
  constructor({ renderer, onComplete, speed = 700 }) {
    this.renderer = renderer;
    this.onComplete = onComplete;
    this.speed = speed;
    this.steps = [];
    this.index = 0;
    this.isPlaying = false;
    this.timer = null;
    this.onStateChange = null; // callback to update UI buttons
  }

  load(steps) {
    this.stop();
    this.steps = steps;
    this.index = 0;
    this.render();
    this._notify();
  }

  play() {
    if (this.steps.length === 0) return;
    if (this.index >= this.steps.length - 1) this.index = 0;
    this.isPlaying = true;
    this._notify();
    this._scheduleNext();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this._notify();
  }

  stop() {
    this.pause();
  }

  stepForward() {
    this.pause();
    if (this.index < this.steps.length - 1) {
      this.index++;
      this.render();
      this._notify();
    }
  }

  stepBack() {
    this.pause();
    if (this.index > 0) {
      this.index--;
      this.render();
      this._notify();
    }
  }

  setSpeed(ms) {
    this.speed = ms;
    if (this.isPlaying) {
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      this._scheduleNext();
    }
  }

  current() {
    return this.steps[this.index] || null;
  }

  render() {
    const step = this.current();
    if (step && this.renderer) this.renderer(step);
  }

  _scheduleNext() {
    if (!this.isPlaying) return;
    const atLast = this.index >= this.steps.length - 1;
    const delay = atLast ? Math.min(this.speed, 400) : this.speed;
    this.timer = setTimeout(() => {
      if (atLast) {
        this.isPlaying = false;
        this._notify();
        if (this.onComplete) this.onComplete();
      } else {
        this.index++;
        this.render();
        this._notify();
        this._scheduleNext();
      }
    }, delay);
  }

  _notify() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        index: this.index,
        total: this.steps.length,
        canStep: this.steps.length > 0,
        atLast: this.index >= this.steps.length - 1,
      });
    }
  }
}

// ============ Code Panel renderer with simple C++ syntax highlight ============

const CPP_KEYWORDS = new Set([
  'class', 'struct', 'public', 'private', 'protected', 'void', 'int', 'bool',
  'char', 'double', 'float', 'long', 'short', 'unsigned', 'signed', 'const',
  'return', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'break',
  'continue', 'new', 'delete', 'nullptr', 'true', 'false', 'using', 'namespace',
  'template', 'typename', 'this', 'virtual', 'override', 'static', 'sizeof',
]);

function tokenizeCppLine(line) {
  // Returns an array of { type, text } tokens
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);

    // comment
    if (rest.startsWith('//')) {
      tokens.push({ type: 'com', text: rest });
      break;
    }
    // string
    if (rest[0] === '"') {
      const m = rest.match(/^"[^"]*"/);
      if (m) { tokens.push({ type: 'str', text: m[0] }); i += m[0].length; continue; }
    }
    // char literal
    if (rest[0] === "'" && rest.length >= 3) {
      const m = rest.match(/^'[^']*'/);
      if (m) { tokens.push({ type: 'str', text: m[0] }); i += m[0].length; continue; }
    }
    // preprocessor
    if (rest[0] === '#') {
      const m = rest.match(/^#\w+/);
      if (m) { tokens.push({ type: 'kw', text: m[0] }); i += m[0].length; continue; }
    }
    // number
    const numMatch = rest.match(/^\d[\d.xXa-fA-F]*/);
    if (numMatch) { tokens.push({ type: 'num', text: numMatch[0] }); i += numMatch[0].length; continue; }

    // identifier
    const idMatch = rest.match(/^[A-Za-z_]\w*/);
    if (idMatch) {
      const w = idMatch[0];
      if (CPP_KEYWORDS.has(w)) tokens.push({ type: 'kw', text: w });
      else if (w === 'Node' || w === 'ArrayList' || w === 'LinkedList' || w === 'ArrayStack' || w === 'PointerStack' || w === 'ArrayQueue' || w === 'PointerQueue') tokens.push({ type: 'type', text: w });
      else if (line[i + w.length] === '(') tokens.push({ type: 'fn', text: w });
      else tokens.push({ type: 'id', text: w });
      i += w.length;
      continue;
    }

    // operator/punct
    const opMatch = rest.match(/^(->|::|<<|>>|==|!=|<=|>=|&&|\|\||\+\+|--|[-+*/%=<>!&|^~?:,;.(){}\[\]])/);
    if (opMatch) {
      tokens.push({ type: 'pun', text: opMatch[0] });
      i += opMatch[0].length;
      continue;
    }

    // whitespace/other
    tokens.push({ type: 'id', text: rest[0] });
    i++;
  }
  return tokens;
}

function renderCodePanel(container, source, activeLines = []) {
  clearChildren(container);
  const lines = source.code.split('\n');

  // header
  const header = el('div', { class: 'code-panel-header' });
  header.appendChild(el('span', { html: ICONS.fileCode.replace('icon-sm', 'icon-xs') }));
  header.appendChild(el('span', {}, source.title));
  header.appendChild(el('span', { class: 'filename' }, source.fileName));
  container.appendChild(header);

  // code block
  const block = el('pre', { class: 'code-block' });
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const lineEl = el('span', { class: 'code-line' + (activeLines.includes(lineNum) ? ' active' : '') });
    if (line.length === 0) {
      lineEl.appendChild(el('span', {}, '\u00a0'));
    } else {
      const tokens = tokenizeCppLine(line);
      for (const t of tokens) {
        lineEl.appendChild(el('span', { class: `tok-${t.type}` }, t.text));
      }
    }
    block.appendChild(lineEl);
  });
  container.appendChild(block);
}

// ============ Step Description renderer ============

function renderStepDescription(container, step, index, total) {
  // Appends (does NOT clear) the step description box to container
  const desc = el('div', { class: 'step-desc' });
  desc.appendChild(el('div', { class: 'step-num' }, String(index + 1)));

  const body = el('div', { class: 'step-body' });
  const meta = el('div', { class: 'step-meta' });
  if (step && step.phase) {
    meta.appendChild(el('span', { class: 'step-phase' }, step.phase));
  }
  meta.appendChild(el('span', { class: 'step-counter' }, `step ${index + 1} / ${total}`));
  body.appendChild(meta);

  body.appendChild(el('p', { class: 'step-text' }, step ? step.description : 'พร้อมเริ่ม — เลือก operation จากด้านซ้าย'));
  desc.appendChild(body);
  container.appendChild(desc);
}

// ============ Console output renderer ============

function renderConsoleBlock(container, step) {
  // Appends a console box to container
  const wrap = el('div', { style: 'flex:1;display:flex;flex-direction:column;min-height:0' });
  const label = el('div', { class: 'console-label' });
  label.appendChild(el('span', { html: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>' }));
  label.appendChild(document.createTextNode(' Console Output'));
  wrap.appendChild(label);

  const box = el('div', { class: 'console-box' });
  if (step && step.consoleOutput) {
    const line = el('div', { class: 'console-line' });
    line.appendChild(el('span', { class: 'console-prompt' }, '>'));
    line.appendChild(el('span', {}, step.consoleOutput));
    box.appendChild(line);
  } else {
    const line = el('div', { class: 'console-line empty' });
    line.appendChild(el('span', {}, 'ผลลัพธ์จะปรากฏที่นี่...'));
    box.appendChild(line);
  }
  wrap.appendChild(box);
  container.appendChild(wrap);
}

// Convenience: render both step description + console into a container,
// clearing it first. Used by all view pages.
function renderDescAndConsole(container, step, index, total) {
  clearChildren(container);
  renderStepDescription(container, step, index, total);
  renderConsoleBlock(container, step);
}

// ============ Header builder ============

function buildHeader({ title, subtitle, iconHtml, iconClass, backHref = 'index.html' }) {
  const header = el('header', { class: 'app-header' });
  const container = el('div', { class: 'container' });

  const left = el('div', { class: 'header-left' });
  const backBtn = el('a', { class: 'btn-back', href: backHref });
  backBtn.innerHTML = ICONS.back;
  backBtn.appendChild(document.createTextNode(' เมนู'));
  left.appendChild(backBtn);

  const icon = el('div', { class: `header-icon ${iconClass}`, html: iconHtml });
  left.appendChild(icon);

  const titleWrap = el('div');
  titleWrap.appendChild(el('h1', { class: 'header-title' }, title));
  if (subtitle) {
    titleWrap.appendChild(el('p', { class: 'header-sub hidden-mobile' }, subtitle));
  }
  left.appendChild(titleWrap);
  container.appendChild(left);

  header.appendChild(container);
  return header;
}

// ============ Footer builder ============

function buildFooter(note = 'เนื้อหาเพื่อการศึกษา · ใช้ฟรี') {
  const footer = el('footer', { class: 'app-footer' });
  const container = el('div', { class: 'container' });
  container.appendChild(el('p', { html: '<span style="font-weight:600">Data Structure Visualizer</span> · HTML + JavaScript · C++ Syntax Highlight' }));
  container.appendChild(el('p', { class: 'mono' }, note));
  footer.appendChild(container);
  return footer;
}

// ============ Operations panel builder (shared skeleton) ============
//
// Config shape:
// {
//   sections: [
//     {
//       title, barColor ('emerald'|'rose'|'amber'|'violet'),
//       inputs: [{ type: 'number'|'select', id, label?, placeholder?, options? }],
//       buttons: [{ label, icon, kind, onClick, tall? }],
//     }
//   ],
//   playback: { speed, onSpeedChange, onPlay, onPause, onStepForward, onStepBack, isPlaying, canStep },
//   onClear, onReset
// }

function buildOpsPanel(config) {
  const panel = el('div', { class: 'ops-panel' });

  // sections
  for (const section of config.sections) {
    const sec = el('section', { class: 'ops-section' });
    const title = el('div', { class: 'ops-section-title' });
    title.appendChild(el('div', { class: `ops-section-bar ${section.barColor || 'emerald'}` }));
    title.appendChild(el('h3', {}, section.title));
    sec.appendChild(title);

    for (const input of section.inputs || []) {
      if (input.type === 'number') {
        const inp = el('input', {
          type: 'number',
          class: 'input',
          id: input.id,
          placeholder: input.placeholder || '',
          value: input.value != null ? String(input.value) : '',
        });
        inp.addEventListener('input', () => input.onChange && input.onChange(inp.value));
        sec.appendChild(inp);
      } else if (input.type === 'select') {
        const sel = el('select', { class: 'select', id: input.id });
        for (const opt of input.options) {
          const o = el('option', { value: opt.value }, opt.label);
          if (opt.value === input.value) o.selected = true;
          sel.appendChild(o);
        }
        sel.addEventListener('change', () => input.onChange && input.onChange(sel.value));
        sec.appendChild(sel);
      }
    }

    if (section.buttons && section.buttons.length === 3) {
      const grid = el('div', { class: 'btn-grid-3' });
      for (const b of section.buttons) {
        const btn = el('button', {
          class: `btn ${b.kind || ''} ${b.tall ? 'btn-tall' : ''}`,
          onClick: b.onClick,
        });
        btn.innerHTML = b.icon || '';
        btn.appendChild(el('span', {}, b.label));
        grid.appendChild(btn);
      }
      sec.appendChild(grid);
    } else if (section.buttons && section.buttons.length === 2) {
      const grid = el('div', { class: 'btn-grid-2' });
      for (const b of section.buttons) {
        const btn = el('button', {
          class: `btn ${b.kind || ''} ${b.tall ? 'btn-tall' : ''}`,
          onClick: b.onClick,
        });
        btn.innerHTML = b.icon || '';
        btn.appendChild(el('span', {}, b.label));
        grid.appendChild(btn);
      }
      sec.appendChild(grid);
    } else if (section.buttons) {
      for (const b of section.buttons) {
        const btn = el('button', {
          class: `btn ${b.kind || ''} ${b.tall ? 'btn-tall' : ''}`,
          onClick: b.onClick,
          style: 'width:100%',
        });
        btn.innerHTML = b.icon || '';
        btn.appendChild(el('span', {}, b.label));
        sec.appendChild(btn);
      }
    }

    panel.appendChild(sec);
  }

  // playback section
  if (config.playback) {
    const pb = config.playback;
    const sec = el('section', { class: 'ops-section' });
    sec.style.borderTop = '1px solid var(--border)';
    sec.style.paddingTop = '8px';

    const title = el('div', { class: 'ops-section-title' });
    title.appendChild(el('div', { class: 'ops-section-bar violet' }));
    title.appendChild(el('h3', {}, 'PLAYBACK'));
    sec.appendChild(title);

    const grid = el('div', { class: 'btn-grid-4' });
    const back = el('button', { class: 'btn', id: 'pb-back' });
    back.innerHTML = ICONS.skipBack;

    const playBtn = el('button', { class: 'btn', id: 'pb-play', style: 'grid-column: span 2' });
    playBtn.innerHTML = ICONS.play;
    playBtn.appendChild(el('span', {}, 'Play'));

    const fwd = el('button', { class: 'btn', id: 'pb-fwd' });
    fwd.innerHTML = ICONS.skipFwd;

    grid.appendChild(back);
    grid.appendChild(playBtn);
    grid.appendChild(fwd);
    sec.appendChild(grid);

    back.addEventListener('click', () => pb.onStepBack && pb.onStepBack());
    fwd.addEventListener('click', () => pb.onStepForward && pb.onStepForward());
    playBtn.addEventListener('click', () => {
      if (pb.isPlaying) { pb.onPause && pb.onPause(); }
      else { pb.onPlay && pb.onPlay(); }
    });
    // expose for state updates
    sec._playBtn = playBtn;
    sec._backBtn = back;
    sec._fwdBtn = fwd;

    // speed slider
    const sliderRow = el('div', { class: 'slider-row' });
    const labelRow = el('div', { class: 'slider-label-row' });
    labelRow.appendChild(el('span', {}, 'ความเร็วแอนิเมชัน'));
    const speedTxt = el('span', { class: 'mono' }, `${(1000 / pb.speed).toFixed(1)} step/s`);
    labelRow.appendChild(speedTxt);
    sliderRow.appendChild(labelRow);
    const slider = el('input', { type: 'range', min: '100', max: '2000', step: '50', value: String(pb.speed) });
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      speedTxt.textContent = `${(1000 / v).toFixed(1)} step/s`;
      pb.onSpeedChange && pb.onSpeedChange(v);
    });
    sliderRow.appendChild(slider);
    sliderRow.appendChild(el('div', { class: 'slider-label-row' }, [el('span', {}, 'เร็ว'), el('span', {}, 'ช้า')]));
    sec.appendChild(sliderRow);

    // clear/reset
    const resetGrid = el('div', { class: 'btn-grid-2', style: 'padding-top: 4px' });
    const clearBtn = el('button', { class: 'btn btn-ghost' });
    clearBtn.innerHTML = ICONS.trash;
    clearBtn.appendChild(el('span', {}, 'ล้าง'));
    clearBtn.addEventListener('click', () => config.onClear && config.onClear());
    resetGrid.appendChild(clearBtn);

    const sampleBtn = el('button', { class: 'btn btn-ghost' });
    sampleBtn.innerHTML = ICONS.rotate;
    sampleBtn.appendChild(el('span', {}, 'ตัวอย่าง'));
    sampleBtn.addEventListener('click', () => config.onReset && config.onReset());
    resetGrid.appendChild(sampleBtn);
    sec.appendChild(resetGrid);

    panel.appendChild(sec);
    panel._playbackSection = sec;
  }

  return panel;
}

// Update playback button state based on Playback state
function updatePlaybackUI(panel, state) {
  if (!panel._playbackSection) return;
  const sec = panel._playbackSection;
  const playBtn = sec._playBtn;
  if (state.isPlaying) {
    playBtn.classList.add('btn-purple');
    playBtn.innerHTML = ICONS.pause;
    playBtn.appendChild(el('span', {}, 'Pause'));
  } else {
    playBtn.classList.remove('btn-purple');
    playBtn.innerHTML = ICONS.play;
    playBtn.appendChild(el('span', {}, 'Play'));
  }
  sec._backBtn.disabled = !state.canStep;
  sec._fwdBtn.disabled = !state.canStep;
  playBtn.disabled = !state.canStep;
}

// ============ Legend renderer ============

function renderLegend(container, items) {
  clearChildren(container);
  const title = el('div', { class: 'ops-section-title', style: 'margin-bottom:12px' });
  title.appendChild(el('div', { class: 'ops-section-bar', style: 'background:var(--text-muted)' }));
  title.appendChild(el('h3', { style: 'font-size:13px;font-weight:600' }, 'คำอธิบายสี'));
  container.appendChild(title);

  const grid = el('div', { class: 'legend-grid' });
  for (const item of items) {
    const it = el('div', { class: 'legend-item' });
    it.appendChild(el('div', { class: 'legend-color', style: `background:${item.color}` }));
    const txt = el('div');
    txt.appendChild(el('div', { class: 'legend-label' }, item.label));
    txt.appendChild(el('div', { class: 'legend-desc' }, item.desc));
    it.appendChild(txt);
    grid.appendChild(it);
  }
  container.appendChild(grid);
}

// ============ Visualization helpers ============

function makePointerChip(text, kind) {
  return el('div', { class: `pointer-chip ${kind}` }, text);
}

function makeNodeBox({ value, role, idxLabel, showIdx = true, metaContent, id }) {
  const node = el('div', { class: `node ${role ? 'node-role-' + role : ''}` });
  if (id) node.dataset.id = id;
  if (showIdx && idxLabel != null) {
    node.appendChild(el('div', { class: 'node-idx' }, String(idxLabel)));
  }
  node.appendChild(el('div', { class: 'node-cell-data' }, String(value)));
  if (metaContent != null) {
    const meta = el('div', { class: 'node-cell-meta' });
    if (typeof metaContent === 'string') meta.innerHTML = metaContent;
    else meta.appendChild(metaContent);
    node.appendChild(meta);
  }
  return node;
}

function makeArrowConnector(toNull = false) {
  const wrap = el('div', { class: 'arrow-connector' });
  wrap.appendChild(el('div', { class: 'arrow-line' }));
  wrap.appendChild(el('div', { class: 'arrow-tip' }));
  if (toNull) {
    wrap.appendChild(el('div', { class: 'arrow-null' }, 'NULL'));
  }
  return wrap;
}

// Export to window
window.DS = {
  ICONS,
  el,
  clearChildren,
  makeId,
  Playback,
  renderCodePanel,
  renderStepDescription,
  renderConsoleBlock,
  renderDescAndConsole,
  buildHeader,
  buildFooter,
  buildOpsPanel,
  updatePlaybackUI,
  renderLegend,
  makePointerChip,
  makeNodeBox,
  makeArrowConnector,
};
