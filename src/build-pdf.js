import fs from 'node:fs/promises';
import path from 'node:path';

import * as resumeToPdf from './resume-to-pdf.js';
import { PUBLIC_ASSETS_FOLDER } from './workspace.js';

const useTailoredResume = process.env['VITE_USE_TAILORED_RESUME']
  ? true
  : false;
const resumePDFPath = useTailoredResume
  ? path.join(
      PUBLIC_ASSETS_FOLDER,
      `${await (async () => {
        return fs
          .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'resume.tailored.json'), {
            encoding: 'utf-8',
          })
          .then(resume => JSON.parse(resume))
          .then(resume => resume.meta.company.name);
      })()}.pdf`,
    )
  : path.join(PUBLIC_ASSETS_FOLDER, '/resume.pdf');

await resumeToPdf.generateResumeToPDF(resumePDFPath, {
  useTailoredResume: useTailoredResume,
});
// eslint-disable-next-line no-console
console.log(`Check ${resumePDFPath} for the result.`);
