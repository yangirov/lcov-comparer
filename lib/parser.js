function parseLcov(content) {
  const data = {};
  const blocks = content.split('end_of_record');

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    let file = '';
    let statements = { total: 0, covered: 0 };
    let linesCount = { total: 0, covered: 0 };
    let functions = { total: 0, covered: 0 };
    let branches = { total: 0, covered: 0 };

    for (const line of lines) {
      if (line.startsWith('SF:')) {
        file = line.slice(3).trim();
      } else if (line.startsWith('DA:')) {
        linesCount.total++;
        statements.total++;

        const [, hits] = line.slice(3).split(',').map(Number);
        if (hits > 0) {
          linesCount.covered++;
          statements.covered++;
        }
      } else if (line.startsWith('FNDA:')) {
        functions.total++;

        const hits = parseInt(line.split(',')[0].slice(5), 10);
        if (hits > 0) {
          functions.covered++;
        }
      } else if (line.startsWith('BRDA:')) {
        branches.total++;

        const hits = line.split(',')[3];
        if (hits !== '-' && parseInt(hits, 10) > 0) {
          branches.covered++;
        }
      }
    }

    if (file) {
      data[file] = { statements, branches, functions, lines: linesCount };
    }
  }

  return data;
}

module.exports = { parseLcov };
