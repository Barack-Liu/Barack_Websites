#!/usr/bin/env node
// Builds the "Rings" data: every public work, one item each, sorted by date.
//
//   node Program_Scripts/fetch_works.mjs [--manual <works.manual.json>] [--out <works.json>]
//
// Sources
//   manual   – hand-curated list (films, papers, patents, drawings, ventures, course demos)
//   qidian   – every chapter of 《不使意难平》 (m.qidian.com catalog page, embedded JSON)
//   bilibili – the 「AI产品开发」devlog series on Barack's personal Bilibili account
//   github   – public, non-fork repos of github.com/Barack-Liu
//
// If a remote source fails (network, anti-bot, API change), the items from the previous
// run are kept for that source, so a monthly refresh never wipes data. Zero dependencies;
// runs the same on this Mac and in the GitHub Action (.github/workflows/refresh-works.yml).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const MANUAL = resolve(arg('--manual', resolve(here, '../260930-BarackLiu.org/content/works.manual.json')));
const OUT = resolve(arg('--out', resolve(here, '../260930-BarackLiu.org/content/works.json')));

const QIDIAN_BOOK = '1040689941';
const BILI_MID = '428266039';
const BILI_SERIES = '4654943';
const GITHUB_USER = 'Barack-Liu';
// Only repos listed in works.manual.json → github_allow appear. A new public repo stays off the
// site until Barack adds it there, so the monthly Action never publishes anything unreviewed.
let GITHUB_ALLOW = null;

const UA_DESKTOP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

async function get(url, headers = {}, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      last = e;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw new Error(`${url}: ${last.message}`);
}

const day = s => s.slice(0, 10);
const tsDay = ts => new Date(ts * 1000 + 8 * 3600 * 1000).toISOString().slice(0, 10); // Beijing date

