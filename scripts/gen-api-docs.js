#!/usr/bin/env node
'use strict';

/**
 * Renders docs/api/** from openapi/hookline.yaml.
 *
 * The spec is the only source. Generated pages must not be hand-edited; the
 * `--check` mode in CI fails when they drift from the spec.
 * Run `npm run gen:api` after editing the spec. `npm run build` runs it first.
 *
 * Usage: node scripts/gen-api-docs.js [--check]
 *   --check  exit 1 if the generated files differ from what is on disk
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const SPEC_FILE = path.join(ROOT, 'openapi', 'hookline.yaml');
const OUT_DIR = path.join(ROOT, 'docs', 'api');
const CHECK = process.argv.includes('--check');

const spec = yaml.load(fs.readFileSync(SPEC_FILE, 'utf-8'));
const SCHEMAS = spec.components.schemas;
const PARAMS = spec.components.parameters;

const RESOURCE_SCHEMA = {
  Events: 'Event',
  Endpoints: 'Endpoint',
  Deliveries: 'Delivery',
  Account: 'Account',
};

/**
 * Concept pages live in docs/api/about/ and are hand-maintained. They are not
 * emitted by this script, so the stale-file cleanup below has to leave them
 * alone. The cards below are the only generated reference to them.
 */
const ABOUT_CARDS = [
  {title: 'Authentication', slug: 'authentication', image: '/img/cards/concept-authentication.svg'},
  {title: 'Event types', slug: 'event-types', image: '/img/cards/concept-event-types.svg'},
  {title: 'Delivery and retries', slug: 'delivery-and-retries', image: '/img/cards/concept-delivery-and-retries.svg'},
  {title: 'Versioning', slug: 'api-versioning', image: '/img/cards/concept-api-versioning.svg'},
  {title: 'Errors and status codes', slug: 'api-errors', image: '/img/cards/concept-api-errors.svg'},
  {title: 'Delivery IP addresses', slug: 'ip-addresses', image: '/img/cards/concept-ip-addresses.svg'},
  {title: 'Pagination', slug: 'pagination', image: '/img/cards/concept-pagination.svg'},
  {title: 'Rate limits', slug: 'rate-limits', image: '/img/cards/concept-rate-limits.svg'},
];

// ---- helpers ---------------------------------------------------------------

const deref = (node) => {
  if (!node || !node.$ref) return node;
  const parts = node.$ref.split('/');
  const section = parts[parts.length - 2];
  const name = parts[parts.length - 1];
  return (spec.components[section] && spec.components[section][name]) || node;
};

function mergeAllOf(schema) {
  schema = deref(schema);
  if (!schema.allOf) return schema;
  const merged = { type: 'object', properties: {}, required: [] };
  for (const part of schema.allOf) {
    const resolved = mergeAllOf(part);
    for (const [key, value] of Object.entries(resolved.properties || {})) {
      merged.properties[key] = merged.properties[key]
        ? { ...merged.properties[key], ...value }
        : value;
    }
    merged.required.push(...(resolved.required || []));
    if (resolved.description) merged.description = resolved.description;
  }
  return merged;
}

function typeLabel(raw) {
  if (raw && raw.$ref) {
    const name = raw.$ref.split('/').pop();
    return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  }
  const s = deref(raw);
  if (!s) return 'any';
  if (s.type === 'array') return `array of ${typeLabel(s.items || {})}`;
  if (s.enum) return s.enum.map((v) => `\`${v}\``).join(', ');
  if (s.oneOf) return s.oneOf.map(typeLabel).join(' or ');
  if (s.allOf) return typeLabel(mergeAllOf(s));
  if (s.type === 'integer') return s.format ? `integer (${s.format})` : 'integer';
  return s.type || 'object';
}

