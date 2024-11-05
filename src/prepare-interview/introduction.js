import { jobDescription, SAMPLE_JD } from '../job-description.js';
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
      const { followUpQuestions, introduction, wordCount } =
        JSON.parse(response);
      // eslint-disable-next-line no-console
      console.log(`${introduction}

Follow-up Questions:
${followUpQuestions.join('\n\n')}
Word Count: ${wordCount}
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
- Generate the response about introduction in markdown format in the key path 'introduction'.
- Show word count in the key path 'wordCount'.
- The introduction must not exceed 200 words.
- Generate possible 4 follow-up questions that interviewer might ask based on the introduction in the key path 'followUpQuestions'. 

The generated introduction should keep it short and simple as much as possible. you must limit the total speech of introduction with-in 200 words .
Also you are not native english speaker, so please keep it simple and easy to understand.
Try not say something 'I am so excited, I am passionate, i am so look forward..etc' because it wasn't helpful to the interviewer understand your background. please cut the crap and get to the point.

Here is key elements of successful introduction speech:
1. Start with basic background information
Include who you are, who you work for (or school and major), and what you do.

Internships - You should mention the following: name, school and major, focus areas, past internships and/or noteworthy projects
Full-time - You should mention the following: name, past companies, noteworthy projects (best if it's a public consumer product that they would have heard of)
Does this look familiar? It should be, because it is similar to your resume! Your resume is a condensed version of your knowledge and experiences and your self introduction is essentially a condensed version of your resume. As you grow older, professional experience becomes more important and school background becomes less important. Hence your self introduction changes as you become more senior.

2. KISS (Keep It Simple and Sweet)
Tell them some highlights from your favorite/most impressive projects and including some numbers if they're impressive or challenges that you've overcome. Do not delve into the depths of how you reverse engineered a game and decrypted a packet to predict when to use your DKP on a drop. Tell them the executive summary: "I reverse engineered X game by decrypting Y packet to predict Z." If this catches their interest, they might ask further questions on their own.

3. Why do they want you?
Tell the interviewer why you would make a good hire. Is your experience relevant to the company? Have you used a similar tech stack as the company or built relevant products? What unique talent(s) do you have that may give them confidence about your ability to contribute to the company?

here is some good example of software engineer self introductions
Example 1: Front End Engineer at Meta
Self introduction
"Hi I'm XXX and I graduated from National University of Singapore in 2015 with a degree in Computer Science. My interests are in Front End Engineering and I love to create beautiful and performant products with delightful user experiences.

Back in school, I designed and built a web application, NUSMods which solves a huge problem of class and timetable planning every semester. It receives over a million pageviews a month and is used by over 40,000 NUS students and even some professors. It is built using a modern web technology stack - React, Redux, Jest, Babel, Flow, webpack and is mobile-responsive."

I'm interested in the Front End Engineer role at Meta because I have been using Meta Open Source Front End technologies for a while now and am inspired by Meta's mission and Open Source culture.

Breakdown
"I love to create beautiful and performant products with delightful user experiences."

Qualities that a Front End engineer should possess.

"It receives over a million pageviews a month and is used by over 30,000 NUS undergraduates and even some professors."

Mention something about the project which stands out.

"It is built using a modern web technology stack - React, Redux, Jest, Babel, Flow, webpack and is mobile-responsive."

Meta tech stack! Also hints that you keep yourself updated with modern web technologies.

Example 2: Front End Engineer at Lyft
Self introduction
"Hi I'm XXX and I graduated from National University of Singapore in 2015 with a degree in Computer Science. My interests are in Front End Engineering and I love to create beautiful performant products with delightful user experiences.

I previously worked at Grab where I led the Grab for Work project. Grab for Work was a service for companies to make corporate transportation expenses convenient. Companies can create employee groups, set ride policies and share corporate payment methods with their employees. I built the project with another engineer over the period of 3 months on a React/Redux and Golang stack."

I'm interested in the Front End Engineer role at Lyft because I like working in this ridesharing space and creating products to improve the lives of users.

Breakdown
"I love to create beautiful and performant products with delightful user experiences."

Same as above, qualities that a Front End engineer should possess.

"I previously worked at Grab where I led the Grab for Work project."

Lyft was Grab's sister company! In fact they even had a partnership in the past. Most Lyft engineers would have heard of Grab before and mentioning this catches their attention.

"I built the project with another engineer over the period of 4 months on a React/Redux and Golang stack."

Acknowledge that you work with others. Building a non-trivial system with just 2 people in 3 months is quite good for a non-trivial system. Lyft also uses Golang for their high performance systems.

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
          followUpQuestions: [
            `Can you describe a specific project where you implemented a responsive, modular single-page application? What technologies did you use, and what were some of the challenges you faced during the development process?`,
            `Given your experience working closely with UX teams, how do you approach translating design specifications into functional code? Can you provide an example of how your collaboration led to improvements in user experience or application performance?`,
            `You mentioned working on code quality and optimizations. How have you contributed to a continuous integration/continuous deployment (CI/CD) pipeline in your previous roles? Can you discuss how this practice impacted your team's development process and overall application performance?`,
          ],
          introduction: `# Introduction
Hello, I'm David, a full-stack web developer with over seven years of experience.

## Recent Work Experience
Most recently, I worked at Emma, where I contributed to a personal finance app. Working closely with the CTO and UX team, I helped optimize backend performance and transition mobile app features to the website. This role emphasized efficient cross-functional collaboration and delivering results under tight deadlines.

Before Emma, I spent two years at PlayStation, where I helped build an access control system for game development partners. I collaborated with global teams to manage features, update our component library, and improve code quality. My optimizations on web configurations enhanced loading speeds and streamlined the developer experience, highlighting the importance of continuous improvement.

Earlier, at Neat, I focused on onboarding and compliance features, working with UX designers and product owners to build a user-friendly interface for our web app and internal dashboard. I also mentored junior developers, troubleshooting and implementing automated testing to raise code quality standards. This experience honed my abilities to excel in fast-paced settings and foster a collaborative, high-quality coding culture.`,
          wordCount: 180,
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
          followUpQuestions: [
            `The role requires strong experience with Python, Vue/React, and cloud infrastructures like GCP. Can you share specific projects where you utilized these technologies? What challenges did you encounter, and how did you overcome them?`,
            `You mentioned mentoring junior developers in your previous roles. Can you describe a situation where your mentorship made a significant impact on a team member's growth or the overall project? How do you approach mentoring in a collaborative environment?`,
            `The position emphasizes strong debugging skills. Could you provide an example of a complex issue you encountered in a past project? What steps did you take to troubleshoot and resolve the problem, and what was the outcome?`,
          ],
          introduction: `# Introduction
Hello, I’m David, a full-stack web developer with over seven years of experience.

## Recent Work Experience
Most recently, I contributed to Emma, a personal finance app, where I worked with the CTO on backend performance tuning and collaborated with UX and mobile teams to bring mobile app features to the web. This role emphasized cross-team collaboration and rapid delivery under deadlines.

Before Emma, I spent two years at PlayStation, where I helped develop an access control system for game development partners. I collaborated with teams to manage features, communicate updates to stakeholders, and maintain our internal component library. My efforts to optimize web configurations enhanced load speed and developer experience, underscoring the value of continuous improvement.

At Neat, I focused on onboarding and compliance features. I worked with UX and product teams to design a user-friendly interface for both the web app and an internal dashboard. I also mentored junior team members and implemented automated testing to boost code quality. This experience sharpened my skills in both high-speed development and effective mentorship, contributing to an improved and collaborative coding culture.`,
          wordCount: 183,
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
${SAMPLE_JD.Privasee}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          followUpQuestions: [
            'The role emphasizes designing and managing robust APIs. Can you describe a project where you developed an API? What were the main challenges you faced in ensuring its scalability and security, and how did you address them?',
            'Given your experience with React and the need for pixel-perfect applications at Privasee, can you share a specific example of a project where you implemented responsive designs? What tools and techniques did you use to ensure cross-browser compatibility and a seamless user experience?',
            'Privasee highlights the importance of being a self-directed and proactive contributor in a fast-paced startup environment. Can you provide an example from your previous work where you took initiative to drive a project forward or solve a problem independently? What was the outcome?',
          ],
          introduction: `# Introduction
Hello, I'm David, a full-stack web developer with over seven years of experience.

## Recent Work Experience
Most recently, I worked at Emma App Technologies, building a personal finance super-app. Collaborating with the CTO, I optimized backend efficiency and integrated Open Banking connections using TypeScript and Node.js for seamless bank connectivity. I also developed a referral page and a QR code generator using Cloudflare Workers and migrated onboarding and subscription flows to the web with Next.js. This role enhanced my ability to deliver high-quality results under tight deadlines.

Prior to Emma, I spent two years at PlayStation, developing the frontend for an access control system for game development partners. I worked with cross-functional teams to break down features and present demos to stakeholders. I maintained an internal component library and improved our Micro-Frontend architecture by reducing duplicate modules and streamlining the build pipeline, strengthening my skills in large-scale projects and event-driven architecture.

My core skills include JavaScript, TypeScript, Node.js, and React, with expertise in API development and CI/CD tools—aligning well with the requirements for the Full Stack Engineer role at Privasee.`,
          wordCount: 200,
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
