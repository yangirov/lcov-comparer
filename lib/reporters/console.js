function generateConsoleReport(rows) {
  const fmt = (v) => v.toFixed(1) + '%';
  console.log('\n');
  console.log(
    '| File | New | Status | Statements | Δ | Branches | Δ | Functions | Δ | Lines | Δ |'
  );
  console.log(
    '|------|-----|--------|------------|----|---------|---|-----------|---|-------|---|'
  );
  for (const row of rows) {
    const { file, isNew, testStatus, statements, branches, functions: funcs, lines } = row;
    console.log(
      `| ${file} | ${isNew ? '🆕' : ''} | ${testStatus} | ` +
        `${fmt(statements.from)} → ${fmt(statements.to)} | ${fmt(statements.delta)} | ` +
        `${fmt(branches.from)} → ${fmt(branches.to)} | ${fmt(branches.delta)} | ` +
        `${fmt(funcs.from)} → ${fmt(funcs.to)} | ${fmt(funcs.delta)} | ` +
        `${fmt(lines.from)} → ${fmt(lines.to)} | ${fmt(lines.delta)} |`
    );
  }
}

module.exports = generateConsoleReport;
