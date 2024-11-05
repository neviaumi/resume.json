import { jobDescription } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateAnswerFromJD(
  jd,
  { keywords, projects, references, works },
) {
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

Here is open-source project you are code owner in JSON format:
${JSON.stringify(projects)} 

Do the following tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate the summary about why you are suitable for the position and which experience make you stand out in key path 'summary' according to JD, working experiences,open source projects, colleague recommendations and skills. Keep your wording simple and easy limit your response in 50 words.
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

async function main() {
  generateAnswerFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
