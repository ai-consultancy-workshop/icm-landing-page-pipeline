#!/usr/bin/env node
// scrape-site.mjs — capture brand evidence from an existing website (stage 01, path A).
//
// Visual-preferred with an HTML fallback:
//   1. Try Playwright (headless Chromium): full-page screenshot + computed colours,
//      fonts, radius and spacing samples from the rendered page.
//   2. If Playwright is unavailable (not installed / no browser), fall back to a
//      plain HTTP fetch of the HTML so the stage still has something to interpret.
//
// This script only gathers evidence. Stage 01 interprets it into brand tokens —
// it does not copy raw values blindly.
//
// Usage:  node scrape-site.mjs <url> [outDir]
// Output (in outDir, default ./output):
//   screenshot.png      (Playwright only)
//   extracted.json      colours, fonts, radius/spacing samples, meta, method
//   page.html           raw HTML (fallback or saved for reference)
//   content.md          readable text + headings + links for voice/copy analysis

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [, , urlArg, outArg] = process.argv;

if (!urlArg) {
  console.error('Usage: node scrape-site.mjs <url> [outDir]');
  process.exit(1);
}

const url = /^https?:\/\//i.test(urlArg) ? urlArg : `https://${urlArg}`;
const outDir = outArg || './output';

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[2]);
    if (text) out.push(`h${m[1]}: ${text}`);
  }
  return out.slice(0, 40);
}

function extractColorsFromCss(html) {
  const colors = new Set();
  const re = /(#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|oklch\([^)]*\)|hsla?\([^)]*\))/gi;
  let m;
  while ((m = re.exec(html)) !== null) colors.add(m[1].toLowerCase());
  return [...colors].slice(0, 60);
}

async function viaPlaywright() {
  // Dynamic import so the script still runs (fallback) when Playwright is absent.
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

    await page.screenshot({ path: join(outDir, 'screenshot.png'), fullPage: true });
    const html = await page.content();

    const sampled = await page.evaluate(() => {
      const seen = new Map();
      const bump = (k, v) => {
        if (!v) return;
        const key = `${k}:${v}`;
        seen.set(key, (seen.get(key) || 0) + 1);
      };
      const els = Array.from(document.querySelectorAll('body *')).slice(0, 4000);
      for (const el of els) {
        const cs = getComputedStyle(el);
        bump('color', cs.color);
        bump('background', cs.backgroundColor);
        bump('font', cs.fontFamily);
        bump('radius', cs.borderTopLeftRadius);
      }
      const top = (prefix) =>
        [...seen.entries()]
          .filter(([k]) => k.startsWith(prefix + ':'))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([k, count]) => ({ value: k.slice(prefix.length + 1), count }));
      const title = document.title || null;
      const desc =
        document.querySelector('meta[name="description"]')?.content || null;
      return {
        colors: top('color'),
        backgrounds: top('background'),
        fonts: top('font'),
        radii: top('radius'),
        meta: { title, description: desc },
      };
    });

    return { method: 'playwright', html, sampled };
  } finally {
    await browser.close();
  }
}

async function viaFetch() {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (landing-page-pipeline scrape)' },
    redirect: 'follow',
  });
  const html = await res.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  );
  return {
    method: 'fetch',
    html,
    sampled: {
      colors: extractColorsFromCss(html).map((value) => ({ value, count: null })),
      backgrounds: [],
      fonts: [],
      radii: [],
      meta: {
        title: titleMatch ? stripTags(titleMatch[1]) : null,
        description: descMatch ? descMatch[1] : null,
      },
    },
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });

  let result;
  try {
    result = await viaPlaywright();
    console.log('scrape: captured visually via Playwright');
  } catch (err) {
    console.warn(
      `scrape: Playwright unavailable (${err?.message ?? err}); falling back to HTML fetch`,
    );
    result = await viaFetch();
    console.log('scrape: captured HTML via fetch');
  }

  const { method, html, sampled } = result;

  await writeFile(join(outDir, 'page.html'), html, 'utf8');

  const extracted = {
    url,
    method,
    captured_at: new Date().toISOString(),
    ...sampled,
  };
  await writeFile(
    join(outDir, 'extracted.json'),
    JSON.stringify(extracted, null, 2),
    'utf8',
  );

  const text = stripTags(html);
  const content = [
    `# Scraped content — ${url}`,
    ``,
    `Method: ${method}`,
    `Title: ${sampled.meta?.title ?? '(none)'}`,
    `Description: ${sampled.meta?.description ?? '(none)'}`,
    ``,
    `## Headings`,
    ...extractHeadings(html),
    ``,
    `## Body text (truncated)`,
    text.slice(0, 8000),
  ].join('\n');
  await writeFile(join(outDir, 'content.md'), content, 'utf8');

  console.log(`scrape: wrote evidence to ${outDir} (screenshot only if playwright)`);
}

main().catch((err) => {
  console.error('scrape: failed:', err);
  process.exit(1);
});
