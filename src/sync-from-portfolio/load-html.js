const portfoiloBaseUrl = 'https://neviaumi.github.io/portfolio';

export function loadHomePage() {
  return fetch(new URL('', portfoiloBaseUrl)).then(resp => resp.text());
}

export function loadCoreValuePage() {
  return fetch(new URL('core-values', portfoiloBaseUrl)).then(resp =>
    resp.text(),
  );
}

export function loadSkillPage() {
  return fetch(new URL('skills', portfoiloBaseUrl)).then(resp => resp.text());
}

export function loadExperiencePage() {
  return fetch(new URL('experiences', portfoiloBaseUrl)).then(resp =>
    resp.text(),
  );
}
