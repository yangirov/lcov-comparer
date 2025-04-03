function getSummary(rows) {
  const keys = ['statements', 'branches', 'functions', 'lines'];
  const totals = Object.fromEntries(keys.map((key) => [key, 0]));

  for (const row of rows) {
    for (const key of keys) {
      totals[key] += row[key].delta;
    }
  }

  return Object.fromEntries(keys.map((key) => [key, rows.length ? totals[key] / rows.length : 0]));
}

function printSummary(summary) {
  console.log('\n📊 Coverage delta summary:');

  for (const key in summary) {
    console.log(`${key}: ${summary[key].toFixed(2)}%`);
  }
}

module.exports = {
  getSummary,
  printSummary,
};
