/*
 * Accordion FAQ Block
 * Expandable question/answer pairs using native <details>/<summary>.
 * A plus icon rotates 45deg to an "x" when the item is open.
 */

const ICON = `<svg class="accordion-faq-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    const labelText = document.createElement('span');
    labelText.className = 'accordion-faq-item-label-text';
    labelText.append(...label.childNodes);
    summary.append(labelText);
    summary.insertAdjacentHTML('beforeend', ICON);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
