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
      const { followUpQuestions, introduction, wordCount } =
        JSON.parse(response);
      if (!introduction) return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`${introduction}
Word Count: ${Math.min(introduction.split(' ').filter(word => word.trim().length > 0).length, wordCount)}

# Follow-up Questions:
${followUpQuestions
  .map(
    q => `- ${q.question}
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
- Generate the response about introduction in markdown format in the key path 'introduction'.
- Show word count in the key path 'wordCount'.
- The introduction must not exceed 200 words.
- Generate possible 4 follow-up questions that interviewer might ask based on the introduction in the key path 'followUpQuestions[].question' and explain why this question was asked in the key path 'followUpQuestions[].explain' 

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
${await getSampleJD(SAMPLE_JD.Neutreeno)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          followUpQuestions: [
            {
              explain:
                'This question helps assess your expertise with TypeScript, which is listed as important in the job description. It offers a chance to gain deeper insights into your technical skills.',
              question:
                "Can you elaborate on your experience with TypeScript and how you've utilized it in your projects?",
            },

            {
              explain:
                'This question aims to understand your problem-solving abilities and how you tackle challenges during project implementations, showcasing your resilience and adaptability.',
              question:
                'What challenges did you face while integrating Open Banking connections at Emma App Technologies?',
            },
            {
              explain:
                'Given the importance of user experience in the role, this question probes your strategies and methodologies for optimizing application performance, allowing the interviewer to gauge your design sensibility.',
              question:
                'How do you ensure performance and user experience in the applications you develop?',
            },
            {
              explain:
                'Since experience with CI/CD pipelines is a requirement, this question is crucial to assess your familiarity with these processes and your ability to integrate smoothly into their development environment.',
              question:
                'Have you worked in CI/CD environments before, and what tools do you prefer?',
            },
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
      ${await getSampleJD(SAMPLE_JD.Cloudsinc)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          followUpQuestions: [
            {
              explain:
                "This question is crucial to evaluate your experience and comfort level with serverless architectures, which are defined as integral to CloudSinc's tech stack. Understanding your familiarity helps gauge your capabilities to contribute effectively.",
              question:
                'What experience do you have with serverless architectures like AWS Lambda?',
            },
            {
              explain:
                'Given the emphasis on Automation and Infrastructure as Code in the role, this question determines your practical knowledge and past experiences implementing these practices, which are key to the company’s operations.',
              question:
                'Can you describe a project where you implemented Infrastructure as Code?',
            },

            {
              explain:
                'Since the role involves a focus on both front-end and back-end development, this question seeks to determine your experience with modern JavaScript frameworks and how you approach developing single-page applications (SPAs).',
              question:
                'What frameworks are you most comfortable with for developing single-page applications?',
            },
            {
              explain:
                'This question assesses your problem-solving skills, as well as how you tackle technical issues in a fast-paced environment, which is a significant part of the job description.',
              question:
                'Can you share a challenging technical problem you encountered in a past project and how you resolved it?',
            },
          ],
          introduction: `# Introduction

      Hello, I'm David, a full-stack developer with over seven years of experience.

      ## Recent Work Experience

      I recently worked at Emma App Technologies, where I contributed to the development of a personal finance super-app. Collaborating with the CTO, I focused on improving backend performance and integrating Open Banking connections using TypeScript and Node.js. I also played a key role in migrating onboarding processes to a web platform using Next.js, enhancing user experience and accessibility.

      Before Emma, I spent two years at PlayStation, where I developed an access control system for game developers. I utilized TypeScript and React to build frontend components, optimizing loading speeds and maintaining a shared component library for design consistency. Collaborating with cross-functional teams allowed us to improve system functionality and user engagement.

      Prior to PlayStation, I worked at Neat, where I developed a registration system for a digital wallet platform, focusing on creating an intuitive interface and building an admin dashboard for compliance review. I have experience with JavaScript and Python, and I believe my skills align well with the full-stack developer role at CloudSinc, especially in building scalable applications and working collaboratively with teams.`,
          wordCount: 183,
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
          followUpQuestions: [
            {
              explain:
                'This question seeks to determine your hands-on experience in designing and implementing APIs, which is a central responsibility in the role. Understanding your background can help gauge your readiness to take on significant decisions regarding technologies.',
              question:
                'Can you describe your experience in designing and managing robust APIs?',
            },
            {
              explain:
                'The role emphasizes collaboration with the CTO and significant decision-making power, so understanding your approach to tech stack selection will provide insight into your strategic thinking and collaborative skills.',
              question:
                'How do you approach making technology and architecture decisions in your projects?',
            },
            {
              explain:
                'Given that the company values curiosity and embraces challenges, this question helps assess your problem-solving methodology and practicality in addressing complex issues during development.',
              question:
                'Can you discuss a complex problem you faced in a previous project and how you approached finding a solution?',
            },
            {
              explain:
                'Since the role requires maintaining performance and system environments, this question is vital to understanding your experience with CI/CD and how you manage deployment pipelines, ensuring that you fit well within their operational processes.',
              question:
                'What tools and practices have you used in continuous development and deployment?',
            },
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
