import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateFromJD(jd, { keywords, projects, references, works }) {
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { questions } = JSON.parse(response);
      if (!questions) return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`# Questions
${questions
  .map(
    q => `- ${q.content}
  Explain: ${q.explain}`,
  )
  .join('\n\n')}

`);
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
- Generate the 4 question you should ask at the end of interview in markdown format in the key path 'questions[].content'.
- Generate the explanation of why the question should be asked in key path 'questions[].explain'. 

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
${await getSampleJD(SAMPLE_JD.Neutreeno)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          questions: [
            {
              content:
                'What key challenges does the team face in developing responsive applications?',
              explain:
                'This helps understand technical hurdles and ensures you can contribute effectively.',
            },
            {
              content:
                'How does the company ensure collaboration between engineers and sustainability scientists?',
              explain:
                "It's important to know how cross-functional collaboration impacts project outcomes and innovation.",
            },
            {
              content:
                "What performance metrics are crucial for the web applications you're developing?",
              explain:
                'This question reveals the key criteria that determine the success of the applications, which is important for your role.',
            },
            {
              content:
                'What are the biggest technical challenges the team is currently facing?',
              explain:
                'This question helps understand the challenges the team faces and how I can contribute.',
            },
          ],
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
          questions: [
            {
              content:
                'What are the biggest technical challenges the team is currently facing?',
              explain:
                'This provides insight into the current obstacles, helping you gauge how to contribute effectively.',
            },
            {
              content:
                'How do you measure the success of the features developed by the engineering team?',
              explain:
                'Understanding this reveals how the company tracks performance and helps prioritize impactful work.',
            },
            {
              content:
                'Can you describe the mentorship process for junior engineers in the team?',
              explain:
                'This provides clarity on the support structure in place for skill development.',
            },
            {
              content:
                'How does Dialpad prioritize features for development across teams?',
              explain:
                'This reveals how the company aligns engineering efforts with business goals.',
            },
          ],
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
      ${await getSampleJD(SAMPLE_JD.Privasee)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          questions: [
            {
              content:
                'What scalability challenges do you foresee with the Privasee platform as it grows?',
              explain:
                'This shows your proactive thinking about future challenges and helps you understand their growth strategy.',
            },
            {
              content:
                'How do you handle feedback and collaboration within the engineering team?',
              explain:
                'Understanding their feedback culture reveals team dynamics and how decisions are made collaboratively.',
            },
            {
              content:
                'Can you explain the decision-making process for choosing technologies from a technical standpoint?',
              explain:
                'This helps you understand how much influence you would have on technology choices.',
            },
            {
              content:
                'What role does the AI engineering team play in developing the overall platform?',
              explain:
                'This clarifies collaboration between teams, which is essential in a cross-functional environment.',
            },
          ],
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
  await generateFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
