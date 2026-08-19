/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-gallery. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Structure (1-column hero):
 *   Row 1: block name
 *   Row 2: image gallery (one or more images) — placed first so the block
 *          decorator treats the first cell as the image container
 *   Row 3: heading, subheading, CTA buttons
 */
export default function parse(element, { document }) {
  // The hero-gallery source has two inner grid columns:
  //  - one with text (heading, subheading, buttons)
  //  - one with the image gallery (multiple cover-images)
  const directCols = element.querySelectorAll(':scope > div');

  // Identify the image column and the text column by their contents.
  let imagesCol = null;
  let textCol = null;
  directCols.forEach((col) => {
    if (col.querySelector('img, picture') && !col.querySelector('h1, h2, h3, p')) {
      imagesCol = col;
    } else if (col.querySelector('h1, h2, h3, h4, p')) {
      textCol = col;
    }
  });

  // Fallbacks if the split above did not resolve.
  if (!textCol) {
    textCol = element.querySelector(':scope > div');
  }

  // Collect gallery images (preserve semantic img/picture elements).
  const images = Array.from((imagesCol || element).querySelectorAll('img, picture'));

  // Collect content from the text column.
  const heading = (textCol || element).querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
  const subheading = (textCol || element).querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from((textCol || element).querySelectorAll('a.button, .button-group a, a[class*="button"]'));

  // Empty-block guard.
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image gallery (optional).
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3: text content (heading, subheading, CTAs).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gallery', cells });
  element.replaceWith(block);
}
