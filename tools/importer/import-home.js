/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGalleryParser from './parsers/hero-gallery.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-gallery': heroGalleryParser,
  'columns-feature': columnsFeatureParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND Trendsetters home page: hero with heading/CTAs and image gallery, featured case-study card, image gallery grid, testimonials tabs, latest articles cards, FAQ accordion, and call-to-action banner.',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    { name: 'hero-gallery', instances: ['#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl'], section: 'secondary' },
    { name: 'columns-feature', instances: ['#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg'] },
    { name: 'cards-gallery', instances: ['#main-content > section.section.secondary-section:nth-of-type(2) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm'], section: 'secondary' },
    { name: 'tabs-testimonial', instances: ['#main-content > section.section:nth-of-type(3) div.tabs-wrapper'] },
    { name: 'cards-article', instances: ['#main-content > section.section.secondary-section:nth-of-type(4) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md'], section: 'secondary' },
    { name: 'accordion-faq', instances: ['#main-content > section.section:nth-of-type(5) div.faq-list'] },
    { name: 'hero-overlay', instances: ['#main-content > section.section.inverse-section div.grid-layout.desktop-1-column'] }
  ],
  sections: [
    { id: 'rc2', name: 'Hero', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-gallery'], defaultContent: [] },
    { id: 'rc3', name: 'Featured case study', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc4', name: 'Style in every snapshot', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: ['cards-gallery'], defaultContent: [] },
    { id: 'rc5', name: 'Testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 'rc6', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary', blocks: ['cards-article'], defaultContent: [] },
    { id: 'rc7', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: [] },
    { id: 'rc8', name: 'Closing CTA banner', selector: '#main-content > section.section.inverse-section', style: null, blocks: ['hero-overlay'], defaultContent: [] }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
