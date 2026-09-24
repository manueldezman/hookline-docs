#!/usr/bin/env node
'use strict';

/**
 * Checks the output of `docusaurus build` + `agent-files.js`.
 * Every published page must exist as HTML and as .md, and appear in llms.txt and llms-full.txt.
 * The .md files must not leak MDX, and every link inside them must resolve.
 */

const fs = require('fs');
const path = require('path');
const { SITE_URL, loadPages } = require('./agent-files');

const BUILD = path.resolve(__dirname, '..', process.argv[2] || 'build');
const read = (name) => fs.readFileSync(path.join(BUILD, name), 'utf-8');
const exists = (p) => fs.existsSync(path.join(BUILD, p));

const pages = loadPages();
const index = read('llms.txt');
const full = read('llms-full.txt');
const errors = [];

for (const { route } of pages) {
  // Docusaurus writes /docs/x/index.html, or /docs/x.html when trailingSlash is false.
  if (!exists(`${route}/index.html`) && !exists(`${route}.html`))
    errors.push(`${route}: no HTML page (did routeFor drift from Docusaurus?)`);
  if (!exists(`${route}.md`)) {
    errors.push(`${route}: missing ${route}.md`);
    continue;
  }
  if (!index.includes(`(${SITE_URL}${route}.md)`)) errors.push(`${route}: missing from llms.txt`);
  if (!full.includes(`Source: ${SITE_URL}${route}\n`)) errors.push(`${route}: missing from llms-full.txt`);

  const twin = read(`${route}.md`);
  // Ignore fenced code: `import` lines are legitimate inside code samples.
  const prose = twin.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');
  if (/<\/?(Tabs|TabItem)\b|@@HOLD_|^import\s.+from\s/m.test(prose))
    errors.push(`${route}.md: leaked MDX (Tabs, imports, or placeholders)`);

  // Every link that points at this site must resolve to a real file.
  for (const [, href] of twin.matchAll(/\]\(([^)\s]+)/g)) {
    if (!href.startsWith(SITE_URL + '/')) continue;
    const target = href.slice(SITE_URL.length).replace(/[#?].*$/, '');
    const isPage = !path.extname(target);
    const ok = isPage ? exists(`${target}/index.html`) || exists(`${target}.html`) : exists(target);
    if (!ok) errors.push(`${route}.md: link does not resolve: ${href}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`✅ ${pages.length}/${pages.length} pages: HTML, .md, llms.txt, llms-full.txt, links OK`);
