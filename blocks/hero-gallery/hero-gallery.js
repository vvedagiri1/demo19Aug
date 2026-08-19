export default function decorate(block) {
  // The last row's cell holds the text content (heading, copy, CTAs).
  // Group the standalone link paragraphs into a button group so they render
  // as side-by-side pill CTAs (source design). This project's core
  // decorateButtons only buttonizes strong/em-wrapped links, so we handle it here.
  const cells = block.querySelectorAll(':scope > div > div');
  const textCell = [...cells].find((c) => c.querySelector('h1, h2'));
  if (!textCell) return;

  const ctaParas = [...textCell.querySelectorAll(':scope > p')].filter((p) => {
    const a = p.querySelector('a');
    return a && p.textContent.trim() === a.textContent.trim();
  });
  if (!ctaParas.length) return;

  const group = document.createElement('div');
  group.className = 'hero-gallery-buttons';
  ctaParas.forEach((p, i) => {
    const a = p.querySelector('a');
    a.classList.add('hero-gallery-cta', i === 0 ? 'is-primary' : 'is-secondary');
    group.append(a);
    p.remove();
  });
  textCell.append(group);
}
