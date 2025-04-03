const fs = require('fs');

function generateCsvReport(rows, file) {
  const headers = [
    'file',
    'statements_from',
    'statements_to',
    'statements_delta',
    'branches_from',
    'branches_to',
    'branches_delta',
    'functions_from',
    'functions_to',
    'functions_delta',
    'lines_from',
    'lines_to',
    'lines_delta',
  ];

  const lines = [headers.join(',')];
  const fmt = (v) => v.toFixed(2);

  for (const row of rows) {
    lines.push(
      [
        row.file,
        fmt(row.statements.from),
        fmt(row.statements.to),
        fmt(row.statements.delta),
        fmt(row.branches.from),
        fmt(row.branches.to),
        fmt(row.branches.delta),
        fmt(row.functions.from),
        fmt(row.functions.to),
        fmt(row.functions.delta),
        fmt(row.lines.from),
        fmt(row.lines.to),
        fmt(row.lines.delta),
      ].join(',')
    );
  }

  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log(`✅ ${file} saved`);
}

module.exports = generateCsvReport;
