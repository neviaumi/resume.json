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
        @media print {
            .card, .list-group-item {
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
  const [bootstrap, bootstrapIcon] = createBootstrapDependencies();
  const sharedStyles = createSharedStyles();
  shadowRoot.appendChild(bootstrap);
  shadowRoot.appendChild(bootstrapIcon);
  shadowRoot.appendChild(sharedStyles);
}

export function withInjectedStyles(Element) {
  return function withAttachShadowOptions(options) {
    return class ElementWithInjectedStyles extends Element {
      constructor() {
        super();
        this.attachShadow(options);
        import('./main.css?url').then(style => {
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', style.default);
          this.shadowRoot.appendChild(link);
        });
      }
    };
  };
}
