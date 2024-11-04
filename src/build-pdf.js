import fs from 'node:fs/promises';
import path from 'node:path';

import * as resumeToPdf from './resume-to-pdf.js';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public');
const useTailoredResume = process.env['VITE_USE_TAILORED_RESUME']
  ? true
  : false;
const resumePDFPath = useTailoredResume
  ? path.join(
      PUBLIC_ASSETS_FOLDER,
      `${await (async () => {
        return fs
          .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'tailored-resume.json'), {
            encoding: 'utf-8',
          })
          .then(resume => JSON.parse(resume))
          .then(resume => resume.meta.company.name);
      })()}.pdf`,
    )
  : path.join(PUBLIC_ASSETS_FOLDER, '/resume.pdf');

await resumeToPdf.generateResumeToPDF(resumePDFPath, {
  useTailoredResume: process.env['VITE_USE_TAILORED_RESUME'] ? true : false,
});
