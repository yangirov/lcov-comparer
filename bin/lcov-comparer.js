#!/usr/bin/env node

const path = require('path');
const { run } = require('../lib/compare');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(
    'Usage: lcov-comparer <lcov-old.info> <lcov-new.info> [--out file] [--threshold n]'
  );

  process.exit(1);
}

const fileA = args[0];
const fileB = args[1];

let outFile = 'coverage-diff.html';
let threshold = null;

for (let i = 2; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--out' && args[i + 1]) {
    outFile = args[i + 1];
    i++;
  } else if (arg === '--threshold' && args[i + 1]) {
    threshold = parseFloat(args[i + 1]);
    i++;
  }
}

run(path.resolve(fileA), path.resolve(fileB), { outFile, threshold });