const cell = (text) => String(text ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();

function table(headers, rows) {
  if (!rows.length) return '_None._\n';
  const head = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
  return head + rows.map((r) => `| ${r.map(cell).join(' | ')} |`).join('\n') + '\n';
}

function schemaRows(raw, depth = 0, prefix = '', maxDepth = 4) {
  const schema = mergeAllOf(raw);
  if (!schema.properties) return [];
  const required = new Set(schema.required || []);
  const rows = [];
  for (const [name, propRaw] of Object.entries(schema.properties)) {
    const prop = deref(propRaw);
    rows.push([
      `\`${prefix}${name}\``,
      typeLabel(prop),
      required.has(name) ? 'Yes' : 'No',
      prop.description || '',
    ]);
    if (depth >= maxDepth) continue;
    const nested = mergeAllOf(prop);
    if (nested.properties) {
      rows.push(...schemaRows(nested, depth + 1, `${prefix}${name}.`, maxDepth));
      continue;
    }
    if (prop.type === 'array') {
      const itemSchema = mergeAllOf(prop.items || {});
      if (itemSchema.properties) {
        rows.push(...schemaRows(itemSchema, depth + 1, `${prefix}${name}[].`, maxDepth));
      }
    }
  }
  return rows;
}

const schemaTable = (raw) =>
  table(['Field', 'Type', 'Required', 'Description'], schemaRows(raw));

const jsonBlock = (value) =>
  value === undefined ? '' : `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n`;

function paramNotes(schema) {
  const s = deref(schema || {});
  const bits = [];
  if (s.minimum !== undefined && s.maximum !== undefined) bits.push(`Between ${s.minimum} and ${s.maximum}.`);
  else if (s.minimum !== undefined) bits.push(`Minimum ${s.minimum}.`);
  else if (s.maximum !== undefined) bits.push(`Maximum ${s.maximum}.`);
  if (s.default !== undefined) bits.push(`Default \`${String(s.default)}\`.`);
  return bits.join(' ');
}

function paramsTable(params) {
  if (!params || !params.length) return '';
  return table(
    ['Name', 'In', 'Type', 'Required', 'Description'],
    params.map((raw) => {
      const p = deref(raw);
      const notes = paramNotes(p.schema);
      const description = [p.description, notes].filter(Boolean).join(' ');
      return [
        `\`${p.in === 'path' ? `{${p.name}}` : p.name}\``,
        p.in,
        typeLabel(p.schema || {}),
        p.required ? 'Yes' : 'No',
        description,
      ];
    }),
  );
}

// One runnable call per operation. The path is filled with a real-looking id,
// query parameters carry their default, and the body matches the table above.
function curlExample(op, pathParams, queryParams, requestExample) {
  let url = spec.servers[0].url + op.path;
  for (const raw of pathParams) {
    const p = deref(raw);
    const s = deref(p.schema || {});
    const value = s.example !== undefined ? s.example : p.example !== undefined ? p.example : `{${p.name}}`;
    url = url.split(`{${p.name}}`).join(String(value));
  }
  const qs = [];
  for (const raw of queryParams) {
    const p = deref(raw);
    const s = deref(p.schema || {});
    if (p.required) qs.push(`${p.name}=${s.example !== undefined ? s.example : '...'}`);
    else if (s.default !== undefined) qs.push(`${p.name}=${s.default}`);
  }
  if (qs.length) url += `?${qs.join('&')}`;
  const lines = [
    `curl -X ${op.method.toUpperCase()} "${url}" \\`,
    '  -H "Authorization: Bearer $HOOKLINE_API_KEY"',
  ];
  if (requestExample) {
    lines[1] += ' \\';
    lines.push('  -H "Content-Type: application/json" \\');
    lines.push(`  -d '${JSON.stringify(requestExample)}'`);
  }
  return '```bash\n' + lines.join('\n') + '\n```\n';
}

const camelToKebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`).replace(/^-/, '');

const STATUS_TEXT = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};

const statusLabel = (status) => `${status} ${STATUS_TEXT[status] || ''}`.trim();

function methodSlug(tagName, operationId) {
  const forms = [
    tagName,
    tagName.replace(/ies$/, 'y'),
    tagName.replace(/s$/, ''),
  ].filter(Boolean);
  let base = operationId;
  for (const form of forms) {
    if (base.endsWith(form)) {
      base = base.slice(0, -form.length);
      break;
    }
  }
  return camelToKebab(base) || 'call';
}

const humanize = (slug) => {
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

// "Delete an endpoint" -> "Delete endpoint", so a sidebar entry names the
// object the reader is acting on instead of repeating a bare verb.
const intentLabel = (summary) =>
  String(summary || '')
    .replace(/^(\w+)\s+(?:a|an|the)\s+/i, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();

function schemaExample(raw) {
  const s = mergeAllOf(raw);
  if (s.example) return s.example;
  if (!s.properties) return undefined;
  const out = {};
  for (const [key, value] of Object.entries(s.properties)) {
    const prop = deref(value);
    if (prop.example !== undefined) out[key] = prop.example;
    else if (prop.properties) out[key] = schemaExample(prop);
    else if (prop.type === 'array') {
      const item = prop.items && prop.items.$ref ? schemaExample(deref(prop.items)) : undefined;
      out[key] = item ? [item] : [];
    }
  }
  return Object.keys(out).length ? out : undefined;
}

const clip = (text, max = 155) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 3).trimEnd()}...`;
};

