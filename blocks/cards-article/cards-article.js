import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // The row has two cells: image cell and body cell.
    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture'));
    const bodyCell = cells.find((c) => c !== imageCell) || cells[cells.length - 1];

    // Card is a single link. Prefer the anchor inside the body.
    const anchor = row.querySelector('a');
    const href = anchor ? anchor.getAttribute('href') : null;
    const cardLink = document.createElement('a');
    cardLink.className = 'cards-article-card-link';
    if (href) cardLink.setAttribute('href', href);

    // Image cell.
    if (imageCell) {
      imageCell.className = 'cards-article-card-image';
      cardLink.append(imageCell);
    }

    // Body cell -- strip the redundant title link paragraph.
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'cards-article-card-body';

    const metaP = bodyCell.querySelector('p');
    const heading = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');

    if (metaP) {
      const text = metaP.textContent.trim();
      const meta = document.createElement('div');
      meta.className = 'cards-article-card-meta';
      // Split a trailing short date ("May 12") from the leading tag text.
      const match = text.match(/^(.*?)\s+([A-Za-z]{3,9}\.?\s+\d{1,2}(?:,\s*\d{4})?)$/);
      const tagText = match ? match[1].trim() : text;
      const dateText = match ? match[2].trim() : '';
      if (tagText) {
        const tag = document.createElement('span');
        tag.className = 'cards-article-tag';
        tag.textContent = tagText;
        meta.append(tag);
      }
      if (dateText) {
        const date = document.createElement('span');
        date.className = 'cards-article-date';
        date.textContent = dateText;
        meta.append(date);
      }
      bodyDiv.append(meta);
    }

    if (heading) bodyDiv.append(heading);

    cardLink.append(bodyDiv);
    li.append(cardLink);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
