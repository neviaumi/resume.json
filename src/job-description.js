import fs from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../'),
  DOCS_FOLDER = path.join(WORKSPACE_ROOT, 'docs');

export const jobDescription = await fs.readFile(
  path.join(DOCS_FOLDER, 'jd.md'),
  {
    encoding: 'utf-8',
  },
);

export const SAMPLE_JD = {
  Dialpad: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'dialpad.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Goodlord: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'goodlord.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Katkin: await fs.readFile(path.join(DOCS_FOLDER, 'sample-jd', 'katkin.md'), {
    encoding: 'utf-8',
  }),
  Neutreeno: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'neutreeno.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Privasee: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'privasee.md'),
    { encoding: 'utf-8' },
  ),
  Zensai: await fs.readFile(path.join(DOCS_FOLDER, 'sample-jd', 'zensai.md'), {
    encoding: 'utf-8',
  }),
  Zeroheight: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'zeroheight.md'),
    {
      encoding: 'utf-8',
    },
  ),
};
