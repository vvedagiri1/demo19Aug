/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Non-authorable site chrome removed:
 *  - Skip link:            body > a.skip-link           ("Skip to main content")
 *  - Navbar / mega menu:   body > div.navbar            (global header nav)
 *  - Footer:               body > footer.footer.inverse-footer
 *  - Breadcrumbs:          .breadcrumbs                 (in-page nav, non-authorable)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable navigation chrome. Removed before parsing so it never
    // interferes with block matching. Selectors from cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
      '.breadcrumbs',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety net in case any chrome survived, plus non-content elements.
    WebImporter.DOMUtils.remove(element, [
      'div.navbar',
      'footer.footer',
      'noscript',
      'link',
      'iframe',
    ]);

    // Strip Astro build attributes left on the markup (data-astro-cid-*).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) el.removeAttribute(attr.name);
      });
    });
  }
}
