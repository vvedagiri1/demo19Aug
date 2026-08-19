/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (multi-column, single content row):
 *   Row 1: block name
 *   Row 2: N cells, one per visual column. In the source each direct child
 *          <div> of the grid is a column (col 1 = image, col 2 = breadcrumbs
 *          + heading + author/meta). All inner content is preserved.
 */
export default function parse(element, { document }) {
  // Each direct child div of the grid layout is a visual column.
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build one content row: each column becomes a cell holding its child nodes.
  const row = columns.map((col) => {
    const cellContent = Array.from(col.childNodes).filter((n) => {
      // Drop whitespace-only text nodes.
      return !(n.nodeType === 3 && !n.textContent.trim());
    });
    return cellContent.length > 0 ? cellContent : '';
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
