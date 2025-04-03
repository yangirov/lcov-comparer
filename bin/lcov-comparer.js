#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const minimist = require('minimist');
const { run } = require('../lib/main');

const argv = minimist(process.argv.slice(2), {
  boolean: ['summary'],
  string: ['formats', 'out-dir'],
  default: {
    formats: 'html',
  },
});

const [fileA, fileB] = argv._;

if (!fileA || !fileB) {
  console.error(`Usage:
lcov-comparer <lcov-old.info> <lcov-new.info> [options]

Options:
  --formats       Comma-separated list of formats (html,json,csv,md,console)
  --out-dir       Output directory
  --threshold     Minimum per-file delta to include
  --max-coverage-drop    Minimum % to enforce across all files
  --summary       Print overall coverage deltas
`);
  process.exit(1);
}

const outDir = argv['out-dir'] || null;
const withSummary = argv.summary;
const formats = argv.formats.split(',').map((f) => f.trim());
const threshold = argv.threshold != null ? parseFloat(argv.threshold) : null;
const maxCoverageDrop =
  argv['max-coverage-drop'] != null ? parseFloat(argv['max-coverage-drop']) : null;

if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
}

run(path.resolve(fileA), path.resolve(fileB), {
  formats,
  outDir,
  threshold,
  maxCoverageDrop,
  withSummary,
});
