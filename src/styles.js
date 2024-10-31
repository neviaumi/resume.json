// https://web.dev/css-module-scripts/
// export async function createSharedStyles() {
//   const bootstrap = await import(
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
//     {
//       assert: { type: 'css' },
//     }
//   );
//   const bootstrapIcons = await import(
//     'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
//     {
//       assert: { type: 'css' },
//     }
//   );
//   return [bootstrap.default, bootstrapIcons.default];
// }

function createBootstrapDependencies() {
  const bootstrap = document.createElement('link');
  bootstrap.setAttribute('rel', 'stylesheet');
  bootstrap.setAttribute(
    'href',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
  );
  bootstrap.setAttribute('crossorigin', 'anonymous');
  const bootstrapIcon = document.createElement('link');
  bootstrapIcon.setAttribute('rel', 'stylesheet');
  bootstrapIcon.setAttribute(
    'href',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
  );
  bootstrapIcon.setAttribute('crossorigin', 'anonymous');

  return [bootstrap, bootstrapIcon];
}

function createSharedStyles() {
  const sharedStyles = document.createElement('style');
  // language=css
  sharedStyles.textContent = `
    @media print{
      .card, .list-group-item{
        break-inside: avoid;
      }
      .print-break-inside-avoid {
        break-inside: avoid;
      }
    }

    `;
  return sharedStyles;
}

export async function injectSharedStyles(shadowRoot) {
  // Not yet supported on Safari / Firefox
  // shadowRoot.adoptedStyleSheets = await createSharedStyles();
  const [bootstrap, bootstrapIcon] = createBootstrapDependencies();
  const sharedStyles = createSharedStyles();
  shadowRoot.appendChild(bootstrap);
  shadowRoot.appendChild(bootstrapIcon);
  shadowRoot.appendChild(sharedStyles);
}
