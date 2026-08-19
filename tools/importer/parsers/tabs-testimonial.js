/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (2-column tabs):
 *   Row 1: block name
 *   Row 2..N: one tab per row
 *     Cell 1: tab label  (from .tab-menu .tab-menu-link button — avatar + name + role)
 *     Cell 2: tab content (from .tabs-content .tab-pane — image + name/role + quote)
 *
 * The block decorator turns each row's first cell into the clickable tab and
 * the remainder into the tab panel, so label and content are paired by index.
 */
export default function parse(element, { document }) {
  // Tab labels come from the menu buttons; tab content from the panes.
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, button[id^="tab-"]'));
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));

  const cells = [];
  const count = Math.max(labels.length, panes.length);

  for (let i = 0; i < count; i += 1) {
    const label = labels[i];
    const pane = panes[i];

    // Label cell: use the inner content of the menu button (avatar + name + role).
    let labelCell = '';
    if (label) {
      const inner = Array.from(label.childNodes).filter(
        (n) => !(n.nodeType === 3 && !n.textContent.trim()),
      );
      labelCell = inner.length > 0 ? inner : label;
    }

    // Content cell: the pane's content (image + name/role + quote).
    let contentCell = '';
    if (pane) {
      const inner = Array.from(pane.childNodes).filter(
        (n) => !(n.nodeType === 3 && !n.textContent.trim()),
      );
      contentCell = inner.length > 0 ? inner : pane;
    }

    // Skip fully empty tab rows.
    if (labelCell === '' && contentCell === '') continue;
    cells.push([labelCell, contentCell]);
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
