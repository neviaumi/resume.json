import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  getPersonalWebSiteUrl,
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateIntroMessageForVolunteering(
  jd,
  { keywords, portfolioUrl, projects, references, works },
) {
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { introMessage } = JSON.parse(response);
      if (!introMessage?.content)
        return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`Here is you volunteering intro message
${introMessage.content}

word count: ${introMessage.content.split(' ').length}
explain:
${introMessage.explain}
 `);
    },
  })(
    [
      {
        content: `You are Software engineer who are aim to apply the volunteering opportunities
Here is all skills you knows in JSON format:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Here is colleague recommendations in JSON format:
${JSON.stringify(references)}

Here is open-source project you are code owner in JSON format:
${JSON.stringify(projects)}

Job Description will provided in user input, 

Do the following tasks and response in JSON format:
- Generate intro message on path 'introMessage.content' of json response, limit content here to 150 words.
- At the end of intro message, invite reader to access your personal website that hosted on ${portfolioUrl}.  
- Generate explain of intro message on path 'introMessage.explain' of json response

When you generate the message, consider following point:
1. Limit content to 150 words, as this is most people 1 minute can read.
2. Do not generate over-formal response by avoid using excited, passionate ...etc.

Try start the messages with below template
I have looked at the details of this opportunity and I would like to apply. You can now see my full details including my CV on my profile.

I am interested in this role because [insert relevant skills, experience and interests].

as it was the official template.

`,
        role: 'system',
      },
      {
        content: `Sample JD here:
      ${await getSampleJD(SAMPLE_JD.AmalInitiative)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          introMessage: {
            content: `I have looked at the details of this opportunity and I would like to apply. You can now see my full details including my CV on my profile. 
I am interested in this role because I have experience in web development and design, where I've helped create user-friendly websites. 
I enjoy working on projects that make a positive impact, and I believe my skills can contribute to improving the Amal Initiative's website. 
I understand the importance of clear and engaging content, and I look forward to helping enhance the visibility of your cause.
For more information about my background, please visit my personal website at ${portfolioUrl}.
`,
            explain: `This message communicates my interest in the role while keeping it straightforward and relatable. 
It addresses my relevant skills without diving into technical jargon, making it accessible to a wider audience.
The invitation to view my personal website provides an easy way for the reader to learn more about my experiences and qualifications.`,
          },
        }),
        role: 'assistant',
      },
      {
        content: `Consider JD here:
${jd}`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

async function main() {
  await generateIntroMessageForVolunteering(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    portfolioUrl: getPersonalWebSiteUrl(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
