import fs from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public');

export const resume = await fs
  .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'resume.base.json'), {
    encoding: 'utf-8',
  })
  .then(resume => JSON.parse(resume));

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
