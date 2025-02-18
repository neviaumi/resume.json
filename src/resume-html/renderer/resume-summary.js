import clsx from 'clsx';

export function renderSummarySection({ summary }) {
  return `
  <section class="${clsx('print:tw-break-inside-avoid')}">
    <header class="${clsx(
      'tw-mb-1.5 tw-text-3xl tw-font-black tw-underline tw-underline-offset-8 print:tw-underline-offset-4',
    )}">
      Summary
    </header>
    <p class="${clsx('tw-text-xl tw-font-medium tw-text-primary')}">
      ${summary}
    </p>
  </section>`;
}
