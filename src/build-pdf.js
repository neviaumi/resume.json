import * as resumeToPdf from './resume-to-pdf.js';

await resumeToPdf.generateResumeToPDF('public/KatKin.pdf', {
  useTailoredResume: process.env['VITE_USE_TAILORED_RESUME'] ? true : false,
});
