#!/usr/bin/env node

const path = require("path");
const { run } = require("../lib/compare");

const [, , fileA, fileB] = process.argv;

if (!fileA || !fileB) {
  console.error("Usage: lcov-comparer <lcov-old.info> <lcov-new.info>");
  process.exit(1);
}

run(path.resolve(fileA), path.resolve(fileB));
