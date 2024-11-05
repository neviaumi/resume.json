import path from 'node:path';

import * as openAI from '../open-ai.js';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../..'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public'),
  DOCS_FOLDER = path.join(WORKSPACE_ROOT, 'docs');

function generateAnswerFromJD(jd, { keywords, references, works }) {}

async function main() {
  await openAI.withFeedbackLoop(openAI.prompt)(
    [
      {
        content: `You are Software engineer who are looking on JD and want tailor your resume to increase the chance to get the screening
Here is all skills you knows in JSON format:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Here is colleague recommendations in JSON format:
${JSON.stringify(references)}

Do the following 6 tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate the summary about why you are suitable for the position and which experience make you stand out in key path 'summary' according to JD, working experiences, colleague recommendations and skills. Keep your wording simple and easy limit your response in 50 words.
- Extract the company name from JD in key path 'company.name'
- Extract the opening position name from JD in key path 'company.position'
- Advise what skills wasn't in my skills and i should consider add to my resume in key 'highlightedKeywords'
`,
        role: 'system',
      },
      {
        content: "Echo hello world in key path 'message'",
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

await main();
