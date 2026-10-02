/* Small page behaviours: header shadow, entrance motion, drawing lightbox, copy email. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // entrance: hero rises once, sections fade up as they enter
  requestAnimationFrame(() => document.body.classList.add('ready'));
  // Only elements that start below the fold are hidden; they fade in when they scroll into view.
  // Checked on scroll (rAF-throttled) and by IntersectionObserver, so either one is enough.
  if (!reduce) {
    const line = () => innerHeight * 0.94;
    let pending = [...document.querySelectorAll('.reveal')].filter(el => el.getBoundingClientRect().top > line());
    pending.forEach(el => el.classList.add('pending'));
    let ticking = false;
    const check = () => {
      ticking = false;
      pending = pending.filter(el => {
        if (el.getBoundingClientRect().top < line()) { el.classList.remove('pending'); return false; }
        return true;
      });
      if (!pending.length) removeEventListener('scroll', onScrollCheck);
    };
    const onScrollCheck = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    addEventListener('scroll', onScrollCheck, { passive: true });
    addEventListener('resize', onScrollCheck);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) onScrollCheck(); }));
      pending.forEach(el => io.observe(el));
    }
  }

  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // lightbox (gallery + drawings opened from the rings)
  const box = document.getElementById('lightbox');
  if (box) {
    const img = box.querySelector('img');
    const cap = box.querySelector('p');
    const btns = [...document.querySelectorAll('.gallery button[data-full]')];
    let idx = -1, opener = null;
    const show = (src, text) => { img.src = src; img.alt = text; cap.textContent = text; };
    const open = (i, src, text) => {
      opener = document.activeElement;
      idx = i;
      box.querySelector('.pv').hidden = box.querySelector('.nx').hidden = i < 0;
      if (i >= 0) { const b = btns[i]; show(b.dataset.full, b.closest('figure').querySelector('figcaption').textContent); }
      else show(src, text);
      box.classList.add('on');
      document.body.style.overflow = 'hidden';
      box.querySelector('.x').focus();
    };
    const close = () => { box.classList.remove('on'); document.body.style.overflow = ''; img.removeAttribute('src'); if (opener) opener.focus(); };
    const step = d => { if (idx < 0) return; idx = (idx + d + btns.length) % btns.length; open(idx); };
    btns.forEach((b, i) => b.addEventListener('click', () => open(i)));
    box.querySelector('.x').addEventListener('click', close);
    box.querySelector('.pv').addEventListener('click', () => step(-1));
    box.querySelector('.nx').addEventListener('click', () => step(1));
    box.addEventListener('click', e => { if (e.target === box) close(); });
    addEventListener('keydown', e => {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = [...box.querySelectorAll('button')].filter(x => !x.hidden);
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    window.openDrawing = (src, text) => open(-1, src, text);
    // any link marked data-lightbox (e.g. the nomination certificate) opens here instead of a new page
    document.querySelectorAll('a[data-lightbox]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      open(-1, a.getAttribute('href'), a.dataset.caption || '');
    }));
  }

  // copy email
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      const old = b.textContent;
      b.textContent = b.dataset.done;
      setTimeout(() => (b.textContent = old), 1600);
    } catch { location.href = `mailto:${b.dataset.copy}`; }
  }));
})();
