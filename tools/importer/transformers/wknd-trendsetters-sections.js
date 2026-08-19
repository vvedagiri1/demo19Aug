/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + Section Metadata.
 * Template "home" has 7 sections; section selectors come directly from
 * page-templates.json (DOM-verified during page analysis).
 *
 * Styled sections (style: "secondary"): rc2 (Hero), rc4 (Style in every
 * snapshot), rc6 (Latest articles). All others have style: null.
 *
 * Uses BOTH hooks per the reference implementation: breaks are inserted in
 * beforeTransform (while every section element still exists, before block
 * parsers replace them), anchored by a temporary marker attribute; Section
 * Metadata blocks are inserted in afterTransform against that marker.
 * Reverse iteration keeps not-yet-processed sections at their found position.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section: only needs a marker if it carries a style (rc2 does).
      if (i === 0 && !section.style) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived post-parse — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
