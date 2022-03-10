/* eslint-disable no-console */
import { promises as fs } from 'fs';
// https://github.com/eslint/eslint/discussions/15305 assert type not working meanwhile
// import resume from '../resume.json' assert { type: 'json' };
import path from 'path';

import { theme } from './theme/index.js';

const resumePath = path.join(
  path.parse(new URL(import.meta.url).pathname).dir,
  '../',
  'resume.json',
);
const resume = await fs.readFile(resumePath, { encoding: 'utf-8' });
const html = theme.render(JSON.parse(resume));
await fs.writeFile('./docs/index.html', html);
