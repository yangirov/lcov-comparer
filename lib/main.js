const fs = require('fs');
const path = require('path');

const generators = require('./reporters');
const { parseLcov } = require('./parser');
const { getSummary, printSummary } = require('./summary');
const { compareAndCollect } = require('./compare');

function run(fileA, fileB, options = {}) {
  const {
    formats = ['html'],
    outDir = null,
    threshold = null,
    withSummary = false,
    maxCoverageDrop = null,
  } = options;

  const contentA = fs.readFileSync(fileA, 'utf8');
  const contentB = fs.readFileSync(fileB, 'utf8');

  const coverageA = parseLcov(contentA);
  const coverageB = parseLcov(contentB);

  const rows = compareAndCollect(coverageA, coverageB, threshold);
  const summary = getSummary(rows);

  if (withSummary) {
    printSummary(summary);
  }

  for (const fmt of formats) {
    const fn = generators.get(fmt);
    if (!fn) {
      console.error(`❌ Unsupported output format: ${fmt}`);
      process.exit(1);
    }

    if (fmt === 'console') {
      fn(rows);
    } else {
      const outPath = outDir ? path.join(outDir, `coverage-diff.${fmt}`) : `coverage-diff.${fmt}`;
      fn(rows, outPath);
    }
  }

  if (maxCoverageDrop !== null) {
    const tooLow = Object.entries(summary).some(([, delta]) => delta < -maxCoverageDrop);
    if (tooLow) {
      console.error(`❌ Coverage delta dropped below -${maxCoverageDrop}%`);
      process.exit(1);
    }
  }
}

module.exports = { run };
