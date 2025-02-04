import * as openAI from '../open-ai.js';
import {
  loadCoreValuePage,
  loadExperiencePage,
  loadHomePage,
  loadSkillPage,
} from './load-html.js';

async function generateProjectDescription() {
  const [homePage, coreValuePage, skillPage, experiencePage] =
    await Promise.all([
      loadHomePage(),
      loadCoreValuePage(),
      loadSkillPage(),
      loadExperiencePage(),
    ]);
  const promptFunction = openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: openAI.fallbackOfPrintPromptMessage,
  });
  await promptFunction(
    [
      {
        content: `You are software engineer working on your own resume. You already have portfolio wbesite running in production.
Now you want generate the personal summary from portfolio project in 150 words about who you are and why you are attracted to the hiring manager.

You will get the html page as input and response in JSON format with following key:
${JSON.stringify(
  {
    summary: 'summary',
  },
  null,
  2,
)}`,
        role: 'system',
      },
      {
        content: ` Here is html content from your portfolio:
\`\`\`json
${JSON.stringify({ coreValuePage, experiencePage, homePage, skillPage }, null, 4)}
\`\`\`
        `,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

await generateProjectDescription();
