import { jobDescription, SAMPLE_JD } from '../job-description.js';
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
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { companyName, whyIAmBestCandidate, whyOurCompany } = (() => {
        const {
          company: { name },
          response: { markdown },
        } = JSON.parse(response);
        return { ...markdown, companyName: name };
      })();
      // eslint-disable-next-line no-console
      console.log(
        `# Why are you the best candidate for this job?

      ${whyIAmBestCandidate}
      `,
      );
      // eslint-disable-next-line no-console
      console.log(
        `# Why ${companyName}?

      ${whyOurCompany}
      `,
      );
    },
  })(
    [
      {
        content: `You are Software engineer who are preparing the job interview
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
- Generate the response about 'Why are you the best candidate for this job?' in key path 'response.markdown.whyIAmBestCandidate' in markdown format. 
- Generate the response about 'Why [company name]?' in key path 'response.markdown.whyOurCompany' in markdown format.
- Extract the company name from JD in key path 'company.name'

All the answer should keep it short and simple as much as possible. you only have 60 seconds to speech on each question.
Also you are not native english speaker, so please keep it simple and easy to understand.

`,
        role: 'system',
      },
      {
        content: `Read the sample Jod description here:
${SAMPLE_JD.Neutreeno}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'Neutreeno' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                "I am the best candidate for this role because of my extensive experience in full-stack development with a strong focus on front-end technologies, particularly using React and TypeScript. I have successfully built responsive and modular single-page applications while collaborating closely with UX/UI designers. My experience with CI/CD pipelines ensures smooth deployment and integration. Additionally, my background in working with cloud services like AWS and PostgreSQL aligns perfectly with Neutreeno's requirements. I am passionate about leveraging technology for impactful solutions, especially in sustainability.",
              whyOurCompany:
                "I am excited about Neutreeno because of its groundbreaking approach to tackling global decarbonization efforts. The opportunity to work alongside leading sustainability scientists and contribute to a platform that provides data-driven insights for reducing emissions resonates with my personal and professional values. I admire Neutreeno's commitment to innovation and collaboration, and I want to be part of a team that makes a real difference in the world.",
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
${SAMPLE_JD.Dialpad}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'Dialpad' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                "I am the best candidate for this role due to my 7+ years of experience in full-stack software engineering. I have a strong background in both frontend and backend technologies including React, Node.js, and Python. My experience with building reusable components, RESTful APIs, and GraphQL schemas matches the requirements perfectly. Additionally, I am skilled in collaborating with cross-functional teams, which ensures that features are delivered on time with high quality. My passion for mentoring junior engineers aligns with Dialpad's team culture.",
              whyOurCompany:
                'I am excited about Dialpad because of its innovative approach to AI-powered customer communications. The opportunity to work on a platform that enhances business communication and optimizes customer experience strongly resonates with me. I admire Dialpad’s commitment to collaboration and professional development, and I want to contribute my skills to a company that values diversity and inclusion. I believe this position would allow me to grow while making a meaningful impact.',
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
${SAMPLE_JD.Zeroheight}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'zeroheight' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                'I am the best candidate for this role due to my experience in full-stack development and my passion for creating user-friendly products. With over 7 years of experience working with JavaScript and React, I have a strong background in building beautiful and functional applications from start to finish. I appreciate the emphasis on quality and user experience that zeroheight values, and my ability to relate closely with designers and product managers will help in executing features effectively. Additionally, I enjoy being involved in planning and project management, which fits your culture of ownership and collaboration.',
              whyOurCompany:
                'I am excited about joining zeroheight because of its commitment to creating a user-centric product and its focus on mental wellness in the workplace. The remote-first approach and innovative environment align perfectly with my working style. I admire zeroheight’s values of humility, connection, and ownership, and I want to be part of a team that encourages personal growth and collaboration. Being able to contribute to features that enhance user experience while working alongside talented colleagues is something I am truly looking forward to.',
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the Job Description here:
${jobDescription}`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

async function main() {
  await generateAnswerFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
