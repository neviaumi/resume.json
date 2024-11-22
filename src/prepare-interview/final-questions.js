import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateFromJD(
  jd,
  interview,
  { keywords, projects, references, works },
) {
  const { interviewerRole, interviewType } = interview,
    promptFunction = openAI.withFeedbackLoop(openAI.prompt, {
      onPromptGenerated: response => {
        const { company, questions } = JSON.parse(response);
        if (!questions) return openAI.fallbackOfPrintPromptMessage(response);
        // eslint-disable-next-line no-console
        console.log(`Here is questions you can ask during the interview of ${interviewType} interview on ${company} with ${interviewerRole}
# Questions
${questions
  .map(
    q => `- ${q.content}
  Explain: ${q.explain}`,
  )
  .join('\n\n')}

`);
      },
    }),
    prompts = [
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

Job Description,Interviewer role and type of interview will provided in user input, 

Do the following tasks and response in JSON format:
- Generate the 4 question you should ask at the end of interview in markdown format in the key path 'questions[].content'.
- Generate the explanation of why the question should be asked in key path 'questions[].explain'. 
- Extract company name from JD in key path 'company'

The generated question should keep it short and simple as much as possible. you must limit the total speech of introduction with-in 20 words .
Also you are not native english speaker, so please keep it simple and easy to understand.
Cut the crap by try not say something 'I am so excited, I am passionate, i am so look forward..etc' because it wasn't helpful to the interviewer understand your background. please cut the crap and get to the point.

# Example questions to ask for knowing more about technical work
- What are the engineering challenges that the company/team is facing?
- What has been the worst technical blunder that has happened in the recent past? How did you guys deal with it? What changes were implemented afterwards to make sure it didn't happen again?
- What is the most costly technical decision made early on that the company is living with now?
- What is the most fulfilling/exciting/technically complex project that you've worked on here so far?
- I do/don't have experience in domain X. How important is this for me to be able to succeed?

# Example questions to ask for knowing more about the role
- What qualities do you look out for when hiring for this role?
- What would be the most important problem you would want me to solve if I joined your team?

# Example questions to ask for knowing more culture and welfare
- What is the most frustrating part about working here?
- What is unique about working at this company that you have not experienced elsewhere?
- What is something you wish were different about your job?

`,
        role: 'system',
      },
      {
        content: `Read the sample Jod description here:
${await getSampleJD(SAMPLE_JD.Neutreeno)}
You are conducting a culture-fit interview with the Operations and Finance team lead at Neutreeno.`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Neutreeno',
          questions: [
            {
              content:
                'What is the most fulfilling part of working at Neutreeno?',
              explain:
                'This question helps understand what makes the work environment satisfying and engaging.',
            },
            {
              content:
                'What opportunities for professional development does Neutreeno offer?',
              explain:
                'Understanding growth opportunities is important for aligning personal career goals with company offerings.',
            },
            {
              content:
                'What types of collaboration happen between the tech team and other departments?',
              explain:
                'This reveals cross-departmental dynamics and how teams work together to achieve goals.',
            },
            {
              content:
                'How does the company support collaboration between technical and non-technical teams?',
              explain:
                'This provides insight into communication and teamwork across different departments.',
            },
          ],
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
      ${await getSampleJD(SAMPLE_JD.Dialpad)}
You are conducting a introductory interview with the Sr Technical Sourcer at Dialpad.
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Dialpad',
          questions: [
            {
              content:
                'What is the most exciting project the engineering team is currently working on?',
              explain:
                "This question helps to understand the team's current focus and innovation within the company.",
            },
            {
              content:
                'How does Dialpad encourage collaboration between engineering and other departments?',
              explain:
                'This provides insight into the communication and teamwork processes across different teams.',
            },
            {
              content:
                'What opportunities for professional development does Dialpad offer to its engineers?',
              explain:
                'Understanding growth opportunities is important for aligning personal career goals with company supports.',
            },
            {
              content:
                'How does Dialpad foster a culture of inclusion and belonging among its employees?',
              explain:
                'This question explores how the company actively promotes diversity and a supportive work environment.',
            },
          ],
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
      ${await getSampleJD(SAMPLE_JD.Privasee)}
You are interviewing the CTO at Privasee.`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Privasee',
          questions: [
            {
              content:
                'What are the most critical challenges Privasee is currently facing in product development?',
              explain:
                'This question helps identify key areas of focus and improvement for the company.',
            },
            {
              content:
                'How does the team approach collaboration between engineering and AI development?',
              explain:
                'This provides insight into cross-functional teamwork and communication dynamics.',
            },
            {
              content:
                'What opportunities for personal and professional growth does Privasee offer its engineers?',
              explain:
                'Understanding development opportunities is important for aligning career goals with company support.',
            },
            {
              content:
                'How does Privasee ensure feedback from users influences product development?',
              explain:
                'This question highlights the importance of user experience and how the company values customer input.',
            },
          ],
        }),
        role: 'assistant',
      },
      {
        content: `Read the Job Description here:
      ${await getSampleJD(SAMPLE_JD.Fonoa)}
You are conducting an introductory interview with the Talent Partner at Fonoa.`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Fonoa',
          questions: [
            {
              content:
                'What do you see as the key challenges Fonoa faces in the current market?',
              explain:
                'This helps identify the strategic focus of the company and potential growth areas.',
            },
            {
              content:
                'How does Fonoa promote collaboration among different teams?',
              explain:
                "Understanding how teams work together reveals the company's culture and values.",
            },
            {
              content:
                'What opportunities for career development does Fonoa provide?',
              explain:
                "This question helps assess how the company invests in its employees' growth.",
            },
            {
              content:
                'What qualities do you value most in candidates for Fonoa?',
              explain:
                'This gives insight into the ideal fit for the company culture and team dynamics.',
            },
          ],
        }),
        role: 'assistant',
      },
      {
        content: `Read the Job Description here:
            ${jobDescription}
      ${interviewType ? `You are conducting an ${interviewType} interview with the ${interviewerRole}` : `You are interviewing the ${interviewerRole}`}`,
        role: 'user',
      },
    ];

  await promptFunction(prompts, {
    json: true,
  });
}

const [, , interviewType, interviewerRole] = process.argv;

if (!interviewType) {
  throw new Error(
    'Usage: node final-questions.js [interviewType] <interviewerRole>',
  );
}

async function main({ interviewerRole, interviewType }) {
  await generateFromJD(
    jobDescription,
    { interviewerRole, interviewType },
    {
      keywords: listAllKeywordsFromResume(resume),
      projects: listOpenSourceProjects(resume),
      references: listColleagueRecommendations(resume),
      works: listWorkExperiences(resume),
    },
  );
}

await main({
  interviewerRole: interviewerRole ? interviewerRole : interviewType,
  interviewType: interviewerRole ? interviewType : '',
});
