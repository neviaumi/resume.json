import open_ai
import json
import time
import httpx


def print_api_response(open_ai_responses, time_spent):
    print(f"""
OpenAI response:
{open_ai_responses[-1].content}

-------------------------------------

Time spend: {round(time_spent, 4)} seconds
""")


with open("../docs/resume.json", "r") as resume, open("../docs/jd.md", "r") as jd, open(
    "../docs/draft-introduction.md") as draft_introudction:
    resume_json = json.loads(resume.read())
    resume_str = json.dumps(resume_json)
    resume_json_schema = json.dumps(httpx.get(resume_json["$schema"]).json())
    draft_introudction_str = draft_introudction.read()
    jd_str = jd.read()
    start = time.perf_counter()
    open_ai_responses = open_ai.prompt_init(
        "You are Software engineer preparing go to interview.",
        f"""Opmitze my introduction speech in Markdown format below and advise what i can do better.
Response the enhanced speech in plain-text and keep your wording simple and professional.
i not a native english speaker and i want to speech finish within 3 minutes.
you can read my resume and JD from assistent content.
I have drafted the introduction here, feel free to change it.

{draft_introudction_str}
""",
        [f"""here is my resume on JSON format:
{resume_str}""",
         f"""here is the job description on markdown format about the job you are going to interview:
{jd_str}
""",
         f"""for my resume json, you can read the schema definition here:
{resume_json_schema}""",
         f"""here is key elements of sucessful interviews:
1. Start with basic background information
Include who you are, who you work for (or school and major), and what you do.

Internships - You should mention the following: name, school and major, focus areas, past internships and/or noteworthy projects
Full-time - You should mention the following: name, past companies, noteworthy projects (best if it's a public consumer product that they would have heard of)
Does this look familiar? It should be, because it is similar to your resume! Your resume is a condensed version of your knowledge and experiences and your self introduction is essentially a condensed version of your resume. As you grow older, professional experience becomes more important and school background becomes less important. Hence your self introduction changes as you become more senior.

2. KISS (Keep It Simple and Sweet)
Tell them some highlights from your favorite/most impressive projects and including some numbers if they're impressive or challenges that you've overcome. Do not delve into the depths of how you reverse engineered a game and decrypted a packet to predict when to use your DKP on a drop. Tell them the executive summary: "I reverse engineered X game by decrypting Y packet to predict Z." If this catches their interest, they might ask further questions on their own.

3. Why do they want you?​
Tell the interviewer why you would make a good hire. Is your experience relevant to the company? Have you used a similar tech stack as the company or built relevant products? What unique talent(s) do you have that may give them confidence about your ability to contribute to the company?
""",
         f"""here is some good example of software engineer self introductions
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
        """]
    )

end = time.perf_counter()

print_api_response(open_ai_responses, end - start)

should_finish = False

while not should_finish:
    feedback = input("Type EOP if no more feedbacks: ").strip()
    should_finish = feedback == 'EOP'
    if should_finish:
        print("This is final version of generated result:")
        print_api_response(open_ai_responses, end - start)
        continue
    start = time.perf_counter()
    open_ai_responses = open_ai.prompt_follow_up(open_ai_responses, feedback)
    end = time.perf_counter()
    print_api_response(open_ai_responses, end - start)
