import fs from 'node:fs/promises';
import path from 'node:path';

import * as openAI from './open-ai.js';
import * as resumeToPdf from './resume-to-pdf.js';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public'),
  DOCS_FOLDER = path.join(WORKSPACE_ROOT, 'docs');
const SAMPLE_JD = {
  Dialpad: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'dialpad.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Neutreeno: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'neutreeno.md'),
    {
      encoding: 'utf-8',
    },
  ),
};

function listAllKeywordsFromResume(resume) {
  return Array.from(
    new Set(
      [
        resume.projects.map(project => project.keywords).flat(),
        resume.skills.map(skill => skill.keywords).flat(),
        resume.work.map(work => work.keywords).flat(),
      ].flat(),
    ),
  );
}

function listLastThreeWorkExperences(resume) {
  return resume.work.slice(0, 3);
}

async function extractTailorResumeFromJD(jd, { keywords, works }) {
  const response = await openAI.prompt(
    [
      {
        content: `You are Software engineer who are looking on JD and want tailor your resume to increase the chance to get the screening
Here is all skills you avaiable:
${JSON.stringify(keywords)}

Here is last 3 working experences in JSON format:
${JSON.stringify(works)}

Do the following 4 tasks and response in JSON format:
- Highlight the skills matching the JD
- On each work experence re-summary the summary and highlight fields base on the description field and the given JD
- Extract the company name from JD in key path 'company.name'
- Extract the opening position name from JD in key path 'company.position'
- Advise what skills wasn't in my skills and i should consider add to my resume in key 'highlightedKeywords'
`,
        role: 'system',
      },
      {
        content: `The JD here:
${SAMPLE_JD.Neutreeno}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Neutreeno',
            position: 'Senior Full Stack Software Engineer',
          },
          highlightedKeywords: [
            'React',
            'NodeJS',
            'Typescript',
            'AWS',
            'PostgresSQL',
            'CSS',
            'GraphQL',
          ],
          suggestedKeywords: [
            'Material UI or similar modern frontend frameworks',
            'Functional programming concepts',
            'Microservice architecture',
            'Contributions to open-source projects',
          ],
          work: works.map(() => ({
            highlights: ['Generated content'],
            summary: 'Generated content',
          })),
        }),
        role: 'assistant',
      },
      {
        content: `The JD here:
      ${SAMPLE_JD.Dialpad}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Dialpad',
            position: 'Software Engineer, Fullstack',
          },
          highlightedKeywords: [
            'Python',
            'NodeJS',
            'React',
            'TypeScript',
            'GraphQL',
            'CSS',
            'HTML',
            'Javascript',
            'RESTful APIs',
            'SQL/NoSQL',
            'Agile',
          ],
          suggestedKeywords: [
            'Vue',
            'Cloud infrastructures',
            'Building reusable and modular components',
            'Debugging and troubleshooting skills',
          ],
          work: works.map(() => ({
            highlights: ['Generated content'],
            summary: 'Generated content',
          })),
        }),
        role: 'assistant',
      },
      {
        content: `
Consider JD here:
${jd}
`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
  return JSON.parse(response.slice(-1)[0].content);
}

async function main() {
  const resume = await fs
      .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'resume.base.json'), {
        encoding: 'utf-8',
      })
      .then(resume => JSON.parse(resume)),
    jobDescription = await fs.readFile(path.join(DOCS_FOLDER, 'jd.md'), {
      encoding: 'utf-8',
    });
  const tailorResume = await extractTailorResumeFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    works: listLastThreeWorkExperences(resume),
  });
  await fs.writeFile(
    path.join(PUBLIC_ASSETS_FOLDER, 'tailored-resume.json'),
    JSON.stringify(
      Object.assign(resume, {
        basics: Object.assign(resume.basics, {
          label: tailorResume.company.position,
        }),
        meta: {
          highlightedKeywords: tailorResume.highlightedKeywords,
        },
        work: [
          ...tailorResume.work.map((work, index) =>
            Object.assign(resume.work[index], work),
          ),
          ...resume.work.slice(3),
        ],
      }),
      null,
      4,
    ),
  );
  await resumeToPdf.generateResumeToPDF(
    path.join(PUBLIC_ASSETS_FOLDER, `${tailorResume.company.name}.pdf`),
    { useTailoredResume: true },
  );
  // eslint-disable-next-line no-console
  console.log(`Check ${path.join(PUBLIC_ASSETS_FOLDER, `${tailorResume.company.name}.pdf`)} for the result.
For apply ${tailorResume.company.position} on ${tailorResume.company.name}
I suggested include follow skills in your resume.
${JSON.stringify(tailorResume.suggestedKeywords, null, 2)}
`);
}

await main();
