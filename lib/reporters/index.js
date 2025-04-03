const htmlReporter = require('./html');
const jsonReporter = require('./json');
const csvReporter = require('./csv');
const markdownReporter = require('./markdown');
const consoleReporter = require('./console');

const generators = new Map([
  ['html', htmlReporter],
  ['json', jsonReporter],
  ['csv', csvReporter],
  ['md', markdownReporter],
  ['markdown', markdownReporter],
  ['console', consoleReporter],
]);

module.exports = generators;
