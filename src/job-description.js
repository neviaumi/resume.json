import fs from 'node:fs/promises';
import path from 'node:path';

import { DOCS_FOLDER } from './workspace.js';

export const jobDescription = await fs.readFile(
  path.join(DOCS_FOLDER, 'jd.md'),
  {
    encoding: 'utf-8',
  },
);

export function getSampleJD(sampleName, format = 'md') {
  if (typeof sampleName !== 'symbol') {
    throw new Error(
      `sampleName must be a symbol, but got ${typeof sampleName}`,
    );
  }
  const companyName = sampleName.description;
  return fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', `${companyName}.${format}`),
    {
      encoding: 'utf-8',
    },
  );
}

export const SAMPLE_JD = {
  Airlinen: Symbol('airlinen'),
  AmalInitiative: Symbol('amal-initiative'),
  Cloudsinc: Symbol('cloudsinc'),
  Dialpad: Symbol('dialpad'),
  EightSleep: Symbol('eight-sleep'),
  Faculty: Symbol('faculty'),
  Fonoa: Symbol('fonoa'),
  Goodlord: Symbol('goodlord'),
  Katkin: Symbol('katkin'),
  Loomery: Symbol('loomery'),
  Neutreeno: Symbol('neutreeno'),
  Privasee: Symbol('privasee'),
  Zensai: Symbol('zensai'),
  Zeroheight: Symbol('zeroheight'),
};
