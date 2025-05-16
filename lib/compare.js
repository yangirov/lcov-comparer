function percent(c, t) {
  return t === 0 ? 100 : (c / t) * 100;
}

function compareAndCollect(oldCov, newCov, threshold = null) {
  const allFiles = new Set([...Object.keys(oldCov), ...Object.keys(newCov)]);
  const result = [];

  const zero = {
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    lines: { total: 0, covered: 0 },
  };

  for (const file of allFiles) {
    const hasOld = Object.prototype.hasOwnProperty.call(oldCov, file);
    const hasNew = Object.prototype.hasOwnProperty.call(newCov, file);

    if (hasOld && !hasNew) continue;

    const entryA = oldCov[file] || zero;
    const entryB = newCov[file] || zero;
    const row = { file, isNew: !hasOld };

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

    row.testStatus = row.isNew ? (row.lines.to > 0 ? 'tested' : 'no-tests') : 'existing';

    if (threshold === null || row.maxDelta >= threshold) {
      result.push(row);
    }
  }

  result.sort((a, b) => b.maxDelta - a.maxDelta);
  return result;
}

module.exports = { compareAndCollect };
