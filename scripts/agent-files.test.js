'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { DOCS_DIR, SITE_URL, routeFor, absolutize, serializeMdx } = require('./agent-files');

test('tabs become labeled sections and keep code blocks', () => {
  const input = [
    '<Tabs>',
    '  <TabItem value="npm" label="npm">',
    '',
    '  ```bash',
    '  npm install foo',
    '  ```',
    '',
    '  </TabItem>',
    '</Tabs>',
  ].join('\n');
  const out = serializeMdx(input);
  assert.match(out, /### npm/);
  assert.match(out, /^```bash\nnpm install foo\n```$/m);
  assert.doesNotMatch(out, /<Tabs|<TabItem/);
});

test('inline code containing tags is left alone', () => {
  assert.match(serializeMdx('Use `<Tabs>` for variants.'), /`<Tabs>`/);
});

test('admonitions become bold labels', () => {
  const out = serializeMdx(':::warning\nKeep keys secret.\n:::');
  assert.match(out, /\*\*Warning:\*\*/);
  assert.doesNotMatch(out, /:::/);
});

test('imports and unknown components are removed but children stay', () => {
  const out = serializeMdx("import X from '@site/x';\n\n<Card title=\"a\">Hello</Card>");
  assert.doesNotMatch(out, /import|<Card/);
  assert.match(out, /Hello/);
});

test('links and images become absolute', () => {
  const file = path.join(DOCS_DIR, 'guides', 'setup.md');
  assert.equal(absolutize('/img/a.svg', file), `${SITE_URL}/img/a.svg`);
  assert.equal(absolutize('./other.md#top', file), `${SITE_URL}/docs/guides/other.md#top`);
  assert.equal(absolutize('../intro.md', file), `${SITE_URL}/docs/intro.md`);
  assert.equal(absolutize('https://example.org/x', file), 'https://example.org/x');
  assert.equal(absolutize('#section', file), '#section');
});

test('routes follow Docusaurus rules', () => {
  assert.equal(routeFor(path.join(DOCS_DIR, 'quick-start.md')), '/docs/quick-start');
  assert.equal(routeFor(path.join(DOCS_DIR, '01-guides', 'index.md')), '/docs/guides');
  assert.equal(routeFor(path.join(DOCS_DIR, 'guides', '02-setup.mdx')), '/docs/guides/setup');
  assert.equal(routeFor(path.join(DOCS_DIR, 'x.md'), { slug: '/custom' }), '/docs/custom');
});
