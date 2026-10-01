/* Rings — public works as dots, oldest at the center, drawn like a figure on a drafting table.
   Layout: a sunflower (phyllotaxis) spiral in date order, so each year forms a ring and
   dense years grow thick rings. Motion: once, on first view, a compass arm sweeps a full
   turn, drawing the year arcs and inking the dots it passes; then the figure holds still.
   The pointer is a drafting crosshair that reads out which year ring it is over.
   No animation at all under prefers-reduced-motion.
   Colors come from CSS variables (--c-film …), so light and dark themes both work.
   Data: /data/works.json (refreshed monthly by a GitHub Action, no redeploy needed). */
(() => {
  const wrap = document.getElementById('rings-wrap');
  if (!wrap) return;
  const section = document.getElementById('rings');
  const canvas = document.getElementById('rings-canvas');
  const tip = document.getElementById('rings-tip');
  const pick = document.getElementById('rings-pick');
  const search = document.getElementById('rings-search');
  const countEl = document.getElementById('rings-count');
  const listEl = document.getElementById('rings-list');
  const viewBtn = document.getElementById('rings-view');
  const I = JSON.parse(document.getElementById('rings-i18n').textContent);
  const lang = I.lang;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const g = canvas.getContext('2d');
  const version = (document.currentScript && new URL(document.currentScript.src).searchParams.get('v')) || '';

  const GA = Math.PI * (3 - Math.sqrt(5)); // golden angle
  const SWEEP_MS = 1800;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = iso => {
    const [y, m, d] = iso.split('-').map(Number);
    return lang === 'zh' ? `${y} 年 ${m} 月 ${d} 日` : `${MONTHS[m - 1]} ${d}, ${y}`;
  };
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
  };
  // theme colors, re-read when the OS switches light/dark
  let COL = {}, INK = '#1a1d21', LINE = 'rgba(0,0,0,.15)', LABEL = '#6a7078', CARD = '#ffffff', ACCENT = '#c63d2a';
  const readTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const v = n => cs.getPropertyValue(n).trim();
    Object.keys(I.cats).forEach(k => (COL[k] = v(`--c-${k}`) || '#888888'));
    INK = v('--ink') || INK; LINE = v('--ring-line') || LINE; LABEL = v('--ring-label') || LABEL; CARD = v('--card') || CARD; ACCENT = v('--accent') || ACCENT;
  };
  readTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { readTheme(); if (typeof redraw === 'function') redraw(); });
  const hexOf = c => (/^#[0-9a-f]{6}$/i.test(c) ? c : '#888888');

  let items = [];
  let years = [];
  let size = 0, dpr = 1, R = 0, C = 0, scale = 1;
  const ALL = Object.keys(I.cats);
  const st = { active: new Set(ALL), q: '', hover: -1, sel: -1, pointer: null, intro: null, visible: false, raf: 0, pulse: 0, listMode: false };

  const shown = it => st.active.has(it.cat) && (!st.q || it.hay.includes(st.q));

  fetch(`/data/works.json?v=${version}`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(init)
    .catch(() => { pick.innerHTML = `<p class="empty">${lang === 'zh' ? '数据加载失败，请稍后刷新。' : 'Could not load the data. Please refresh.'}</p>`; });

  function init(data) {
    items = data.items.filter(it => I.cats[it.cat]).map((it, i) => {
      const t = (it.title && (it.title[lang] || it.title.en)) || it.id;
      const note = it.note ? it.note[lang] || it.note.en : '';
      return { i, id: it.id, cat: it.cat, date: it.date, w: it.w || 1, t, note, url: (lang === 'zh' && it.url_zh) || it.url, hay: `${t} ${note} ${it.date}`.toLowerCase() };
    });
    // keep the counts on the page in sync with the live data
    document.querySelectorAll('[data-count]').forEach(el => {
      const k = el.dataset.count;
      const v = k === 'total' ? items.length : data.counts[k];
      if (v != null) el.textContent = v.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');
    });
    const note = document.getElementById('rings-updated');
    if (note && data.generated) {
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.generated));
      note.textContent = note.dataset.template.replace('{date}', fmt(day));
    }
    layout();
    new ResizeObserver(() => { layout(); draw(performance.now()); }).observe(wrap);
    new IntersectionObserver(es => {
      for (const e of es) {
        st.visible = e.isIntersecting;
        if (st.visible && st.intro === null) st.intro = reduce ? -Infinity : performance.now();
        if (st.visible) loop();
      }
    }, { threshold: 0.2 }).observe(wrap);
    bind();
    draw(performance.now());
  }

  function layout() {
    const w = wrap.clientWidth;
    if (!w) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = w;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.max(0.55, size / 700);
    R = size / 2 - Math.max(14, size * 0.045);
    C = size / 2;
    // Slots: each year gets at least MIN_SLOTS positions, so sparse early years still read as
    // rings instead of collapsing into the center. Dots in a year spread evenly over its slots.
    const MIN_SLOTS = 7;
    const groups = [];
    items.forEach(it => {
      const y = it.date.slice(0, 4);
      if (!groups.length || groups.at(-1).y !== y) groups.push({ y, list: [] });
      groups.at(-1).list.push(it);
    });
    let k0 = 0;
    years = [];
    groups.forEach(gp => {
      const slots = Math.max(gp.list.length, MIN_SLOTS);
      gp.list.forEach((it, j) => (it.k = k0 + (j + 0.5) * (slots / gp.list.length)));
      years.push({ y: gp.y, k: k0 });
      k0 += slots;
    });
    const c = R / Math.sqrt(k0);
    items.forEach(it => {
      const r = c * Math.sqrt(it.k);
      const th = it.k * GA - Math.PI / 2;
      it.x = C + r * Math.cos(th);
      it.y = C + r * Math.sin(th);
      it.r = r;
      it.a = ((th + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); // 0 at 12 o'clock, clockwise
      it.s = (it.w === 3 ? 4.6 : it.w === 2 ? 3.3 : 2.15) * scale;
    });
    years.forEach(ring => (ring.r = c * Math.sqrt(Math.max(ring.k, 0.6))));
    // label rings from the outside in, skipping the ones that would collide
    let lastR = Infinity;
    for (let k = years.length - 1; k >= 0; k--) {
      const ring = years[k];
      ring.label = lastR - ring.r >= 17 * scale || k === years.length - 1;
      if (ring.label) lastR = ring.r;
    }
  }

  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const back = p => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

  function draw(now) {
    if (!size) return;
    g.clearRect(0, 0, size, size);
    const TAU = Math.PI * 2;
    const sweep = st.intro === null ? 0 : st.intro === -Infinity ? 1 : Math.min(1, (now - st.intro) / SWEEP_MS);
    const ease = sweep < 1 ? 1 - Math.pow(1 - sweep, 2) : 1;
    const A = ease * TAU; // swept angle, clockwise from 12 o'clock
    const start = -Math.PI / 2;
    const N = items.length;

    // drafting guides: dashed boundary + crosshair through the center
    g.strokeStyle = LINE;
    g.lineWidth = 1;
    g.setLineDash([3, 5]);
    g.beginPath(); g.arc(C, C, R + 8, start, start + Math.max(A, 0.0001)); g.stroke();
    g.setLineDash([]);
    g.beginPath(); g.moveTo(C - R - 14, C); g.lineTo(C + R + 14, C); g.moveTo(C, C - R - 14); g.lineTo(C, C + R + 14); g.stroke();

    // year arcs, drawn by the compass as it turns
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `500 ${Math.round(10.5 * Math.min(scale, 1.15))}px "IBM Plex Mono", ui-monospace, Menlo, monospace`;
    years.forEach(ring => {
      g.strokeStyle = LINE;
      g.beginPath(); g.arc(C, C, ring.r, start, start + Math.max(A, 0.0001)); g.stroke();
      if (ring.label && ring.r > 6 && sweep >= 1) {
        const tw = g.measureText(ring.y).width + 8;
        g.fillStyle = CARD;
        g.fillRect(C - tw / 2, C - ring.r - 7, tw, 14);
        g.fillStyle = LABEL;
        g.fillText(ring.y, C, C - ring.r);
      }
    });

    // dots: inked as the arm passes them
    for (let i = 0; i < N; i++) {
      const it = items[i];
      let p = 1;
      if (sweep < 1) {
        const lag = A - it.a;
        if (lag <= 0) continue;
        p = Math.min(1, lag / 0.35);
      }
      const on = shown(it);
      const a = (on ? 1 : 0.12) * p;
      const s = it.s * (0.55 + 0.45 * p);
      const col = hexOf(COL[it.cat]);
      if (it.w >= 2 && on) {
        g.fillStyle = rgba(col, a * 0.14);
        g.beginPath(); g.arc(it.x, it.y, s * 2.4, 0, TAU); g.fill();
      }
      g.fillStyle = rgba(col, a);
      g.beginPath(); g.arc(it.x, it.y, s, 0, TAU); g.fill();
    }

    // the compass arm while it sweeps
    if (sweep < 1) {
      const ang = start + A;
      g.strokeStyle = ACCENT;
      g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(C, C); g.lineTo(C + (R + 12) * Math.cos(ang), C + (R + 12) * Math.sin(ang)); g.stroke();
      g.fillStyle = ACCENT;
      g.beginPath(); g.arc(C, C, 3.5, 0, TAU); g.fill();
    }

    // drafting crosshair + year readout under the pointer
    const P = st.pointer;
    if (P && sweep >= 1) {
      const d = Math.hypot(P.x - C, P.y - C);
      g.strokeStyle = INK;
      g.globalAlpha = 0.55;
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(P.x - 12, P.y); g.lineTo(P.x - 4, P.y); g.moveTo(P.x + 4, P.y); g.lineTo(P.x + 12, P.y); g.moveTo(P.x, P.y - 12); g.lineTo(P.x, P.y - 4); g.moveTo(P.x, P.y + 4); g.lineTo(P.x, P.y + 12); g.stroke();
      g.globalAlpha = 0.25;
      g.setLineDash([2, 4]);
      g.beginPath(); g.arc(C, C, d, 0, TAU); g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 1;
      if (d <= R + 8 && st.hover < 0) {
        let yr = years[0] && years[0].y;
        for (const ring of years) if (ring.r <= d) yr = ring.y;
        g.font = `500 ${Math.round(11 * Math.min(scale, 1.15))}px "IBM Plex Mono", ui-monospace, Menlo, monospace`;
        g.textAlign = 'left';
        const tw = g.measureText(yr).width + 8;
        g.fillStyle = INK;
        g.fillRect(P.x + 10, P.y + 10, tw, 16);
        g.fillStyle = CARD;
        g.fillText(yr, P.x + 14, P.y + 18);
        g.textAlign = 'center';
      }
    }

    // hovered / selected
    [st.hover, st.sel].forEach((idx, k) => {
      if (idx < 0 || !items[idx]) return;
      const it = items[idx];
      const rr = it.s * 2.6 + 4;
      if (k === 1 && st.pulse && !reduce) {
        const q = (now - st.pulse) / 900;
        if (q < 1.6) { g.strokeStyle = INK; g.globalAlpha = 0.5 * Math.max(0, 1 - q / 1.6); g.lineWidth = 1.5; g.beginPath(); g.arc(it.x, it.y, rr + q * 22, 0, TAU); g.stroke(); g.globalAlpha = 1; }
      }
      g.strokeStyle = INK;
      g.lineWidth = k === 1 ? 2 : 1.25;
      g.beginPath(); g.arc(it.x, it.y, rr, 0, TAU); g.stroke();
    });
    return sweep < 1;
  }

  function loop() {
    if (st.raf) return;
    const tick = now => {
      st.raf = 0;
      const sweeping = draw(now);
      const pulsing = st.pulse && !reduce && now - st.pulse < 1500;
      if (st.visible && (sweeping || pulsing)) st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);
  }
  function redraw() { if (st.raf) return; draw(performance.now()); if (st.pulse && !reduce && st.visible) loop(); }

  function hit(x, y) {
    let best = -1, bd = Infinity;
    const lim = Math.max(11, 9 * scale);
    for (const it of items) {
      if (!shown(it)) continue;
      const d = Math.hypot(it.x - x, it.y - y);
      if (d < bd && d < Math.max(lim, it.s * 2.2)) { bd = d; best = it.i; }
    }
    return best;
  }

  const catLabel = it => I.cats[it.cat].label;
  const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function showTip(it) {
    if (!it) { tip.classList.remove('on'); return; }
    tip.innerHTML = `<b>${escHtml(it.t)}</b><small>${fmt(it.date)} · ${escHtml(catLabel(it))}${it.note ? ` · ${escHtml(it.note)}` : ''}</small>`;
    tip.classList.add('on');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = it.x + 14, y = it.y + 14;
    if (x + tw > size) x = it.x - tw - 14;
    if (y + th > size) y = it.y - th - 14;
    tip.style.left = `${Math.max(0, x)}px`;
    tip.style.top = `${Math.max(0, y)}px`;
  }

  function openItem(it) {
    if (!it || !it.url) return;
    if (it.url.startsWith('/assets/drawings/') && window.openDrawing) window.openDrawing(it.url, it.t);
    else window.open(it.url, '_blank', 'noopener');
  }

  function select(idx, pulse) {
    st.sel = idx;
    const it = items[idx];
    if (!it) { pick.innerHTML = ''; return; }
    if (pulse) st.pulse = performance.now();
    const isDrawing = it.url && it.url.startsWith('/assets/drawings/');
    pick.innerHTML = `<span class="cat" style="--c:var(--c-${it.cat})"><i></i>${escHtml(catLabel(it))} · <time datetime="${it.date}">${fmt(it.date)}</time></span>
      <h3>${escHtml(it.t)}</h3>${it.note ? `<p>${escHtml(it.note)}</p>` : '<p></p>'}
      ${isDrawing ? `<a class="open" href="${escHtml(it.url)}" data-drawing>${escHtml(I.open)} →</a>` : `<a class="open" href="${escHtml(it.url)}" target="_blank" rel="noopener">${escHtml(I.open)} ↗</a>`}`;
    const a = pick.querySelector('[data-drawing]');
    if (a) a.addEventListener('click', e => { e.preventDefault(); openItem(it); });
    redraw();
  }

  function local(e) {
    const b = canvas.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * size, y: ((e.clientY - b.top) / b.height) * size };
  }

  function bind() {
    canvas.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      st.pointer = local(e);
      const h = hit(st.pointer.x, st.pointer.y);
      if (h !== st.hover) { st.hover = h; showTip(items[h]); canvas.classList.toggle('hit', h > -1); }
      redraw();
    });
    canvas.addEventListener('pointerleave', () => { st.pointer = null; st.hover = -1; showTip(null); canvas.classList.remove('hit'); redraw(); });
    canvas.addEventListener('click', e => {
      const p = local(e);
      const h = hit(p.x, p.y);
      if (h < 0) return;
      if (e.pointerType === 'touch' || (!e.pointerType && matchMedia('(hover: none)').matches)) {
        if (st.sel === h) openItem(items[h]); else { select(h, true); showTip(items[h]); }
      } else {
        select(h, false);
        openItem(items[h]);
      }
    });

    // Filters behave like radio buttons: "All", or exactly one kind. Clicking the active kind again goes back to All.
    document.querySelectorAll('.chip[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.cat;
        const solo = st.active.size === 1 && st.active.has(k);
        st.active = new Set(k === 'all' || solo ? ALL : [k]);
        const isAll = st.active.size === ALL.length;
        document.querySelectorAll('.chip[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === 'all' ? isAll : !isAll && st.active.has(b.dataset.cat))));
        refresh();
      });
    });

    search.addEventListener('input', () => { st.q = search.value.trim().toLowerCase(); refresh(); });
    search.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const first = items.find(shown);
      if (first) select(first.i, true);
    });

    document.getElementById('rings-random').addEventListener('click', () => {
      const pool = items.filter(shown);
      if (!pool.length) return;
      const it = pool[Math.floor(Math.random() * pool.length)];
      if (st.listMode) toggleList();
      select(it.i, true);
      wrap.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });

    viewBtn.addEventListener('click', toggleList);
  }

  function refresh() {
    const n = items.filter(shown).length;
    countEl.textContent = st.q ? (n ? I.matches.replace('{n}', n) : I.noMatch) : '';
    if (st.hover > -1 && !shown(items[st.hover])) { st.hover = -1; showTip(null); }
    if (st.listMode) renderList();
    redraw();
  }

  function toggleList() {
    st.listMode = !st.listMode;
    section.classList.toggle('as-list', st.listMode);
    viewBtn.querySelector('span').textContent = st.listMode ? I.map : I.list;
    if (st.listMode) renderList();
    else { layout(); redraw(); }
  }

  function renderList() {
    const vis = items.filter(shown).slice().reverse();
    const byYear = new Map();
    vis.forEach(it => { const y = it.date.slice(0, 4); if (!byYear.has(y)) byYear.set(y, []); byYear.get(y).push(it); });
    listEl.innerHTML = [...byYear].map(([y, arr]) => `<h3>${y} · ${arr.length}</h3><ul>${arr.map(it => `<li style="--c:var(--c-${it.cat})"><i></i><time datetime="${it.date}">${it.date}</time><a href="${escHtml(it.url)}"${it.url.startsWith('/') ? '' : ' target="_blank" rel="noopener"'} title="${escHtml(catLabel(it))}">${escHtml(it.t)}</a></li>`).join('')}</ul>`).join('') || `<p class="rings-note" style="padding-top:12px">${escHtml(I.noMatch)}</p>`;
  }

  // test hook for Program_Scripts/check_visual.mjs
  window.__rings = { get items() { return items; }, select, hit, get state() { return st; } };
})();
