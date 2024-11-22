import { getSampleJD, jobDescription, SAMPLE_JD } from '../job-description.js';
import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateIntroMessageForCord(
  jd,
  { keywords, projects, references, works },
) {
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { introMessage } = JSON.parse(response);
      if (!introMessage?.content)
        return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`Here is you cord intro message
${introMessage.content}

word count: ${introMessage.content.split(' ').length}
explain:
${introMessage.explain}
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
- Generate cord intro message on path 'introMessage.content' of json response, limit content here to 150 words.
- At the end of cord intro message, invite reader to access your personal website that listed in your cord profile for more information.  
- Generate explain of cord intro message on path 'introMessage.explain' of json response

When you generate the message, consider following point:
1. Limit content to 150 words, as this is most people 1 minute can read.
2. Do not generate over-formal response by avoid using excited, passionate ...etc.

Here is best practice of cord intro message according to their website:
# How to write an effective intro message

Writing an intro message to a company on cord can seem daunting at first. A well-crafted, personalised message on cord can boost your chances of securing that interview opportunity by 84%*. 

Follow this guide to help you write an engaging message that will increase your chances of landing an interview. 

1. Keep it short & informal

Data has shown that shorter messages tend to get a better response from companies. The company will be able to see your profile, so there’s no need to go into too much detail about your past experience. Keep it short and snappy! 
As cord is a messaging tool designed to give you direct access to hiring teams, treat it like you would any messaging tool - be friendly and chatty. 
2. Personalise the message 

Show genuine interest in the company and be specific about what excites you - is it their product, their mission, their office dog? Mention any relevant industry insights or aspects of their team culture that caught your attention. 
Highlight 1 or 2 qualities that make you an ideal fit for the position. Touch on your skills, relevant experience, or how you align with the company's culture. 
3. Make scheduling simple

Why not let them know you’re keen to chat? To make it easy, offer a couple of times that would suit you over the coming days.  Be clear in your availability but remain flexible to accommodate their schedule.

## Examples of good and bad messages on cord
### Bad message
\`\`\`text
Hi, I’m interested in the position.
\`\`\`

- impersonal
- doesn’t show genuine interest

### Good message
\`\`\`text
Hi Joe, just saw the Front End position and I’m really interested! Your company looks like it’s at an exciting stage of growth, something I’d love to be part of. I’ve worked at a FinTech for a few years so think we could be a good fit. Are you free to chat this week? I’m free Wednesday morning or Thursday after 4pm. Let me know what suits you.
Cheers,
Susie
\`\`\`
- personal
- shows genuine interest
- offers times to speak

### Bad message
\`\`\`text
Hi, I'm interested in this role and look forward to a potential conversation about it. Thanks
\`\`\`

- impersonal
- implies they want to speak, but isn’t clear in availability 

### Good message
\`\`\`text
Hi Lucy,

I saw your Data Analyst role and wanted to reach out. I’m looking to join a team where I can immerse myself in data tools, connect with a diverse set of technologies and develop innovative products.

I have a background in Data Analysis and Machine Learning and believe my skills will be a solid addition to the team.

Feel free to send me a message back to arrange a call - I have good availability on weekday mornings.

Thanks,
Anna
\`\`\`
- personal
- shows genuine interest
- offers times to speak

### Bad message
\`\`\`text
Hi,
I was just going through roles on cord the other day and I stumbled upon the job listing for the Back End Engineer position and I felt like I have to reach out and let you know how incredibly enthusiastic I am about the opportunity to possibly work at such a renowned and prestigious company. It really would be a dream come true to be a part of a team that has accomplished as much as you guys have. I have been following your company for what feels like the longest time and I am pretty much familiar with every product you have launched in the past few years.
Now, diving a bit into my background, I have worked in a couple of tech companes in London mostly involving a lot of back-end stuff like dealing with databases and APIs etc. I am pretty good with Python and Node.js.I have garnered a substantial amount of experience, enough to say that I am pretty confident in my abilities to get stuff done, no matter how complicated or complex they might seem at the outset.
In summary, I think my background is perfect for the position. I can send my CV separately, if you’d like. I look forward to hearing back from you.
Sincerely,
Lucas
\`\`\`

- too long!
- doesn’t give any specific examples 
- offers to send CV (no need, as the company can see your cord profile and has access to your CV if they accept your message) 

### Good message
\`\`\`text
Hi Jane,

I've just come back from a career break and am now looking for a new Full Stack position.

After reading the job description, I believe I have the required skills for this position, in particular, due to my extensive Node.js experience, which formed a significant part of my previous role at Google.

Take a look at my profile and if you think we’d be a good fit I’d love to have an initial chat. I’m free most days this week.

Best,
Tom

PS check out my GitHub profile which has several personal projects on it - the link is on my cord profile :)
\`\`\`
- personal
- gives specific examples of previous experience
- offers to speak


`,
        role: 'system',
      },
      {
        content: `Sample JD here:
${await getSampleJD(SAMPLE_JD.Airlinen)}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          introMessage: {
            content: `Hi there
I came across the Full Stack Developer position at Airlinen and it really caught my attention. I’ve been working extensively with Node.js, TypeScript, and React, and I appreciate the entrepreneurial spirit of your company. I enjoy solving problems and being hands-on, which aligns with your need for a proactive team member. Having been involved in several fast-paced projects, I’m excited about the idea of building something impactful in the hospitality sector. I’d love to discuss how I can contribute to your mission. I'm available for a chat on anytime next week.

You can find more about me on my personal website, which is listed in my cord profile.`,
            explain: `This introductory message is tailored to engage with Airlinen by reflecting an appreciation for their entrepreneurial journey and specifically mentioning the technologies (Node.js, TypeScript, and React) relevant to the position. It emphasizes problem-solving and a hands-on approach, which resonates with the company’s need for initiative. Additionally, it invites a conversation while providing specific available times and access to my personal website for further details, making it concise and direct.`,
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
  await generateIntroMessageForCord(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    projects: listOpenSourceProjects(resume),
    references: listColleagueRecommendations(resume),
    works: listWorkExperiences(resume),
  });
}

await main();