async function fromQidian() {
  const html = await (await get(`https://m.qidian.com/book/${QIDIAN_BOOK}/catalog/`, { 'User-Agent': UA_MOBILE })).text();
  const m = html.match(/<script id="vite-plugin-ssr_pageContext" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('qidian: page data not found');
  const data = JSON.parse(m[1]).pageContext.pageProps.pageData;
  const chapters = data.vs.flatMap(v => v.cs);
  if (chapters.length < 10) throw new Error(`qidian: only ${chapters.length} chapters`);
  const items = chapters.map((c, i) => ({
    id: `chapter-${c.id}`,
    cat: 'chapter',
    date: day(c.uT),
    w: 1,
    title: { en: `Let No Regrets Remain · ${c.cN}`, zh: `不使意难平 · ${c.cN}` },
    note: { en: `${c.cnt.toLocaleString('en-US')} characters`, zh: `${c.cnt.toLocaleString('en-US')} 字` },
    url: `https://www.qidian.com/chapter/${QIDIAN_BOOK}/${c.id}/`,
    n: i + 1,
    chars: c.cnt,
  }));
  return { items, extra: { book: { name: data.bookName, status: data.bookStatus, chapters: chapters.length, chars: chapters.reduce((a, c) => a + c.cnt, 0), updated: data.updateTime } } };
}

async function fromBilibili() {
  const items = [];
  for (let pn = 1; pn <= 10; pn++) {
    const url = `https://api.bilibili.com/x/series/archives?mid=${BILI_MID}&series_id=${BILI_SERIES}&only_normal=true&sort=asc&pn=${pn}&ps=100`;
    const json = await (await get(url, { 'User-Agent': UA_DESKTOP, Referer: `https://space.bilibili.com/${BILI_MID}` })).json();
    if (json.code !== 0) throw new Error(`bilibili: code ${json.code} ${json.message}`);
    const arr = json.data?.archives ?? [];
    for (const a of arr) {
      items.push({
        id: `devlog-${a.bvid}`,
        cat: 'devlog',
        date: tsDay(a.pubdate),
        w: 1,
        title: { en: a.title, zh: a.title },
        url: `https://www.bilibili.com/video/${a.bvid}/`,
      });
    }
    const total = json.data?.page?.total ?? 0;
    if (items.length >= total || arr.length === 0) break;
  }
  if (items.length < 10) throw new Error(`bilibili: only ${items.length} videos`);
  return { items };
}

async function fromGithub() {
  const repos = await (await get(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, { 'User-Agent': 'barackliu.org', Accept: 'application/vnd.github+json' })).json();
  if (!Array.isArray(repos)) throw new Error('github: unexpected response');
  const items = repos
    .filter(r => !r.fork && !r.private && (!GITHUB_ALLOW || GITHUB_ALLOW.has(r.name)))
    .map(r => ({
      id: `code-${r.name.toLowerCase()}`,
      cat: 'code',
      date: day(r.created_at),
      w: 1,
      title: { en: r.name, zh: r.name },
      ...((r.description || '').trim() ? { note: { en: r.description.trim(), zh: r.description.trim() } } : {}),
      url: r.html_url,
    }));
  if (items.length < 3) throw new Error(`github: only ${items.length} repos`);
  return { items };
}

async function main() {
  const manualFile = JSON.parse(await readFile(MANUAL, 'utf8'));
  const excludeIds = new Set(manualFile.exclude_ids || []);
  const overrides = manualFile.overrides || {};
  if (Array.isArray(manualFile.github_allow)) GITHUB_ALLOW = new Set(manualFile.github_allow);
  const manual = manualFile.items.map(it => ({
    ...it,
    url: it.url || (it.img ? `/assets/drawings/${it.img}.jpg` : undefined),
    src: 'manual',
  }));
  const previous = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf8')) : { items: [], sources: {} };

  const sources = { manual: { ok: true, count: manual.length } };
  const remote = { qidian: fromQidian, bilibili: fromBilibili, github: fromGithub };
  let items = [...manual];
  let extra = previous.extra || {};

  for (const [name, fn] of Object.entries(remote)) {
    try {
      const res = await fn();
      res.items.forEach(it => (it.src = name));
      const before = res.items.length;
      res.items = res.items.filter(it => !excludeIds.has(it.id));
      for (const it of res.items) {
        const o = overrides[it.id];
        if (!o) continue;
        for (const [k, v] of Object.entries(o)) { if (v === null) delete it[k]; else it[k] = v; }
      }
      if (before !== res.items.length) console.log(`  ${name}: ${before - res.items.length} item(s) left out (exclude_ids)`);
      items.push(...res.items);
      if (res.extra) extra = { ...extra, ...res.extra };
      sources[name] = { ok: true, count: res.items.length, fetched: new Date().toISOString() };
      console.log(`✓ ${name}: ${res.items.length}`);
    } catch (e) {
      const kept = (previous.items || []).filter(it => it.src === name && !excludeIds.has(it.id));
      items.push(...kept);
      sources[name] = { ok: false, count: kept.length, error: e.message, fetched: previous.sources?.[name]?.fetched ?? null };
      console.warn(`✗ ${name}: ${e.message} — kept ${kept.length} items from the last run`);
    }
  }

  // De-duplicate by id (manual wins), then sort oldest → newest; ties keep source order.
  const seen = new Set();
  items = items.filter(it => (seen.has(it.id) ? false : seen.add(it.id)));
  items.forEach((it, i) => (it._i = i));
  items.sort((a, b) => a.date.localeCompare(b.date) || a._i - b._i);
  items.forEach(it => delete it._i);

  const counts = {};
  for (const it of items) counts[it.cat] = (counts[it.cat] || 0) + 1;

  const same = previous.items && JSON.stringify(previous.items) === JSON.stringify(items) && JSON.stringify(previous.extra || {}) === JSON.stringify(extra);
  if (same) for (const k of Object.keys(sources)) if (sources[k].ok && previous.sources?.[k]?.fetched) sources[k].fetched = previous.sources[k].fetched;
  const out = {
    generated: same && previous.generated ? previous.generated : new Date().toISOString(),
    total: items.length,
    counts,
    first: items[0]?.date,
    last: items.at(-1)?.date,
    sources,
    extra,
    items,
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(`→ ${OUT}: ${items.length} works (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')})`);
  if (Object.values(sources).some(s => !s.ok)) process.exitCode = 2; // data kept, but tell CI
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
