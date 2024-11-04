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
Here is all skills you available:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Do the following 6 tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate the summary about why you are suitable for the position and which experience make you stand out in key path 'summary'. Keep your wording simple and easy limit your response in 50 words.
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
          summary:
            'Dynamic Senior Full Stack Engineer with 5+ years of experience in building scalable applications. Expertise in TypeScript, React, and Node.js, with a strong focus on optimizing user interfaces and backend performance. Proven success at PlayStation and Emma, making significant contributions to complex projects aimed at improving user experience and system efficiency.',
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
          summary:
            'Results-driven Full Stack Software Engineer with 5+ years of experience in developing scalable applications using Python, React, and Node.js. Proven track record at PlayStation and Emma, leading projects from concept to delivery. Experienced in mentoring junior engineers at Neat and passionate about leveraging AI to enhance user experiences.',
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
          summary:
            'Dynamic Full Stack Engineer with expertise in TypeScript, React, and Node.js, committed to transforming the pet food industry through innovative technology. Passionate about building scalable solutions and enhancing user experiences, with hands-on experience in delivering end-to-end features in fast-paced environments. Proven track record of collaborating with cross-functional teams to drive project success and maintain high-quality codebases. Eager to contribute to KatKin’s mission of improving cat health and wellbeing while embracing a tech-driven approach to scale the business.',
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Goodlord}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Goodlord',
            position: 'Intermediate Software Engineer (TypeScript)',
          },
          highlightedKeywords: [
            'TypeScript',
            'React',
            'Jest',
            'React Testing Library',
            'Cypress',
            'Web application security',
            'Microservices',
            'State management',
            'Test automation',
            'Mentorship',
          ],
          suggestedKeywords: [
            'Domain-Driven Design (DDD)',
            'Automated testing frameworks',
            'Mentoring less experienced developers',
          ],
          summary:
            'Results-driven Intermediate Software Engineer with significant commercial experience in building web applications using TypeScript and React. Adept at collaborating with cross-functional teams to identify user needs and implement effective solutions. Strong understanding of state management, component reuse, and architectural patterns. Proficient in writing automated tests with frameworks such as Jest and Cypress, while ensuring web application security against vulnerabilities. Passionate about contributing to Goodlord’s mission of improving the renting experience and eager to mentor junior developers while driving continuous improvement in the team.',
        }),
        role: 'assistant',
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
          summary: tailorResume.summary,
        }),
        meta: Object.assign(resume.meta, {
          company: tailorResume.company,
          highlightedKeywords: tailorResume.highlightedKeywords,
        }),
      }),
      null,
      2,
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
