/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (2-column cards):
 *   Row 1: block name
 *   Row 2..N: one article card per row
 *     Cell 1: card image
 *     Cell 2: text content (meta tag + date, heading) + CTA link to the article
 *
 * In the source each card is an <a class="article-card card-link"> wrapping an
 * image div and a body div. The whole card links to the article, so a CTA link
 * is added at the bottom of cell 2 to preserve the destination.
 */
export default function parse(element, { document }) {
  // Each direct child anchor is a card. Fall back to any .article-card.
  let cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));
  if (cardEls.length === 0) {
    cardEls = Array.from(element.querySelectorAll('a.article-card, .article-card'));
  }

  const cells = [];

  cardEls.forEach((card) => {
    const img = card.querySelector('.article-card-image img, .article-card-image picture, img, picture');
    const body = card.querySelector('.article-card-body');

    const contentCell = [];
    if (body) {
      Array.from(body.childNodes).forEach((n) => {
        if (!(n.nodeType === 3 && !n.textContent.trim())) contentCell.push(n);
      });
    }

    // Preserve the article destination as a CTA link.
    const href = card.getAttribute('href');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (href) {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      contentCell.push(cta);
    }

    const imageCell = img || '';
    cells.push([imageCell, contentCell.length > 0 ? contentCell : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
