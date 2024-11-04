import fs from 'node:fs/promises';
import path from 'node:path';
// Import the readline and process modules
import { stdin as input, stdout as output } from 'node:process';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import readline from 'node:readline/promises';

import { colorize } from 'json-colorizer';

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
  Katkin: await fs.readFile(path.join(DOCS_FOLDER, 'sample-jd', 'katkin.md'), {
    encoding: 'utf-8',
  }),
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
  let promptHistory = await openAI.prompt(
    [
      {
        content: `You are Software engineer who are looking on JD and want tailor your resume to increase the chance to get the screening
Here is all skills you avaiable:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Do the following 6 tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate work.summary base on the work.description and JD, summary was summery of the role responsibilities on the experience
- Generate work.highlights base on the work.description and JD, highlights was the key achievements or projects that you have done in the role
- Extract the company name from JD in key path 'company.name'
- Extract the opening position name from JD in key path 'company.position'
- Advise what skills wasn't in my skills and i should consider add to my resume in key 'highlightedKeywords'
`,
        role: 'system',
      },
      {
        content: `Sample JD here:
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
          work: works.map(work => ({
            highlights: work.highlights,
            summary: work.summary,
          })),
        }),
        role: 'assistant',
      },
      {
        content: `Sample JD here:
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
          work: works.map(work => ({
            highlights: work.highlights,
            summary: work.summary,
          })),
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Katkin}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Katkin',
            position: 'Mid-level Full-Stack Engineer',
          },
          highlightedKeywords: [
            'TypeScript',
            'React',
            'NodeJS',
            'NestJS',
            'NextJS',
            'REST API',
            'PostgreSQL',
            'RabbitMQ',
            'Test automation',
            'GitHub Actions',
            'AWS',
            'Monorepos',
            'Pulumi',
          ],
          suggestedKeywords: [
            'eCommerce and/or payments experience',
            'OOP and/or functional programming paradigms',
            'Terraform or CDK usage',
            'Observability and metrics tooling',
          ],
          work: works.map(work => ({
            highlights: work.highlights,
            summary: work.summary,
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
  const rl = readline.createInterface({ input, output });

  let shouldReadLine = true;
  while (shouldReadLine) {
    const response = JSON.parse(promptHistory.slice(-1)[0].content);
    // eslint-disable-next-line no-console
    console.log(`OpenAI response:
${colorize(JSON.stringify(response, null, 2))}`);
    const answer = await rl.question('Type EOP if no more feedbacks: ');
    if (answer === 'EOP') {
      shouldReadLine = false;
      break;
    }
    if (!answer) {
      continue;
    }
    promptHistory = await openAI.prompt(
      promptHistory.concat({ content: answer, role: 'user' }),
      { json: true },
    );
  }
  rl.close();

  return JSON.parse(promptHistory.slice(-1)[0].content);
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
        meta: Object.assign(resume.meta, {
          company: tailorResume.company,
          highlightedKeywords: tailorResume.highlightedKeywords,
        }),
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
