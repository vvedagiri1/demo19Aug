/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (2-column accordion):
 *   Row 1: block name
 *   Row 2..N: one FAQ item per row
 *     Cell 1: question label (the summary text, without the toggle icon)
 *     Cell 2: answer content (the faq-answer body)
 */
export default function parse(element, { document }) {
  // Each <details class="faq-item"> is an accordion item.
  let items = Array.from(element.querySelectorAll(':scope > details.faq-item, details.faq-item'));
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('details'));
  }

  const cells = [];

  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const answer = item.querySelector('.faq-answer');

    // Title cell: prefer the summary's text span (exclude the decorative icon img).
    let titleCell = '';
    if (summary) {
      const labelSpan = summary.querySelector('span');
      if (labelSpan) {
        titleCell = labelSpan;
      } else {
        // Fallback: summary children minus any img icons.
        const parts = Array.from(summary.childNodes).filter(
          (n) => !(n.nodeType === 3 && !n.textContent.trim()) && !(n.nodeName === 'IMG'),
        );
        titleCell = parts.length > 0 ? parts : summary;
      }
    }

    // Content cell: the answer body's children.
    let contentCell = '';
    if (answer) {
      const inner = Array.from(answer.childNodes).filter(
        (n) => !(n.nodeType === 3 && !n.textContent.trim()),
      );
      contentCell = inner.length > 0 ? inner : answer;
    }

    if (titleCell === '' && contentCell === '') return;
    cells.push([titleCell, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
