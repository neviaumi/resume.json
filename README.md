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

## Skill Level Definitions

### Programming Language / Framework / Library

- **Master** - I can confidently work on features independently
  without needing extensive online research about "how to do things,"
  while still following best practices specific to the language.
- **Intermediate** - I can work on features independently with some online research,
  but will need an experienced teammate to review my code.

### Architecture Components (Queues, Databases, etc.)

- **Master** - In addition to integrating components in code,
  I can also set up optimized configurations and deploy them to production.
- **Intermediate** - I am confident in integrating components from application code
  and understanding integration patterns,
  along with basic development environment setup.

### Protocols (REST, HTTP, GraphQL, etc.)

- **Master** - I understand best practices for the protocol,
  can defend against security attacks,
  and handle performance tuning.
- **Intermediate** - I can integrate the protocol into applications
  and understand how it works.

### Workflow

- **Master** - I understand both theory and real-world application,
  and I can explain concepts and
  handle technical discussions with teammates.

- **Intermediate** - I understand the theory and have practical experience
  with real-world execution.
