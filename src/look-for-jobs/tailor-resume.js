import { colorize } from 'json-colorizer';
import fs from 'node:fs/promises';
import path from 'node:path';

import { jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import * as resumeToPdf from '../resume-to-pdf.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';
import { PUBLIC_ASSETS_FOLDER } from '../workspace.js';

async function extractTailorResumeFromJD(
  jd,
  { keywords, projects, references, works },
) {
  const prompts = await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      // eslint-disable-next-line no-console
      console.log(`OpenAI response:
${colorize(JSON.stringify(JSON.parse(response), null, 2))}`);
    },
  })(
    [
      {
        content: `You are Software engineer who are looking on JD and want tailor your resume to increase the chance to get the screening
Here is all skills you knows in JSON format:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Here is colleague recommendations in JSON format:
${JSON.stringify(references)}

Here is open-source project you are code owner in JSON format:
${JSON.stringify(projects)}

Do the following tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate the summary about why you are suitable for the position and which experience make you stand out in key path 'summary' according to JD, working experiences,open source projects, colleague recommendations and skills. Keep your wording simple and easy limit your response in 50 words.
- Extract the company name from JD in key path 'company.name'
- Extract the opening position name from JD in key path 'company.position'
- Advise what skills wasn't in my skills and i should consider add to my resume in key 'highlightedKeywords'

Try not to use some wording excited , passionate, eager ...etc when it was very robotics response.
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
            'With extensive experience in TypeScript, React, and full-stack development, I excel in building responsive and modular applications. My roles at Emma App and PlayStation showcase my skill in creating performant, user-centered interfaces. Open-source contributions and strong CI/CD knowledge make me a standout candidate for Neutreeno’s front-end-focused engineering role.',
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
          summary: `With 7+ years of full-stack experience, I bring strong skills in scalable web applications, leveraging TypeScript, React, GraphQL, and cloud platforms. My work at Emma App and PlayStation on end-to-end feature development and CI/CD aligns well with Dialpad's needs. Additionally, I have experience mentoring at Neat, helping junior engineers grow.`,
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
          summary: `With 7+ years in full-stack development, I specialize in TypeScript, React, and Node.js, aligning well with KatKin’s stack. My experience in scalable product features, CI/CD, and mission-driven environments equips me to support KatKin’s growth in cat health and create a top-tier digital experience for cat parents.`,
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
          summary: `Full-stack software engineer with extensive experience in TypeScript, React, and building reusable, testable components. Skilled in collaborating with cross-functional teams to deliver impactful, user-focused solutions. Proven ability to enhance code quality and security, while mentoring junior developers. Eager to leverage skills to support Goodlord’s mission to redefine the rental experience.`,
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Zensai}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Zensai',
            position: 'Full Stack Engineer',
          },
          highlightedKeywords: [
            'React',
            'Python',
            'Django',
            'PostgreSQL',
            'CI',
            'Collaboration',
            'Agile',
          ],
          suggestedKeywords: [
            'Azure DevOps',
            'Performance optimization',
            'User experience design',
          ],
          summary: `As a full-stack engineer with expertise in React and Python, I am passionate about creating innovative web applications. My experience includes developing scalable solutions, collaborating with cross-functional teams, and optimizing PostgreSQL databases. I thrive in dynamic environments and am excited about the opportunity to contribute to Zensai's mission of empowering individuals through personalized learning.`,
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Zeroheight}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'zeroheight',
            position: 'Full Stack Product Engineer',
          },
          highlightedKeywords: [
            'JavaScript',
            'React',
            'Ruby',
            'AWS',
            'Storybook',
            'ZeroHeight',
            'Serverless',
          ],
          suggestedKeywords: ['Marionette (Backbone.js)', 'API integration'],
          summary:
            'As a full-stack engineer, I bring over 7 years of experience in JavaScript and React, specializing in creating user-friendly applications. My previous work in agile environments equips me to take ownership of features from start to finish. I am excited about the opportunity to contribute to the innovative projects at zeroheight.',
        }),
        role: 'assistant',
      },
      {
        content: `Consider JD your want to apply here:
${jd}`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );

  return JSON.parse(openAI.readMessageFromPrompt(prompts));
}

async function main() {
  const tailorResume = await extractTailorResumeFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
  await fs.writeFile(
    path.join(PUBLIC_ASSETS_FOLDER, 'resume.tailored.json'),
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
