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

  // click-to-play films: the player loads only when asked (no third-party requests before that)
  document.querySelectorAll('.player').forEach(p => p.querySelector('.play').addEventListener('click', () => {
    if (p.classList.contains('playing')) return;
    const src = p.dataset.lang === 'zh'
      ? `https://player.bilibili.com/player.html?bvid=${p.dataset.bili}&autoplay=1&high_quality=1&danmaku=0`
      : `https://www.youtube-nocookie.com/embed/${p.dataset.yt}?autoplay=1&rel=0`;
    const f = document.createElement('iframe');
    f.src = src;
    f.title = p.dataset.title || 'video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    p.appendChild(f);
    p.classList.add('playing');
  }));

  // Certifications: the HTML is written at build time, but the monthly data refresh only updates
  // /data/works.json, so re-read status and dates from there (renewals and expiries show up on their own).
  const certLabels = document.getElementById('cert-labels');
  if (certLabels) {
    const L = JSON.parse(certLabels.textContent);
    const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = iso => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
    const fmt = iso => { const [y, m, d] = day(iso).split('-').map(Number); return L.lang === 'zh' ? day(iso).replace(/-/g, '.') : `${M[m - 1]} ${d}, ${y}`; };
    const v = (document.querySelector('script[src*="app.js"]') || {}).src;
    fetch(`/data/works.json${v ? '?v=' + new URL(v).searchParams.get('v') : ''}`).then(r => r.json()).then(data => {
      const list = (data.extra && data.extra.credentials) || [];
      list.forEach(c => {
        const li = document.querySelector(`[data-cred="${c.id}"]`);
        if (!li) return;
        const expired = c.status === 'Expired';
        li.classList.toggle('expired', expired);
        li.classList.toggle('active', !expired);
        li.querySelector('[data-cred-status]').textContent = expired ? L.expired.replace('{date}', fmt(c.expiresOn)) : c.expiresOn ? L.activeUntil.replace('{date}', fmt(c.expiresOn)) : L.noExpiry;
      });
      const n = document.querySelector('[data-cred-count]');
      if (n && list.length) n.textContent = n.textContent.replace(/\d+/, list.filter(c => c.status === 'Active').length);
    }).catch(() => {});
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
