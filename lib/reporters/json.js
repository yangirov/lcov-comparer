const fs = require('fs');

function generateJsonReport(rows, file) {
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`✅ ${file} saved`);
}

module.exports = generateJsonReport;
