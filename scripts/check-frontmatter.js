#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { listDocFiles } = require('./agent-files');

const REQUIRED = ['title', 'description'];
const MAX_DESCRIPTION = 160;
const errors = [];

for (const file of listDocFiles()) {
  const rel = path.relative(process.cwd(), file);
  try {
    const { data } = matter(fs.readFileSync(file, 'utf-8'));
    for (const key of REQUIRED) {
      if (!String(data[key] ?? '').trim()) errors.push(`${rel}: missing "${key}"`);
    }
    if (data.description && String(data.description).length > MAX_DESCRIPTION)
      errors.push(`${rel}: description is over ${MAX_DESCRIPTION} characters`);
  } catch (e) {
    errors.push(`${rel}: malformed front matter (${e.reason || e.message})`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('✅ Front matter valid');
