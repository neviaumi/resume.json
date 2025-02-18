import clsx from 'clsx';

export function renderSkillExplainedSection({ githubLink, highlightedSkills }) {
  const hasHighlightedSkill = highlightedSkills.length > 0;
  const readmeLink = new URL(
    `${githubLink}/resume.json?tab=readme-ov-file#skill-level-definitions`,
  );

  return `
  <section class="${clsx('print:tw-break-inside-avoid')}" title="Skills level explained">
    ${
      hasHighlightedSkill
        ? `<p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-1 tw-text-base tw-font-medium tw-text-primary')}">
        <skill-badge skill="Skill" level="Highlight" element="span"></skill-badge>
        Matches JD requirements.
      </p>`
        : ''
    }
    <p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-1 tw-text-base tw-font-medium tw-text-primary')}">
        <skill-badge skill="Skill" level="Master" element="span"></skill-badge>
        Means I have mastered this skill.
    </p>
    <p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-1 tw-text-base tw-font-medium tw-text-primary')}">
        <skill-badge skill="Skill" level="Intermediate" element="span"></skill-badge>
        Means I am at an intermediate level in this skill.
    </p>
    <a href="${readmeLink}" target="_blank" class="${clsx('tw-text-base tw-font-bold tw-text-primary tw-underline')}">
      Check the README for a detailed definition of 'mastered' and 'intermediate.'
    </a>
  </section>`;
}
