export const resume = await import(
  'https://neviaumi.github.io/portfolio/resume.json',
  {
    assert: { type: 'json' },
  }
).then(resume => JSON.parse(resume));

export function listAllKeywordsFromResume(resume) {
  return Array.from(
    new Set(
      [
        resume.projects.map(project => project.keywords).flat(),
        resume.skills.map(skill => skill.keywords).flat(),
        resume.work.map(work => work.keywords).flat(),
      ].flat(),
    ),
  );
}

export function listWorkExperiences(resume) {
  return resume.work;
}

export function listColleagueRecommendations(resume) {
  return resume.references.slice(0, 3);
}

export function listOpenSourceProjects(resume) {
  return resume.projects;
}

export function getPersonalWebSiteUrl(resume) {
  return resume.basics.website;
}
