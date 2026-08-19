/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * This is an image-only cards gallery: each card contains a single image and
 * no text. Following the cards convention, each card is its own row. Since
 * there is no text content, each row has a single cell holding the image.
 *   Row 1: block name
 *   Row 2..N: one image per card
 */
export default function parse(element, { document }) {
  // Each direct child div of the grid is a card.
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];

  cardDivs.forEach((card) => {
    const img = card.querySelector('img, picture');
    if (img) {
      cells.push([img]);
    }
  });

  // Fallback: if no cards resolved via direct children, collect any images.
  if (cells.length === 0) {
    const imgs = Array.from(element.querySelectorAll('img, picture'));
    imgs.forEach((img) => cells.push([img]));
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
