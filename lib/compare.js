function percent(c, t) {
  return t === 0 ? 100 : (c / t) * 100;
}

function compareAndCollect(a, b, threshold = null) {
  const allFiles = new Set([...Object.keys(a), ...Object.keys(b)]);
  const result = [];

  for (const file of allFiles) {
    const entryA = a[file];
    const entryB = b[file];
    if (!entryA || !entryB) continue;

    const row = { file };

    for (const key of ['statements', 'branches', 'functions', 'lines']) {
      const from = percent(entryA[key].covered, entryA[key].total);
      const to = percent(entryB[key].covered, entryB[key].total);
      row[key] = { from, to, delta: to - from };
    }

    row.maxDelta = Math.max(
      Math.abs(row.statements.delta),
      Math.abs(row.branches.delta),
      Math.abs(row.functions.delta),
      Math.abs(row.lines.delta)
    );

    if (threshold === null || row.maxDelta >= threshold) {
      result.push(row);
    }
  }

  result.sort((a, b) => b.maxDelta - a.maxDelta);

  return result;
}

module.exports = { compareAndCollect };
