import css from './main.css?url';

export const baseUrl = (() => {
  try {
    return `${new URL(
      import.meta.env.BASE_URL ?? 'Something',
      new URL(import.meta.url).origin,
    ).toString()}/`;
  } catch {
    return '';
  }
})();

export const date = {
  formatDate(dateStr) {
    const locale = 'en-GB';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString(locale, {
      month: 'short',
      year: 'numeric',
    });
  },
};

export const styles = {
  withInjectedStyles(Element) {
    return function withAttachShadowOptions(options) {
      return class ElementWithInjectedStyles extends Element {
        constructor() {
          super();
          this.attachShadow(options);
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', new URL(css, baseUrl).toString());
          this.shadowRoot.appendChild(link);
        }
      };
    };
  },
};

export const skills = {
  categorizeKeywordsBySkillLevel(keywords, resumeSkills) {
    const groupedSkills = resumeSkills.reduce(
      (acc, { keywords: skillNames, level }) => {
        acc[level] = (acc[level] || []).concat(skillNames);
        return acc;
      },
      {},
    );

    const result = Object.fromEntries(
      Object.entries(groupedSkills).map(([level, skillNames]) => [
        level,
        skillNames
          .filter(skill =>
            keywords
              .map(key => key.toLowerCase())
              .includes(skill.toLowerCase()),
          )
          .sort(),
      ]),
    );

    result.Unknown = keywords
      .filter(
        keyword =>
          !Object.values(groupedSkills)
            .flat()
            .map(key => key.toLowerCase())
            .includes(keyword.toLowerCase()),
      )
      .sort();
    return result;
  },
  excludeHighlightedSkills(highlightedSkills) {
    return function filterFunction(skill) {
      return !highlightedSkills.some(highlightedSkill => {
        return highlightedSkill.toLowerCase() === skill.toLowerCase();
      });
    };
  },
  highlightedSkillsFirst(highlightedSkills) {
    return function sortFunction(skillA, skillB) {
      const isSkillAShouldHighlighted =
          skills.includeHighlightedSkills(highlightedSkills)(skillA),
        isSkillBShouldHighlighted =
          skills.includeHighlightedSkills(highlightedSkills)(skillB),
        shouldKeepCurrentOrder =
          (!isSkillAShouldHighlighted && !isSkillBShouldHighlighted) ||
          (isSkillAShouldHighlighted && isSkillBShouldHighlighted);
      if (shouldKeepCurrentOrder) return 0;
      if (isSkillAShouldHighlighted) return -1;
      if (isSkillBShouldHighlighted) return 1;
    };
  },
  includeHighlightedSkills(highlightedSkills) {
    return function filterFunction(skill) {
      return highlightedSkills.some(highlightedSkill => {
        return highlightedSkill.toLowerCase() === skill.toLowerCase();
      });
    };
  },
};
