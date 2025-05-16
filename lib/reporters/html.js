const fs = require('fs');

function generateHtmlReport(rows, file) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LCOV Coverage Diff</title>
  <style>
    body { font-family: sans-serif; padding: 1rem; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th, td { padding: 6px 10px; border: 1px solid #ccc; text-align: right; }
    th { background: #f0f0f0; }
    td.file { text-align: left; font-family: monospace; }
    .plus { color: green; }
    .minus { color: red; }
    .zero { color: gray; }
  </style>
</head>
<body>
  <h1>LCOV Coverage Diff</h1>
  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>New</th>
        <th>Status</th>
        <th>Statements</th>
        <th>Statement Δ</th>
        <th>Branches</th>
        <th>Branches Δ</th>
        <th>Functions</th>
        <th>Functions Δ</th>
        <th>Lines</th>
        <th>Lines Δ</th>
      </tr>
    </thead>
    <tbody>
      ${rows
        .map((row) => {
          const fmt = (v) => v.toFixed(1) + '%';
          const cls = (d) => (d > 0 ? 'plus' : d < 0 ? 'minus' : 'zero');
          return `<tr>
          <td class="file">${row.file}</td>
          <td>${row.isNew ? '🆕' : ''}</td>
          <td>${row.testStatus}</td>
          <td>${fmt(row.statements.from)} → ${fmt(row.statements.to)}</td>
          <td class="${cls(row.statements.delta)}">${row.statements.delta.toFixed(1)}%</td>
          <td>${fmt(row.branches.from)} → ${fmt(row.branches.to)}</td>
          <td class="${cls(row.branches.delta)}">${row.branches.delta.toFixed(1)}%</td>
          <td>${fmt(row.functions.from)} → ${fmt(row.functions.to)}</td>
          <td class="${cls(row.functions.delta)}">${row.functions.delta.toFixed(1)}%</td>
          <td>${fmt(row.lines.from)} → ${fmt(row.lines.to)}</td>
          <td class="${cls(row.lines.delta)}">${row.lines.delta.toFixed(1)}%</td>
        </tr>`;
        })
        .join('\n')}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(file, html, 'utf8');
  console.log(`✅ ${file} saved`);
}

module.exports = generateHtmlReport;
