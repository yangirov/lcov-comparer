const fs = require("fs");

function percent(c, t) {
  return t === 0 ? 100 : (c / t) * 100;
}

function parseLcov(content) {
  const data = {};
  const blocks = content.split("end_of_record");

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    let file = "";
    let statements = { total: 0, covered: 0 };
    let linesCount = { total: 0, covered: 0 };
    let functions = { total: 0, covered: 0 };
    let branches = { total: 0, covered: 0 };

    for (const line of lines) {
      if (line.startsWith("SF:")) {
        file = line.slice(3).trim();
      } else if (line.startsWith("DA:")) {
        linesCount.total++;
        statements.total++;
        const [, hits] = line.slice(3).split(",").map(Number);
        if (hits > 0) {
          linesCount.covered++;
          statements.covered++;
        }
      } else if (line.startsWith("FNDA:")) {
        functions.total++;
        const hits = parseInt(line.split(",")[0].slice(5), 10);
        if (hits > 0) functions.covered++;
      } else if (line.startsWith("BRDA:")) {
        branches.total++;
        const hits = line.split(",")[3];
        if (hits !== "-" && parseInt(hits, 10) > 0) branches.covered++;
      }
    }

    if (file) {
      data[file] = { statements, branches, functions, lines: linesCount };
    }
  }

  return data;
}

function compareAndCollect(a, b) {
  const allFiles = new Set([...Object.keys(a), ...Object.keys(b)]);
  const result = [];

  for (const file of allFiles) {
    const entryA = a[file];
    const entryB = b[file];
    if (!entryA || !entryB) continue;

    const row = { file };

    for (const key of ["statements", "branches", "functions", "lines"]) {
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

    result.push(row);
  }

  result.sort((a, b) => b.maxDelta - a.maxDelta);

  return result;
}

function generateHtmlReport(rows) {
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
        <th>Statements</th>
        <th>Statements Δ</th>
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
          const fmt = (v) => v.toFixed(1) + "%";
          const cls = (d) => (d > 0 ? "plus" : d < 0 ? "minus" : "zero");
          return `<tr>
          <td class="file">${row.file}</td>
          <td>${fmt(row.statements.from)} → ${fmt(row.statements.to)}</td>
          <td class="${cls(
            row.statements.delta
          )}">${row.statements.delta.toFixed(1)}%</td>
          <td>${fmt(row.branches.from)} → ${fmt(row.branches.to)}</td>
          <td class="${cls(row.branches.delta)}">${row.branches.delta.toFixed(
            1
          )}%</td>
          <td>${fmt(row.functions.from)} → ${fmt(row.functions.to)}</td>
          <td class="${cls(row.functions.delta)}">${row.functions.delta.toFixed(
            1
          )}%</td>
          <td>${fmt(row.lines.from)} → ${fmt(row.lines.to)}</td>
          <td class="${cls(row.lines.delta)}">${row.lines.delta.toFixed(
            1
          )}%</td>
        </tr>`;
        })
        .join("\n")}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync("coverage-diff.html", html, "utf8");
  console.log("✅ coverage-diff.html saved");
}

function run(fileA, fileB) {
  const contentA = fs.readFileSync(fileA, "utf8");
  const contentB = fs.readFileSync(fileB, "utf8");

  const coverageA = parseLcov(contentA);
  const coverageB = parseLcov(contentB);

  const rows = compareAndCollect(coverageA, coverageB);
  generateHtmlReport(rows);
}

module.exports = { run };
