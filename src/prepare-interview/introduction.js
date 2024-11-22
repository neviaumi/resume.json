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
- Generate the response about introduction in markdown format in the key path 'introduction'.
- Show word count in the key path 'wordCount'.
- Extract company name from the key path 'company'.
- The introduction must not exceed 200 words and not less than 100 words.
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
${await getSampleJD(SAMPLE_JD.Neutreeno)}
You are conducting a culture-fit interview with the Operations and Finance team lead at Neutreeno.
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Neutreeno',
          followUpQuestions: [
            {
              explain:
                'This question allows the interviewer to assess your approach to teamwork and how you ensure all team members are aligned on goals and objectives.',
              question:
                'How do you prioritize collaboration and communication in your projects?',
            },

            {
              explain:
                'Understanding how you handle change is important in operations and finance, as they often deal with shifting priorities and market conditions.',
              question:
                'Can you describe a situation where you had to adapt to a significant change at work?',
            },
            {
              explain:
                'This question is aimed at gauging your insights into the importance of culture in the workplace, which is significant for any organization.',
              question:
                'What role do you think a positive company culture plays in employee performance?',
            },
            {
              explain:
                'This allows the interviewer to understand how you manage your workload while maintaining effective relationships with colleagues.',
              question:
                'How do you balance technical responsibilities with team dynamics?',
            },
          ],
          introduction: `# Introduction

Hello, my name is David. I am a Software Engineer with over 4 years of experience in full stack development, focusing on creating user-friendly applications while ensuring backend efficiency. I have worked in various settings where collaboration and innovation are key.

## Recent Work Experience
In my recent role at **Emma App Technologies**, I enhanced a personal finance app, integrating Open Banking features to simplify user bank connections. 
Before that at **PlayStation**, I developed an Access Control System, improving access and security for partners. 
I also contributed to **Neat**, a digital wallet platform, where I built a registration system and created an admin dashboard for compliance reviews. 
I enjoy fostering a supportive team culture and mentoring junior developers, as I believe teamwork is essential to success. 
My experiences in both tech development and team collaboration have equipped me to contribute effectively in a dynamic environment like Neutreeno.`,
          wordCount: 146,
        }),
        role: 'assistant',
      },
      {
        content: `Read the sample Jod description here:
      ${await getSampleJD(SAMPLE_JD.Cloudsinc)}
You are interviewing the Founder and Lead Engineer at Cloudsince.`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: 'Cloudsinc',
          followUpQuestions: [
            {
              explain:
                "This question assesses your knowledge and experience with DevOps and cloud technologies, which are crucial for the role you're applying for.",
              question:
                'Can you explain your experience with Infrastructure as Code and how it has impacted your previous projects?',
            },
            {
              explain:
                'This question helps the interviewer understand your approach to problem-solving, which is critical in a fast-paced development environment.',
              question:
                'Can you share a specific challenge you faced in a previous project and how you overcame it?',
            },
            {
              explain:
                'Understanding your approach to optimizing queries helps the interviewer gauge your problem-solving skills and your ability to improve application performance.',
              question:
                'Can you explain your process for optimizing database queries for performance?',
            },
            {
              explain:
                'This question aims to understand your experience with data scaling, which is crucial for a platform expecting to handle large volumes of data and multiple users.',
              question:
                'What strategies have you used for database scaling to accommodate growing data volume and user load?',
            },
          ],
          introduction: `# Introduction
Hello, I'm David, a Full Stack Developer with over 7 years of experience in creating scalable and efficient web applications, focusing on both front-end and back-end development.

# Recent Work Experience
Most recently, I worked at PlayStation, where I developed an Access Control System used by partners to manage access to tools and environments. 
I primarily focused on the front end, utilizing TypeScript and React to implement a clean and efficient user interface. 
I collaborated closely with product managers and QA teams to break down complex features into manageable tasks for agile sprints. 
Additionally, I improved the MicroFrontend architecture by implementing Module Federation, which reduced our bundle size by 10% and enabled efficient code sharing across teams.
Before that, at Neat, I worked on a registration system for a digital wallet platform. 
I focused on building a responsive front end with React while integrating backend services using Node.js. 
My role included managing PostgreSQL databases and ensuring data integrity, along with implementing CI/CD practices using CircleCI to automate our deployment process. 
I also played a key role in mentoring junior developers, discussing best practices in code quality and application design, enhancing both the team's skills and project outcomes.
`,
          wordCount: 195,
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
          followUpQuestions: [
            {
              explain:
                'This question seeks to evaluate your experience with designing APIs, which is crucial for the role, particularly for ensuring they are robust, scalable, and secure.',
              question:
                'Can you describe a significant API you designed and the considerations you took to ensure its performance and security?',
            },
            {
              explain:
                'This question helps the interviewer understand your experience with React.js and how you approach the development of responsive applications that prioritize user experience.',
              question:
                'How have you ensured that the React.js applications you have developed are pixel-perfect and responsive?',
            },
            {
              explain:
                'Understanding your methods for code quality assurance can reveal your organization and collaboration skills, which are vital in a team environment.',
              question:
                'What practices do you implement to maintain code quality during development and in code reviews?',
            },
            {
              explain:
                'This question aims to gauge your ability to adapt and contribute in a startup environment, as well as your resourcefulness and initiative.',
              question:
                "Can you share an example of how you've taken ownership of a project or task in a fast-paced environment?",
            },
          ],
          introduction: `# Introduction
Hello, I’m David, and I am a Full Stack Developer with over 7 years of experience in building and maintaining web applications. 
I specialize in using JavaScript, TypeScript, and Python, and have a strong focus on frameworks such as React and Node.js. 

## Recent Work Experience
In my most recent role at **Emma App Technologies**, I contributed to the development of a personal finance super-app, focusing on backend performance, integrating Open Banking features with TypeScript and Node.js. 
Before that, I was part of **PlayStation**, where I helped develop an Access Control System enhancing security for our partners. 
My responsibilities included creating responsive user interfaces using React and optimizing performance through close collaboration with cross-functional teams. 
I also worked at **Neat**, where I implemented a registration system for a digital wallet, integrating backend services and managing databases effectively. 
I am passionate about leveraging technology to create impactful solutions and am excited about the opportunity to contribute to Privasee’s mission in advancing compliance.
`,
          wordCount: 161,
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
          followUpQuestions: [
            {
              explain:
                'This question seeks to understand how you manage your workload and prioritize tasks effectively, which is crucial in a fast-paced environment like Fonoa where multiple projects may be running simultaneously.',
              question:
                'How do you prioritize your tasks when faced with multiple deadlines?',
            },
            {
              explain:
                "This question aims to gauge your career aspirations and motivations, allowing the interviewer to see if your goals align with the company's mission and values.",
              question: 'What are you looking for in your next role?',
            },
            {
              explain:
                "The interviewer might be interested in knowing how you balance your technical responsibilities with project management, as it's important for team dynamics and delivery.",
              question:
                'Can you share a strategy you use to balance technical work with communication and collaboration with your team?',
            },
            {
              explain:
                'This question can reveal your commitment to professional growth and how you approach the learning opportunities available within a company, which can greatly affect team dynamics.',
              question:
                'How do you approach personal and professional development in your career?',
            },
          ],
          introduction: `# Introduction
Hello, I’m David, a Full Stack Developer with over 7 years of experience in building scalable web applications and API solutions. 
I specialize in JavaScript, TypeScript, and Python, with extensive experience using frameworks like React for the frontend and Node.js for the backend.

## Recent Work Experience
In my recent role at **Emma App Technologies**, I developed a personal finance super-app by integrating Open Banking features, enhancing user bank connections. 
This involved understanding user needs and creating effective solutions to simplify their experience.

Prior to that, I was at **PlayStation**, where I contributed to an Access Control System designed to manage security for partners effectively. 
Additionally, I worked at **Neat**, creating a registration system for a digital wallet platform that streamlined the onboarding process.
I am enthusiastic about the opportunity at Fonoa to contribute to innovative tax automation solutions in a fast-paced environment and am eager to make a meaningful impact.
`,
          wordCount: 148,
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
  const promptFunction = openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { company, followUpQuestions, introduction, wordCount } =
        JSON.parse(response);
      if (!introduction || !followUpQuestions)
        return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`Introduction generated for ${interviewType} interview on ${company} with ${interviewerRole}

${introduction}
Word Count: ${Math.min(introduction.split(' ').filter(word => word.trim().length > 0).length, wordCount)}

# Follow-up Questions
${followUpQuestions
  .map(
    q => `- ${q.question}
  Explain: ${q.explain}`,
  )
  .join('\n\n')}

`);
    },
  });
  await promptFunction(prompts, {
    json: true,
  });
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

const [, , interviewType, interviewerRole] = process.argv;

if (!interviewType) {
  throw new Error(
    'Usage: node introduction.js [interviewType] <interviewerRole>',
  );
}

await main({
  interviewerRole: interviewerRole ? interviewerRole : interviewType,
  interviewType: interviewerRole ? interviewType : '',
});
