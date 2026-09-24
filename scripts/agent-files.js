#!/usr/bin/env node
'use strict';

/**
 * Generates the agent-facing output after `docusaurus build`:
 *   - a Markdown twin for every page (build/docs/intro.md next to build/docs/intro/)
 *   - llms.txt      (index of every page, per llmstxt.org)
 *   - llms-full.txt (every page in one file)
 *
 * Usage: node scripts/agent-files.js [outDir]   (default: build)
 * Zero dependencies apart from gray-matter.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const site = require('../site.json');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const ROUTE_BASE = '/docs'; // must match `routeBasePath` in docusaurus.config.ts

// Full public URL of the site including baseUrl, no trailing slash.
const SITE_URL = (
  process.env.SITE_URL || `https://${site.githubUser}.github.io/${site.repo}`
).replace(/\/$/, '');

// Docusaurus strips number prefixes from file and folder names: "01-intro.md" -> "intro".
const stripPrefix = (s) => s.replace(/^\d+\s*[-_.]+\s*/, '');

function listDocFiles(dir = DOCS_DIR) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listDocFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

const joinRoute = (p) => `${ROUTE_BASE}/${p}`.replace(/\/+/g, '/').replace(/\/$/, '');

// Work out the URL Docusaurus gives this file.
function routeFor(file, data = {}) {
  const parts = path.relative(DOCS_DIR, file).split(path.sep);
  const fileName = stripPrefix(parts.pop().replace(/\.mdx?$/, ''));
  const dirs = parts.map(stripPrefix);
  if (data.slug && data.slug.startsWith('/')) return joinRoute(data.slug);
  const isIndex = ['index', 'README'].includes(fileName) || fileName === dirs[dirs.length - 1];
  const segments = data.slug ? [...dirs, data.slug] : isIndex ? dirs : [...dirs, fileName];
  return joinRoute(segments.join('/'));
}

// Turn a link found inside a page into an absolute URL that works outside the site.
function absolutize(href, file) {
  if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) return href; // https:, mailto:, #hash
  const [, pathPart, rest = ''] = href.match(/^([^#?]*)([#?].*)?$/);
  if (!pathPart) return href;
  if (pathPart.startsWith('/')) return `${SITE_URL}${pathPart}${rest}`;
  const abs = path.resolve(path.dirname(file), pathPart);
  const inDocs = abs.startsWith(DOCS_DIR + path.sep);
  if (inDocs && /\.mdx?$/.test(abs)) {
    const rel = path.relative(DOCS_DIR, abs).replace(/\.mdx?$/, '');
    const route = joinRoute(rel.split(path.sep).map(stripPrefix).join('/'));
    return `${SITE_URL}${route}.md${rest}`;
  }
  return href; // co-located assets get hashed by Docusaurus; keep those under static/ instead
}

const FENCE = /^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm;

const dedent = (block) => {
  const indent = block.match(/^[ \t]*/)[0];
  return block.replace(new RegExp(`^${indent}`, 'gm'), '');
};

function tabLabel(attrs) {
  const m =
    attrs.match(/label=(?:"([^"]*)"|'([^']*)'|\{\s*["'`]([^"'`]*)["'`]\s*\})/) ||
    attrs.match(/value=(?:"([^"]*)"|'([^']*)')/);
  return m ? m[1] || m[2] || m[3] : 'Option';
}

// MDX -> plain Markdown.
function serializeMdx(source, file = path.join(DOCS_DIR, 'page.md')) {
  const stash = [];
  const hold = (s) => `@@HOLD_${stash.push(s) - 1}@@`;

  // 1. Protect code first so nothing below can touch it.
  let text = source.replace(FENCE, (block) => `\n${hold(dedent(block))}\n`).replace(/`[^`\n]+`/g, hold);

  // 2. Convert or remove MDX. Tabs become headings BEFORE component tags are stripped.
  text = text
    .replace(/<BrowserOnly\b[\s\S]*?<\/BrowserOnly>/g, '')
    .replace(/^import\s.+from\s+['"].+['"];?[ \t]*$/gm, '')
    .replace(/^export\s.+$/gm, '')
    .replace(/<TabItem\b([^>]*)>/g, (_, attrs) => `\n### ${tabLabel(attrs)}\n`)
    .replace(/<\/?(?:Tabs|TabItem)\b[^>]*>/g, '')
    .replace(/^:::(\w+)[ \t]*\[?([^\]\n]*)\]?[ \t]*$/gm, (_, type, title) =>
      `**${title.trim() || type[0].toUpperCase() + type.slice(1)}:**`)
    .replace(/^:::[ \t]*$/gm, '')
    .replace(/<\/?[A-Z][A-Za-z0-9.]*\b[^>]*>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\n{3,}/g, '\n\n');

  // 3. Make links and image URLs absolute.
  text = text.replace(
    /(!?\[[^\]\n]*\])\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
    (_, label, href, title) => `${label}(${absolutize(href, file)}${title})`,
  );

  // 4. Put the protected code back.
  return text.replace(/@@HOLD_(\d+)@@/g, (_, i) => stash[Number(i)]).trim() + '\n';
}

function buildPage(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
  if (data.draft) return null; // Docusaurus leaves drafts out of production builds
  const route = routeFor(file, data);
  const title = data.title || route;
  const body = serializeMdx(content, file).replace(/^# .*\n+/, '');
  const markdown = [
    `# ${title}`,
    '',
    data.description ? `> ${data.description}\n` : '',
    `Source: ${SITE_URL}${route}`,
    '',
    body,
  ].join('\n');
  return { route, title, description: data.description || '', markdown };
}

const loadPages = () =>
  listDocFiles()
    .map(buildPage)
    .filter(Boolean)
    .sort((a, b) => a.route.localeCompare(b.route));

function buildIndex(pages) {
  const links = pages.map(
    (p) => `- [${p.title}](${SITE_URL}${p.route}.md)${p.description ? `: ${p.description}` : ''}`,
  );
  return [
    `# ${site.title}`,
    '',
    `> ${site.summary}`,
    '',
    '## Docs',
    '',
    ...links,
    '',
    '## Optional',
    '',
    `- [Full documentation](${SITE_URL}/llms-full.txt): every page in one file`,
    '',
  ].join('\n');
}

const buildFull = (pages) => pages.map((p) => p.markdown).join('\n---\n\n');

function main() {
  const outDir = path.resolve(ROOT, process.argv[2] || 'build');
  const pages = loadPages();
  for (const page of pages) {
    const target = path.join(outDir, `${page.route}.md`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, page.markdown, 'utf-8');
  }
  fs.writeFileSync(path.join(outDir, 'llms.txt'), buildIndex(pages), 'utf-8');
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), buildFull(pages), 'utf-8');
  console.log(`Generated ${pages.length} pages + llms.txt + llms-full.txt in ${outDir}`);
}

module.exports = { DOCS_DIR, SITE_URL, listDocFiles, routeFor, absolutize, serializeMdx, buildPage, loadPages };

if (require.main === module) main();
