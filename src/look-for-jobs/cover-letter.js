import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateCoverLetterFromJD(
  jd,
  { keywords, projects, references, works },
) {
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { coverLetter, explain } = JSON.parse(response);
      if (!coverLetter) return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`Cover letter:
${coverLetter}

Work count:
${coverLetter.split(' ').length}

Cover letter explain:
${explain}
`);
    },
  })(
    [
      {
        content: `You are Software engineer who are looking at job description and want to apply the opening
Here is all skills you knows in JSON format:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Here is colleague recommendations in JSON format:
${JSON.stringify(references)}

Here is open-source project you are code owner in JSON format:
${JSON.stringify(projects)}

Job search preferences will provided in user input,

Do the following tasks and response in JSON format:
- Generate the cover letter according JD, working experenses, skills, participated projects in Markdown format on key path 'coverLetter'. Do the generate more than 150 words.
- Explain the generated cover letter on key path 'explain'

Try not to use some wording excited , passionate, eager ...etc when it was very robotics response.
Cover letter should include why you are right for this role and introducing yourself
`,
        role: 'system',
      },
      {
        content: `Sameple JD here:
${await getSampleJD(SAMPLE_JD.Loomery)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          coverLetter: `**Subject: Application for Full Stack Engineer Position**

Dear Loomery Hiring Team,

I am writing to express my interest in the Full Stack Engineer position at Loomery. With extensive experience in software engineering, particularly in developing high-quality digital products using modern technologies, I believe I can contribute effectively to your team.

At Emma App Technologies, I significantly enhanced backend performance and integrated Open Banking connections using TypeScript and Node.js. My work included migrating user onboarding processes to Next.js, leading to improved user experience. Similarly, during my tenure at PlayStation, I played a pivotal role in developing the frontend for an Access Control System with React and TypeScript, collaborating with cross-functional teams to deliver impactful features.

My experience developing a registration system at Neat showcased my ability to work on both frontend and backend synergies while enforcing rigorous testing frameworks with Jest to ensure product reliability. While I may not have direct experience with React Native, I am eager to apply my skills in web technologies and my foundational knowledge of mobile development to quickly adapt to this area.

Additionally, I have contributed to open-source projects, including a dynamic resume generator leveraging TailwindCSS and WebComponents. I am comfortable adapting to new technologies, including those related to AI and spatial computing, making me a strong fit for your innovative direction. I thrive within collaborative teams, focusing on delivering customer value and driving projects forward.

I have attached my resume for your review. I look forward to the opportunity to discuss how I can contribute to Loomery’s exciting projects and help advance your engineering practices.

Sincerely,
David`,
          explain: `The revised cover letter introduces the applicant and their interest in the Full Stack Engineer position at Loomery. It emphasizes relevant experience in software engineering, particularly with technologies such as TypeScript, Node.js, and React. The applicant highlights specific past roles at Emma App Technologies and PlayStation, showcasing accomplishments and technical skills. Although the applicant lacks direct React Native experience, they express a willingness to adapt and apply their existing knowledge in web technologies. In addition, they touch upon their contributions to open-source projects and their alignment with Loomery's focus on innovation. The letter concludes by mentioning the attached resume, ensuring that the hiring team can easily access further details about the applicant's qualifications. Overall, it effectively communicates the applicant's fit for the role while addressing the specific requirements outlined in the job description.`,
        }),
        role: 'assistant',
      },
      {
        content: `Consider JD here:
${jd}
`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

async function main() {
  await generateCoverLetterFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
