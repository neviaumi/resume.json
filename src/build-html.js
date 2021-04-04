/* eslint-disable no-console */

const theme = require('./theme');
const { promises: fs } = require('fs');
const resume = require('../resume.json');

async function main() {
  const html = theme.render(resume);
  await fs.writeFile('./docs/index.html', html);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
