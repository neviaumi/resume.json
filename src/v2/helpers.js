import css from '../main.css?url';

export const json = {
  withQuoteEscape(stringifyFunction) {
    return function stringifyFunctionWithQuoteEscape(primitive) {
      return stringifyFunction(primitive, (_, value) => {
        if (typeof value === 'string') {
          if (value.includes("'")) {
            return value.replace(/'/g, '&apos;');
          }
          if (value.includes('"')) {
            return value.replace(/"/g, '&quot;');
          }
          return value;
        }
        return value;
      });
    };
  },
};

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
          link.setAttribute('href', css);
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
};