const firstSentence = (text) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  const match = clean.match(/^(.+?[.!?])(?:\s|$)/);
  return clip(match ? match[1] : clean);
};

// ---- page builders ---------------------------------------------------------

const files = new Map();

function emit(relPath, contents) {
  files.set(relPath, contents);
}

function methodPage(tagName, op, slug, position) {
  const title = op.summary || humanize(slug);
  const folder = tagName.toLowerCase();
  const endPath = op.path;
  const responseEntries = Object.entries(op.responses || {});
  const samples = op['x-code-samples'] || [];

  const body = [];
  body.push('---');
  body.push(`title: ${title}`);
  body.push(`description: ${JSON.stringify(firstSentence(op.description || title))}`);
  body.push(`sidebar_label: ${intentLabel(title)}`);
  body.push(`sidebar_custom_props: {method: ${op.method.toUpperCase()}}`);
  body.push(`sidebar_position: ${position}`);
  body.push('displayed_sidebar: apiSidebar');
  body.push('---');
  body.push('');
  body.push("import Endpoint from '@site/src/components/Endpoint';");
  if (responseEntries.length > 1 || samples.length) {
    body.push("import Tabs from '@theme/Tabs';");
    body.push("import TabItem from '@theme/TabItem';");
  }
  body.push('');
  body.push(`# ${title}`);
  body.push('');
  body.push(`<Endpoint method="${op.method.toUpperCase()}" path="${endPath}" />`);
  body.push('');
  if (op.description) {
    body.push(op.description.trim());
    body.push('');
  }
  const pathParams = (op.parameters || []).filter((p) => deref(p).in === 'path');
  if (pathParams.length) {
    body.push('## Path parameters');
    body.push('');
    body.push(paramsTable(pathParams));
  }
  const queryParams = (op.parameters || []).filter((p) => deref(p).in === 'query');
  if (queryParams.length) {
    body.push('## Query parameters');
    body.push('');
    body.push(paramsTable(queryParams));
  }
  const rb = op.requestBody && op.requestBody.content['application/json'];
  let requestExample;
  if (rb) {
    body.push('## Request body');
    body.push('');
    body.push(schemaTable(rb.schema));
    requestExample = rb.example || schemaExample(rb.schema);
    if (requestExample) {
      body.push('Example request body.');
      body.push('');
      body.push(jsonBlock(requestExample));
    }
  }
  body.push('## Request example');
  body.push('');
  if (samples.length) {
    body.push('<Tabs>');
    body.push('<TabItem value="curl" label="curl">');
    body.push('');
    body.push(curlExample(op, pathParams, queryParams, requestExample));
    body.push('</TabItem>');
    for (const sample of samples) {
      const lang = String(sample.lang || 'Example');
      const value = lang.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const fence = /python/i.test(lang) ? 'python' : /node|javascript|js/i.test(lang) ? 'js' : 'text';
      body.push(`<TabItem value="${value}" label="${lang}">`);
      body.push('');
      body.push(`\`\`\`${fence}\n${String(sample.source).replace(/\s+$/, '')}\n\`\`\`\n`);
      body.push('</TabItem>');
    }
    body.push('</Tabs>');
    body.push('');
  } else {
    body.push(curlExample(op, pathParams, queryParams, requestExample));
  }
  body.push('## Responses');
  body.push('');
  const useTabs = responseEntries.length > 1;
  if (useTabs) body.push('<Tabs>');
  for (const [status, rawResponse] of responseEntries) {
    const response = rawResponse.$ref ? deref(rawResponse) : rawResponse;
    if (useTabs) {
      body.push(`<TabItem value="${status}" label="${statusLabel(status)}">`);
      body.push('');
    } else {
      body.push(`### ${statusLabel(status)}`);
      body.push('');
    }
    if (response.description) {
      body.push(response.description.trim());
      body.push('');
    }
    const content = response.content && response.content['application/json'];
    if (content) {
      body.push(schemaTable(content.schema));
      const responseExample = content.example || schemaExample(content.schema);
      if (responseExample) {
        body.push('Example response.');
        body.push('');
        body.push(jsonBlock(responseExample));
      }
    }
    if (useTabs) body.push('</TabItem>');
  }
  if (useTabs) body.push('</Tabs>');
  body.push('');

  emit(path.join(folder, `${slug}.md`), body.join('\n'));
}

