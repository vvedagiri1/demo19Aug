/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (1-column hero):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title, subheading, CTA buttons
 *
 * The block decorator uses the first child div's image as the background, so
 * the background image goes in its own row before the text content.
 */
export default function parse(element, { document }) {
  // Background/cover image (the overlay hero uses a full-bleed cover image).
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay, img, picture');

  // Text content lives in the card-body overlay.
  const contentContainer = element.querySelector('.card-body') || element;
  const heading = contentContainer.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
  const subheading = contentContainer.querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from(contentContainer.querySelectorAll('a.button, .button-group a, a[class*="button"]'));

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: text content in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
