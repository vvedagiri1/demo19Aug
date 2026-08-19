/*
 * tabs-testimonial block
 * Authored structure (one row per testimonial):
 *   row > cell0 (tab: avatar, name, role)
 *       > cell1 (panel: large image, name, role, quote)
 * Decorated into: a stack of tab panels (only active shown) followed by a
 * tablist of avatar buttons. Design mirrors the WKND source testimonial tabs.
 */

function firstImage(cell) {
  const pic = cell.querySelector('picture');
  if (pic) return pic;
  return cell.querySelector('img');
}

function textParagraphs(cell) {
  // Text paragraphs only (name, role, quote ...): skip image paragraphs and
  // any paragraph left empty after an image/picture was moved out of it.
  return [...cell.children].filter(
    (el) => !el.querySelector('picture, img') && el.textContent.trim() !== '',
  );
}

export default async function decorate(block) {
  const rows = [...block.children];

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';

  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Testimonials');

  const buttons = [];
  const panelEls = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const tabCell = cells[0];
    const panelCell = cells[1] || cells[0];

    // ---- Panel ----
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${i}`);
    panel.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    if (i !== 0) panel.hidden = true;

    const media = document.createElement('div');
    media.className = 'tabs-testimonial-media';
    const pImg = firstImage(panelCell);
    if (pImg) media.append(pImg);

    const content = document.createElement('div');
    content.className = 'tabs-testimonial-content';
    const pTexts = textParagraphs(panelCell);
    const person = document.createElement('div');
    person.className = 'tabs-testimonial-person';
    if (pTexts[0]) {
      pTexts[0].className = 'tabs-testimonial-name';
      person.append(pTexts[0]);
    }
    if (pTexts[1]) {
      pTexts[1].className = 'tabs-testimonial-role';
      person.append(pTexts[1]);
    }
    content.append(person);
    pTexts.slice(2).forEach((q) => {
      q.className = 'tabs-testimonial-quote';
      content.append(q);
    });

    panel.append(media, content);
    panels.append(panel);
    panelEls.push(panel);

    // ---- Tab button ----
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${i}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${i}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.tabIndex = i === 0 ? 0 : -1;

    const tImg = firstImage(tabCell);
    if (tImg) {
      const avatar = document.createElement('span');
      avatar.className = 'tabs-testimonial-avatar';
      avatar.append(tImg);
      button.append(avatar);
    }

    const tTexts = textParagraphs(tabCell);
    const tabText = document.createElement('span');
    tabText.className = 'tabs-testimonial-tab-text';
    if (tTexts[0]) {
      tTexts[0].className = 'tabs-testimonial-tab-name';
      tabText.append(tTexts[0]);
    }
    if (tTexts[1]) {
      tTexts[1].className = 'tabs-testimonial-tab-role';
      tabText.append(tTexts[1]);
    }
    button.append(tabText);

    tablist.append(button);
    buttons.push(button);
    row.remove();
  });

  const activate = (index) => {
    buttons.forEach((btn, idx) => {
      const selected = idx === index;
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
      btn.tabIndex = selected ? 0 : -1;
    });
    panelEls.forEach((panel, idx) => {
      const selected = idx === index;
      panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      panel.hidden = !selected;
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(index));
    button.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % buttons.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = buttons.length - 1;
      if (next !== null) {
        e.preventDefault();
        activate(next);
        buttons[next].focus();
      }
    });
  });

  block.append(panels, tablist);
}