function resourcePage(tag, folder, position, methods) {
  const title = tag.name;
  const schemaName = RESOURCE_SCHEMA[tag.name];
  const schema = schemaName ? SCHEMAS[schemaName] : null;
  const firstLine = (tag.description || '').split('\n')[0].trim();

  const body = [];
  body.push('---');
  body.push(`title: ${title}`);
  body.push(`description: ${JSON.stringify(clip(firstLine || title))}`);
  body.push(`sidebar_position: ${position}`);
  body.push('displayed_sidebar: apiSidebar');
  body.push('---');
  body.push('');
  body.push(`# ${title}`);
  body.push('');
  body.push(tag.description.trim());
  body.push('');
  const firstSegment = methods.map((m) => m.path.split('/').filter(Boolean)[0]).find(Boolean);
  const resourcePath = firstSegment ? `/${firstSegment}` : '';
  body.push(`**Resource URL** **\`${spec.servers[0].url}${resourcePath}\`**`);
  body.push('');
  body.push('## Methods');
  body.push('');
  body.push(
    table(
      ['Method', 'Path', 'Description'],
      methods.map((m) => [
        `[${m.op.summary}](./${m.slug}.md)`,
        `\`${m.method.toUpperCase()} ${m.path}\``,
        (m.op.description || '').split('\n')[0].trim(),
      ]),
    ),
  );
  if (schema) {
    body.push(`## The ${schemaName.toLowerCase()} object`);
    body.push('');
    if (schema.description) {
      body.push(schema.description);
      body.push('');
    }
    body.push(schemaTable(schema));
    const example = schemaExample(schema);
    if (example) {
      body.push('Example.');
      body.push('');
      body.push(jsonBlock(example));
    }
  }
  const sections = tag['x-docs'] && tag['x-docs'].sections;
  if (sections) {
    for (const section of sections) {
      body.push(`## ${section.title}`);
      body.push('');
      body.push(String(section.body).trim());
      body.push('');
    }
  }
  body.push('');
  emit(path.join(folder, 'index.md'), body.join('\n'));
}

