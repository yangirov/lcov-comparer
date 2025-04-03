function generateConsoleReport(rows) {
  const fmtPercent = (v) => v.toFixed(1) + '%';
  console.log('\n');
  console.log('| File | Statements | Δ | Branches | Δ | Functions | Δ | Lines | Δ |');
  console.log('|------|------------|----|----------|----|-----------|----|-------|----|');
  for (const row of rows) {
    console.log(
      `| ${row.file} | ${fmtPercent(row.statements.from)} → ${fmtPercent(row.statements.to)} | ${fmtPercent(row.statements.delta)} | ` +
        `${fmtPercent(row.branches.from)} → ${fmtPercent(row.branches.to)} | ${fmtPercent(row.branches.delta)} | ` +
        `${fmtPercent(row.functions.from)} → ${fmtPercent(row.functions.to)} | ${fmtPercent(row.functions.delta)} | ` +
        `${fmtPercent(row.lines.from)} → ${fmtPercent(row.lines.to)} | ${fmtPercent(row.lines.delta)} |`
    );
  }
}

module.exports = generateConsoleReport;
