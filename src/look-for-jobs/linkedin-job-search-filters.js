import * as openAI from '../open-ai.js';
import {
  listAllKeywordsFromResume,
  listColleagueRecommendations,
  listOpenSourceProjects,
  listWorkExperiences,
  resume,
} from '../resume.js';

async function generateLinkedInJobSearchFilterFromUserPreferences(
  preferences,
  { keywords, projects, references, works },
) {
  await openAI.withFeedbackLoop(openAI.prompt, {
    onPromptGenerated: response => {
      const { explain, linkedInFilter } = JSON.parse(response);
      if (!linkedInFilter) return openAI.fallbackOfPrintPromptMessage(response);
      // eslint-disable-next-line no-console
      console.log(`You can filter job by this expression:
${linkedInFilter}`);
      // eslint-disable-next-line no-console
      console.log(`Filter explain:
${explain}`);
    },
  })(
    [
      {
        content: `You are Software engineer who are looking for job in LinkedIn
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
- Generate the LinkedIn Boolean search according user preferences, working experenses, skills, participated projects in key path 'linkedInFilter'.
- Explain the generated filter on key path 'explain'

Here is official guide about LinkedIn Boolean Search
You can run a Boolean search on LinkedIn by combining keywords with operators like AND, NOT, and OR during your search.
Here are some ways to use Boolean logic and construct your searches:
Quoted searches: For an exact phrase, enclose the phrase in quotation marks. For example, type "product manager". You can also use quotation marks if you want to find someone with a multi-word title.
LinkedIn search only supports standard, straight quotation marks ("). Other software or websites may use special symbols that our system does not recognize. Curly quotation marks (“), also known as smart quotes or typographer's quotes, aren't supported.
In order to optimize overall site performance, stop words such as "by", "in", "with", etc. aren't used.
NOT searches: Type the word NOT (capital letters) immediately before a search term to exclude it from your search results. This typically limits your search results. For example, "programmer NOT manager".
OR searches: Type the word OR (capital letters) to see results that include one or more items in a list. This typically broadens your search results. For example, "sales OR marketing OR advertising”.
AND searches: AND searches: Type the word AND (capital letters) to see results that include all items in a list. This typically limits your search results. For example, "accountant AND finance AND CPA".
Note: You don't need to use AND. If your search has two or more terms, you'll automatically see results that include all of them.
Parenthetical searches - To do a complex search, you can combine terms using parentheses. For example, to find people who have "VP" in their profiles, but exclude "assistant to VP" or SVPs, type VP NOT (assistant OR SVP).
When handling searches, the overall order to precedence is:
Quotes [""]
Parentheses [()]
NOT
AND
OR
Important:
The + and - operators are not officially supported by LinkedIn. Using AND in place of + and NOT in place of - makes a query much easier to read and guarantees that we'll handle the search correctly.
When using NOT, AND, or OR operators, you must type them in uppercase letters.
We don't support wildcard "*" searches.
Boolean search will work in the keyword field in Recruiter and Linkedin.com, and will work in the Company, title, and keyword field in Sales Navigator.

`,
        role: 'system',
      },
      {
        content: `I want Full stack engineer that cover both Backend and Frontend development.
NodeJS / Python server was preferred as i have experence on the eco-system. but i am willing to learn new Stack.
Also, i not really want Finance industry as i find i not have passionate about that.
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          explain:
            "This filter is designed to search for candidates fitting the criteria of a Full Stack Engineer. It searches for job titles like 'Full Stack Engineer', 'Full Stack Developer', 'Developer', or 'Software Engineer' to broaden the search. The backend technologies considered include 'NodeJS' and 'Python', as these are preferred due to your experience. For frontend technologies, 'React', 'TypeScript', or 'JavaScript' are included. Finally, to respect your disinterest in the finance industry, 'Finance' is explicitly excluded from the search results.",
          linkedInFilter: `("Full Stack Engineer" OR "Full Stack Developer" OR "Developer" OR "Software Engineer") AND (NodeJS OR Python) AND (React OR TypeScript OR JavaScript) AND NOT (Finance)`,
        }),
        role: 'assistant',
      },
      {
        content: `I want Full stack engineer that cover both Backend and Frontend development.
NodeJS / Python server was preferred as i have experence on the eco-system. but i am willing to learn new Stack.
I also want full time role and hybird / remote working enviroment.
Also, i not really want Finance industry as i find i not have passionate about that.
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          explain:
            "This filter reflects your desire to find candidates for Full Stack Engineer or Software Developer roles, ensuring it encompasses both 'Software Engineer' and 'Software Developer'. The search criteria include those proficient in both backend and frontend development, specifically emphasizing NodeJS or Python as preferred backend technologies. It also includes relevant frontend keywords like 'React', 'TypeScript', or 'JavaScript'. Additionally, the filter specifies that only full-time roles in hybrid or remote working environments are sought after, while explicitly excluding any roles in the finance industry to better match your interests.",
          linkedInFilter: `("Full Stack Engineer" OR "Full Stack Developer" OR "Developer" OR "Software Engineer" OR "Software Developer") AND (NodeJS OR Python) AND (React OR TypeScript OR JavaScript) AND (Full-time) AND (Hybrid OR Remote) AND NOT (Finance)`,
        }),
        role: 'assistant',
      },
      {
        content: preferences,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
}

async function main() {
  await generateLinkedInJobSearchFilterFromUserPreferences(
    `I want Full stack engineer that cover both Backend and Frontend development.
NodeJS / Python server was preferred as i have experence on the eco-system. but i am willing to learn new Stack.
I also want full time role and hybird / remote working enviroment.
Also, i not really want Finance industry as i find i not have passionate about that.
`,
    {
      keywords: listAllKeywordsFromResume(resume),
      projects: listOpenSourceProjects(resume),
      references: listColleagueRecommendations(resume),
      works: listWorkExperiences(resume),
    },
  );
}

await main();
