/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-gallery.js
  function parse(element, { document: document2 }) {
    const directCols = element.querySelectorAll(":scope > div");
    let imagesCol = null;
    let textCol = null;
    directCols.forEach((col) => {
      if (col.querySelector("img, picture") && !col.querySelector("h1, h2, h3, p")) {
        imagesCol = col;
      } else if (col.querySelector("h1, h2, h3, h4, p")) {
        textCol = col;
      }
    });
    if (!textCol) {
      textCol = element.querySelector(":scope > div");
    }
    const images = Array.from((imagesCol || element).querySelectorAll("img, picture"));
    const heading = (textCol || element).querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
    const subheading = (textCol || element).querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from((textCol || element).querySelectorAll('a.button, .button-group a, a[class*="button"]'));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (images.length > 0) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document: document2 }) {
    let columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columns.map((col) => {
      const cellContent = Array.from(col.childNodes).filter((n) => {
        return !(n.nodeType === 3 && !n.textContent.trim());
      });
      return cellContent.length > 0 ? cellContent : "";
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const cardDivs = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cardDivs.forEach((card) => {
      const img = card.querySelector("img, picture");
      if (img) {
        cells.push([img]);
      }
    });
    if (cells.length === 0) {
      const imgs = Array.from(element.querySelectorAll("img, picture"));
      imgs.forEach((img) => cells.push([img]));
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, button[id^="tab-"]'));
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const cells = [];
    const count = Math.max(labels.length, panes.length);
    for (let i = 0; i < count; i += 1) {
      const label = labels[i];
      const pane = panes[i];
      let labelCell = "";
      if (label) {
        const inner = Array.from(label.childNodes).filter(
          (n) => !(n.nodeType === 3 && !n.textContent.trim())
        );
        labelCell = inner.length > 0 ? inner : label;
      }
      let contentCell = "";
      if (pane) {
        const inner = Array.from(pane.childNodes).filter(
          (n) => !(n.nodeType === 3 && !n.textContent.trim())
        );
        contentCell = inner.length > 0 ? inner : pane;
      }
      if (labelCell === "" && contentCell === "") continue;
      cells.push([labelCell, contentCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    if (cardEls.length === 0) {
      cardEls = Array.from(element.querySelectorAll("a.article-card, .article-card"));
    }
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector(".article-card-image img, .article-card-image picture, img, picture");
      const body = card.querySelector(".article-card-body");
      const contentCell = [];
      if (body) {
        Array.from(body.childNodes).forEach((n) => {
          if (!(n.nodeType === 3 && !n.textContent.trim())) contentCell.push(n);
        });
      }
      const href = card.getAttribute("href");
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (href) {
        const cta = document2.createElement("a");
        cta.setAttribute("href", href);
        cta.textContent = heading ? heading.textContent.trim() : "Read more";
        contentCell.push(cta);
      }
      const imageCell = img || "";
      cells.push([imageCell, contentCell.length > 0 ? contentCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > details.faq-item, details.faq-item"));
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("details"));
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const answer = item.querySelector(".faq-answer");
      let titleCell = "";
      if (summary) {
        const labelSpan = summary.querySelector("span");
        if (labelSpan) {
          titleCell = labelSpan;
        } else {
          const parts = Array.from(summary.childNodes).filter(
            (n) => !(n.nodeType === 3 && !n.textContent.trim()) && !(n.nodeName === "IMG")
          );
          titleCell = parts.length > 0 ? parts : summary;
        }
      }
      let contentCell = "";
      if (answer) {
        const inner = Array.from(answer.childNodes).filter(
          (n) => !(n.nodeType === 3 && !n.textContent.trim())
        );
        contentCell = inner.length > 0 ? inner : answer;
      }
      if (titleCell === "" && contentCell === "") return;
      cells.push([titleCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image, img.utility-overlay, img, picture");
    const contentContainer = element.querySelector(".card-body") || element;
    const heading = contentContainer.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
    const subheading = contentContainer.querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from(contentContainer.querySelectorAll('a.button, .button-group a, a[class*="button"]'));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer",
        ".breadcrumbs"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.navbar",
        "footer.footer",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) el.removeAttribute(attr.name);
        });
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-gallery": parse,
    "columns-feature": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND Trendsetters home page: hero with heading/CTAs and image gallery, featured case-study card, image gallery grid, testimonials tabs, latest articles cards, FAQ accordion, and call-to-action banner.",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      { name: "hero-gallery", instances: ["#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"], section: "secondary" },
      { name: "columns-feature", instances: ["#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"] },
      { name: "cards-gallery", instances: ["#main-content > section.section.secondary-section:nth-of-type(2) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"], section: "secondary" },
      { name: "tabs-testimonial", instances: ["#main-content > section.section:nth-of-type(3) div.tabs-wrapper"] },
      { name: "cards-article", instances: ["#main-content > section.section.secondary-section:nth-of-type(4) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"], section: "secondary" },
      { name: "accordion-faq", instances: ["#main-content > section.section:nth-of-type(5) div.faq-list"] },
      { name: "hero-overlay", instances: ["#main-content > section.section.inverse-section div.grid-layout.desktop-1-column"] }
    ],
    sections: [
      { id: "rc2", name: "Hero", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero-gallery"], defaultContent: [] },
      { id: "rc3", name: "Featured case study", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc4", name: "Style in every snapshot", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: [] },
      { id: "rc5", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "rc6", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-article"], defaultContent: [] },
      { id: "rc7", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc8", name: "Closing CTA banner", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
