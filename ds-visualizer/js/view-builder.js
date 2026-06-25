// Shared page-builder for view pages (LL/Stack/Queue × Array/Pointer)
// Builds the standard 2-column layout: ops panel on left, viz+code on right.

function buildViewPage({
  title,
  subtitle,
  iconHtml,
  iconClass,
  opsConfig,
  vizRenderer,      // function(step) — renders the visualization
  legendItems,
  initialSpeed = 700,
  // The page-specific engine must implement:
  //   runOperation(opKind) — sets steps via playback.load(steps)
  //   clearAll()
  //   resetSample()
  // It returns { playback, getState }
}) {
  // Set up document body
  document.body.innerHTML = '';
  document.body.appendChild(window.DS.buildHeader({
    title, subtitle, iconHtml, iconClass, backHref: 'index.html',
  }));

  const main = window.DS.el('main', { class: 'app-main' });
  const container = window.DS.el('div', { class: 'container' });
  const grid = window.DS.el('div', { class: 'layout-grid' });

  // Left: operations panel
  const aside = window.DS.el('aside', { class: 'ops-panel-wrapper' });
  const opsCard = window.DS.el('div', { class: 'card' });
  const opsPanel = window.DS.buildOpsPanel(opsConfig);
  opsCard.appendChild(opsPanel);
  aside.appendChild(opsCard);
  grid.appendChild(aside);

  // Right: viz + step desc + code panel
  const right = window.DS.el('div', { style: 'display:flex;flex-direction:column;gap:24px;min-width:0' });

  // Visualization card
  const vizCard = window.DS.el('div', { class: 'card', style: 'position:relative;overflow:hidden' });
  const vizHeader = window.DS.el('div', { class: 'card-header' });
  vizHeader.appendChild(window.DS.el('h2', { style: 'font-size:13px;font-weight:600' }, 'การแสดงผล'));
  const vizMeta = window.DS.el('span', { class: 'meta', id: 'viz-meta' }, '');
  vizHeader.appendChild(vizMeta);
  vizCard.appendChild(vizHeader);

  const vizArea = window.DS.el('div', { class: 'viz-area', id: 'viz-area' });
  vizCard.appendChild(vizArea);

  const progressBar = window.DS.el('div', { class: 'progress-bar' });
  const progressFill = window.DS.el('div', { class: 'progress-bar-fill', id: 'progress-fill' });
  progressBar.appendChild(progressFill);
  vizCard.appendChild(progressBar);
  right.appendChild(vizCard);

  // Step description + code panel side by side
  const descCodeGrid = window.DS.el('div', { class: 'layout-stack' });

  const descCard = window.DS.el('div', { class: 'card', style: 'min-height:260px;display:flex;flex-direction:column' });
  const descBody = window.DS.el('div', { class: 'card-body', id: 'desc-body', style: 'flex:1;display:flex;flex-direction:column;gap:12px' });
  descCard.appendChild(descBody);
  descCodeGrid.appendChild(descCard);

  const codeCard = window.DS.el('div', { class: 'card', style: 'min-height:260px;overflow:hidden;display:flex;flex-direction:column' });
  const codeBody = window.DS.el('div', { id: 'code-body', style: 'flex:1;display:flex;flex-direction:column;overflow:hidden' });
  codeCard.appendChild(codeBody);
  descCodeGrid.appendChild(codeCard);
  right.appendChild(descCodeGrid);

  // Legend
  const legendCard = window.DS.el('div', { class: 'card' });
  const legendBody = window.DS.el('div', { class: 'card-body', id: 'legend-body' });
  legendCard.appendChild(legendBody);
  right.appendChild(legendCard);

  grid.appendChild(right);
  container.appendChild(grid);
  main.appendChild(container);
  document.body.appendChild(main);

  document.body.appendChild(window.DS.buildFooter());

  // Render legend once
  window.DS.renderLegend(legendBody, legendItems);

  // Return handles
  return {
    vizArea,
    vizMeta,
    progressFill,
    descBody,
    codeBody,
    opsPanel,
  };
}

// Helper to update progress bar width
function setProgress(fill, index, total) {
  if (total <= 0) { fill.style.width = '0%'; return; }
  fill.style.width = `${((index + 1) / total) * 100}%`;
}

window.DS_VIEW = { buildViewPage, setProgress };
