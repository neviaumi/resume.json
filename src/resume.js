import fs from 'node:fs/promises';
import path from 'node:path';

import { PUBLIC_ASSETS_FOLDER } from './workspace.js';

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

export function getPersonalWebSiteUrl(resume) {
  return resume.basics.website;
}
