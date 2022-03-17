import { promises as fs } from 'fs';
import handlebars from 'handlebars';
import handlebarsWax from 'handlebars-wax';
import { DateTime } from 'luxon';
import path from 'path';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;

handlebars.registerHelper({
  concat: (...args) => args.filter(arg => typeof arg !== 'object').join(''),

  eq: (a, b) => a === b,

  formatAddress: (...args) =>
    args.filter(arg => typeof arg !== 'object').join(' '),
  formatDate: date => DateTime.fromISO(date).toFormat('LL/yyyy'),
  formatSkills: skills => {
    const formattedSkills = new Map(); // Use Map to preserve insert order
    for (const skill of skills) {
      if (!formattedSkills.has(skill.name)) formattedSkills.set(skill.name, {});
      formattedSkills.get(skill.name)[skill.level] = skill.keywords;
    }

    return Array.from(formattedSkills).map(([skillGroup, levels]) => {
      return {
        levels,
        name: skillGroup,
      };
    });
  },
  lowercase: s => s.toLowerCase(),
  removeProtocol: url => url.replace(/.*?:\/\//g, ''),
});

export async function render(resume) {
  const dir = `${currentDir}/src`;
  const css = await fs.readFile(`${dir}/style.css`, 'utf-8');
  const resumeTemplate = await fs.readFile(`${dir}/resume.hbs`, 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(`${dir}/partials/**/*.{hbs,js}`);

  return Handlebars.compile(resumeTemplate)({
    resume,
    style: `<style>${css}</style>`,
  });
}
