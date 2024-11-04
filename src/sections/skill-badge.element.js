import clsx from 'clsx';

import { styles } from '../helpers.js';

class SkillBadgeElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const skill = this.attributes.skill.value;
    const level = this.attributes.level.value;
    const elementName = this.attributes.element.value;
    const template = document.createElement('template');
    const styleByLevel = {
      Highlight: clsx(
        'tw-border tw-border-emerald-700 tw-bg-emerald-500 tw-font-bold tw-text-white',
      ),
      Intermediate: clsx('tw-bg-sky-300 tw-font-medium tw-text-white'),
      Master: clsx(
        'tw-border tw-border-amber-700 tw-bg-amber-500 tw-font-bold tw-text-white',
      ),
      Unknown: clsx('tw-border tw-border-gray-300 tw-text-gray-600'),
    };
    // language=html
    template.innerHTML = `
      <${elementName} class="${clsx(
        'tw-rounded-full',
        'tw-px-1.5',
        'tw-py-0.5',
        'tw-text-center',
        'tw-text-base',
        styleByLevel[level],
      )}">${skill}
      </${elementName}>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('skill-badge', SkillBadgeElement);
