import { promises as fs } from 'node:fs';
import path from 'node:path';

import { getSampleJD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import { DOCS_FOLDER } from '../workspace.js';

async function generateMDFromJDText(jd) {
  return openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { company, jd } = JSON.parse(response);
      // eslint-disable-next-line no-console
      console.log(`JD of ${company.position} from ${company.name}:
${jd.markdown}

`);
      if (!company.coreValue) {
        // eslint-disable-next-line no-console
        console.error(
          `Polite reminder:
Missing company value on JD! Better check company site to include core value on JD before generate resume as it would provide better result!`,
        );
      }
    },
  })(
    [
      {
        content: `You are Looking for job and want to transform your job description to markdown
        
The JD will provided in user input
Do the following on given JD and response in JSON format:
- Transform the given JD to markdown format on key path 'jd.markdown'
- Identify company core value on key path 'company.coreValue', if core value not included in JD, set null value on key path 'company.coreValue'
- Extract company name from JD on key path 'company.name'
- Extract position hiring from JD on key path 'company.position'
`,
        role: 'system',
      },
      {
        content: `Transform below JD to MD format:
${await getSampleJD('faculty', 'txt')}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            coreValue: null,
            name: 'Faculty',
            position: 'Software Engineer - Full-Stack',
          },
          jd: {
            markdown: await getSampleJD('faculty', 'md'),
          },
        }),
        role: 'assistant',
      },
      {
        content: `Transform below JD to MD format:
${await getSampleJD('eight-sleep', 'txt')}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            coreValue: null,
            name: 'Eight Sleep',
            position: 'Full Stack Engineer, Web',
          },
          jd: {
            markdown: await getSampleJD('eight-sleep', 'md'),
          },
        }),
        role: 'assistant',
      },
      {
        content: `Transform below JD to MD format:
${await getSampleJD('goodlord', 'txt')}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            coreValue: [
              'We stand up and deliver',
              'We set the pace',
              "We're an open book",
              'We bring our whole selves to work',
              'We listen, learn and improve',
            ],
            name: 'Goodlord',
            position: 'Front End Engineer (TypeScript)',
          },
          jd: {
            markdown: await getSampleJD('goodlord', 'md'),
          },
        }),
        role: 'assistant',
      },
      {
        content: `Transform below JD to MD format:
${jd}`,
        role: 'user',
      },
    ],
    { json: true },
  );
}

async function main() {
  const response = JSON.parse(
    openAI.readMessageFromPrompt(
      await generateMDFromJDText(
        await fs.readFile(path.join(DOCS_FOLDER, 'jd.txt'), {
          encoding: 'utf-8',
        }),
      ),
    ),
  );
  await fs.writeFile(path.join(DOCS_FOLDER, 'jd.md'), response.jd.markdown);
}

main();
