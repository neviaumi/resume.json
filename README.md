# resume.json

[![deploy-github-page-after-push-master](https://github.com/davidNHK/resume.json/actions/workflows/deploy-gh-page.yml/badge.svg)](https://github.com/davidNHK/resume.json/actions/workflows/deploy-gh-page.yml)

Repo here contain my personal resume.

## Development

```bash
bash ./scripts/setup.sh
npm run serve
```

### Generate tailored resume

```bash
npm run serve
node ./src/build-pdf.js --private
```

after that you will see `resume.pdf` in `docs/` folder

### Get PDF

`npm run build:docker`
and then check [PDF](./docs/resume.pdf)

## Live

### if you're watching this then I suggest you read web version

[WEB version](https://neviaumi.github.io/resume.json/)

[PDF Version](https://neviaumi.github.io/resume.json/resume.pdf)

## Skill level definition

### Programming language / Framework / Library

- Master - I am confidently work on feature independently
  without too much research on internet about `how to do stuff`
  and still followed the best practice by this language
- Intermediate - I can work on feature independently
  with some research on internet and
  will need experienced teammate do the code review

### Architecture Components (Queue, DB ..etc.)

- Master - Beside to integration from code,
  I also can set up optimized configuration and deploy to production
- Intermediate - I am confidence on how integrate from application code
  and integration pattern also with some basic development environment setup

### Protocol (REST, HTTP, GraphQL ..etc.)

- Master - I know best practice of the protocol
  and how to defense security attack and performance turning
- Intermediate - I can integrate on application and how it's working

### Workflow

- Master - I know both theory and have real world execution,
  and I can explain and debt to teammate
- Intermediate - I know theory and have real world execution

## Reuse that work with your resume?

Copy and paste code below and replace `JSON.stringify({})`
with your resume.json content

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimal-ui"
    />
    <title>David Ng</title>
    <script
      src="https://neviaumi.github.io/resume.json/js/json-resume.element.js"
      type="module"
    ></script>
    <style>
      /*https://robdodson.me/posts/at-font-face-doesnt-work-in-shadow-dom/*/
      @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css');
      @page {
        size: A4;
      }

      @media print {
        :root {
          font-size: 50%; /*Make element on PDF smaller*/
        }
        body {
          font-size: 1.5rem;
        }
      }

      @media screen {
        :root {
          font-size: 62.5%; /*Make compute rem more easily*/
        }
        body {
          font-size: 1.6rem; /*Restore default font size*/
        }
      }
    </style>
    <script>
      const resumeElement = document.querySelector('json-resume');
      // place your resume.json content here
      resumeElement.setAttribute('resume', JSON.stringify({}));
    </script>
  </head>

  <body>
    <json-resume />
  </body>
</html>
```
