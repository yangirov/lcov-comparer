const fs = require('fs');

function generateMarkdownReport(rows, file) {
  const lines = [
    '| File | Statements | Δ | Branches | Δ | Functions | Δ | Lines | Δ |',
    '|------|------------|----|----------|----|-----------|----|-------|----|',
  ];

  for (const row of rows) {
    const fmt = (v) => v.toFixed(1) + '%';
    lines.push(
      `| ${row.file} | ${fmt(row.statements.from)} → ${fmt(row.statements.to)} | ${fmt(row.statements.delta)} | ` +
        `${fmt(row.branches.from)} → ${fmt(row.branches.to)} | ${fmt(row.branches.delta)} | ` +
        `${fmt(row.functions.from)} → ${fmt(row.functions.to)} | ${fmt(row.functions.delta)} | ` +
        `${fmt(row.lines.from)} → ${fmt(row.lines.to)} | ${fmt(row.lines.delta)} |`
    );
  }

  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log(`✅ ${file} saved`);
}

module.exports = generateMarkdownReport;
