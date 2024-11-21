import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
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
        const jsonResponse = JSON.parse(response);
        return {
          ...(jsonResponse.response?.markdown ?? {}),
          companyName: jsonResponse.company?.name,
        };
      })();
      if (!whyIAmBestCandidate && !whyOurCompany) {
        return openAI.fallbackOfPrintPromptMessage(response);
      }
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
Try not to use some wording excited , passionate, eager ...etc when it was very robotics response.
`,
        role: 'system',
      },
      {
        content: `Read the sample Jod description here:
${await getSampleJD(SAMPLE_JD.Neutreeno)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'Neutreeno' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                'I have strong experience in both front-end and back-end technologies, particularly with React, TypeScript, and Node.js. My background includes developing responsive, modular single-page applications and maintaining cross-browser compatibility. I’m familiar with CI/CD environments and can implement efficient deployment practices. My experience with cloud services like AWS and databases like PostgreSQL aligns well with your requirements. Additionally, I have a record of mentoring team members and contributing to open-source projects, which suits Neutreeno’s collaborative culture.',
              whyOurCompany:
                "Neutreeno's focus on real emissions reduction and innovative technology resonates with my goal to make a positive impact through software. I appreciate the opportunity to work with leading sustainability scientists and contribute to a meaningful cause. Joining Neutreeno means being part of a forward-thinking team that is incredibly aligned with my values of sustainability and technological advancement.",
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
${await getSampleJD(SAMPLE_JD.Dialpad)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'Dialpad' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                'I possess extensive experience in full-stack software engineering, with over 8 years of diverse background in technologies including Python, Node.js, and modern frontend frameworks like React. I have successfully developed scalable applications and maintained code quality through best practices. My proficiency with databases, RESTful APIs, and cloud solutions aligns closely with the needs of this role. Additionally, I have a solid history of mentoring junior engineers, fostering skill development, and promoting a collaborative working environment.',
              whyOurCompany:
                "Dialpad's innovative approach to AI-powered communications and its commitment to enhancing business interactions aligns with my goals as a software engineer. I appreciate Dialpad's emphasis on collaboration and continuous improvement, as well as its focus on diversity and inclusion, making it a workplace where I can thrive and contribute positively.",
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
${await getSampleJD(SAMPLE_JD.Zeroheight)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: { name: 'zeroheight' },
          response: {
            markdown: {
              whyIAmBestCandidate:
                'I have over 7 years of experience as a full-stack engineer, specializing in JavaScript and React. My background in building user-friendly applications and my ability to handle both frontend and backend tasks align perfectly with the responsibilities in this role. I thrive in flexible environments and enjoy collaborating with designers and product managers to deliver high-quality features. Additionally, my proactive attitude and experience in Agile methodologies make me an ideal fit for the dynamic team at zeroheight.',
              whyOurCompany:
                "I am drawn to zeroheight's commitment to creating excellent user experiences and the focus on collaboration. The remote-first approach and the culture of experimentation resonate with my work style. I appreciate the emphasis on personal growth and mental wellbeing, which creates a strong and supportive work environment. Being part of a team that values ownership and quality excites me, and I want to contribute to building products that users love.",
            },
          },
        }),
        role: 'assistant',
      },
      {
        content: `Read the Job Description here:
${await getSampleJD(jobDescription)}`,
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
