import { expect, test as baseTest } from '@playwright/test';

const test = baseTest.extend({
  renderElement: async ({ baseURL, page }, use) => {
    const render = async (src, elementName, attrs) => {
      await page.setContent(`<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimal-ui">
  <title>Test resume</title>
  <script src="${baseURL}${src}" type="module"></script>
  <style>
      /*https://robdodson.me/posts/at-font-face-doesnt-work-in-shadow-dom/*/
      @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css");
        :root {
          font-size: 62.5%; /*Make compute rem more easily*/
        }
        body {
          font-size: 1.6rem; /*Restore default font size*/
        }
  </style>
  <script>
    window.addEventListener('load', () => {
      const element = document.createElement('${elementName}')
      ${Object.entries(attrs)
        .map(([name, value]) => {
          return `element.setAttribute('${name}', JSON.stringify(${JSON.stringify(
            value,
          )}))`;
        })
        .join('\n')}
      document.querySelector('body').replaceChildren(element)
    });
  </script>
</head>

<body>
</body>

</html>
`);
      return page;
    };

    await use(render);
  },
});

export { expect, test };