function rootPage(tags) {
  const content = [];
  content.push('---');
  content.push('title: API reference');
  content.push('description: Every Hookline API resource, its object schema, and the methods you can call.');
  content.push('sidebar_position: 50');
  content.push('displayed_sidebar: apiSidebar');
  content.push('---');
  content.push('');
  content.push("import TopicCards from '@site/src/components/TopicCards';");
  content.push('');
  content.push('# API reference');
  content.push('');
  content.push(spec.info.description.trim());
  content.push('');
  content.push('Every call rests on the same building blocks.');
  content.push('');
  const topics = ABOUT_CARDS.map(
    (card) =>
      `{title: '${card.title}', to: '/docs/api/about/${card.slug}', image: '${card.image}'}`,
  ).join(', ');
  content.push(`<TopicCards topics={[${topics}]} />`);
  content.push('');
  content.push('## Resources');
  content.push('');
  content.push(
    table(
      ['Resource', 'Methods', 'What it covers'],
      tags.map((tag) => [
        `[${tag.name}](./${tag.name.toLowerCase()}/index.md)`,
        String((byTag.get(tag.name) || []).length),
        (tag.description || '').split('\n')[0].trim(),
      ]),
    ),
  );
  content.push('');
  content.push(`The base URL is \`${spec.servers[0].url}\`. Every request needs a bearer key in the \`Authorization\` header, issued in the dashboard and scoped to one account, which [Authentication](./about/authentication.md) covers. The path carries the major version, and the \`Hookline-Version\` header pins a dated one, which [Versioning](./about/api-versioning.md) covers. If you have not sent an event yet, start with the [quick start](../getting-started/quick-start.md).`);
  content.push('');
  emit('index.md', content.join('\n'));
}

// ---- main ------------------------------------------------------------------

const tagNames = (spec.tags || []).map((t) => t.name);

// Attach the path and method to every operation, then group by tag.
const operations = [];
for (const [p, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
    operations.push({ path: p, method, op: { ...op, path: p, method } });
  }
}

const byTag = new Map(tagNames.map((name) => [name, []]));
for (const entry of operations) {
  const tag = (entry.op.tags || [])[0];
  if (!byTag.has(tag)) byTag.set(tag, []);
  byTag.get(tag).push(entry);
}

const tagMethods = (name) => byTag.get(name) || [];

const categories = [];
tagNames.forEach((name, index) => {
  const folder = name.toLowerCase();
  const methods = byTag.get(name).map((entry) => ({
    ...entry,
    slug: methodSlug(name, entry.op.operationId),
  }));
  const tag = spec.tags.find((t) => t.name === name);
  resourcePage(tag, folder, index + 2, methods);
  methods.forEach((m, i) => methodPage(name, m.op, m.slug, i + 2));

  categories.push({ folder, label: name });
  emit(
    path.join(folder, '_category_.json'),
    JSON.stringify(
      { label: name, position: index + 1, link: { type: 'doc', id: `api/${folder}/index` } },
      null,
      2,
    ) + '\n',
  );
});

rootPage(spec.tags);
emit(
  '_category_.json',
  JSON.stringify(
    { label: 'API reference', position: 5, collapsed: false, link: { type: 'doc', id: 'api/index' } },
    null,
    2,
  ) + '\n',
);

// ---- write -----------------------------------------------------------------

const changed = [];
for (const [rel, contents] of files) {
  const target = path.join(OUT_DIR, rel);
  const before = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8') : null;
  if (before !== contents) changed.push(rel);
  if (CHECK) continue;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf-8');
}

// Remove stale generated pages. Hand-maintained pages under about/ and the
// troubleshooting page are not part of the emitted set, so they are skipped.
const HAND_MAINTAINED = (rel) => rel.split(path.sep)[0] === 'about' || rel === 'troubleshooting.md';

if (!CHECK && fs.existsSync(OUT_DIR)) {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : [full];
    });
  for (const file of walk(OUT_DIR)) {
    const rel = path.relative(OUT_DIR, file);
    if (!files.has(rel) && !HAND_MAINTAINED(rel)) {
      fs.unlinkSync(file);
      changed.push(`${rel} (removed)`);
    }
  }
}

if (CHECK && changed.length) {
  console.error(`Generated API docs are stale. Run npm run gen:api.\n${changed.join('\n')}`);
  process.exit(1);
}

console.log(`${CHECK ? 'Checked' : 'Generated'} ${files.size} pages${changed.length ? `, ${changed.length} changed` : ''}.`);
