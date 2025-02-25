# resume.json

[![deploy-github-page-after-push-master](https://github.com/davidNHK/resume.json/actions/workflows/deploy-gh-page.yml/badge.svg)](https://github.com/davidNHK/resume.json/actions/workflows/deploy-gh-page.yml)

This is a repository dedicated to maintaining and showcasing my personal resume in a JSON-based format.
Additionally, a web-friendly version is available for public viewing.

## Table of Contents

- [Development](#development)
- [Live Version](#live-version)
- [Tech Stack](#tech-stack)
- [Skill Level Definitions](#skill-level-definitions)

## Development

To set up the development environment for this project:

1. Clone the repository:

   ```bash
   git clone https://github.com/davidNHK/resume.json.git
   cd resume.json
   ```

2. Run the setup script:

   ```bash
   bash ./scripts/setup.sh
   ```

3. Start the development server:
   ```bash
   npx vite dev
   ```

### Prerequisites

- Node.js (Refer to the `.nvmrc` file for the preferred version.)
- npm (Package manager used in this project.)
- TailwindCSS, PostCSS (for styling and utilities.)

**Note:** Ensure `node_modules` are installed by running `npm install` if the setup script does not handle this.

## Live Version

Explore the web version of my resume here:

👉 **[WEB version](https://neviaumi.github.io/resume.json/)**

## Features

- JSON-based resume format.
- Modular and reusable web components.
- TailwindCSS integration.
- Continuous Deployment to GitHub Pages via actions.

## Tech Stack

This project uses the following technologies and tools:

- **Frontend Framework:** [Vite](https://vitejs.dev/)
- **Styling:** TailwindCSS
- **Testing:** [Vitest](https://vitest.dev/)
- **Web Components:** Custom Elements for reusable components.
- **Continuous Integration and Deployment:** GitHub Actions (`deploy-gh-page.yml`)
- **Linting and Formatting:**
  - ESLint with custom configurations (`@busybox/eslint-*`)
  - Prettier with a shared config (`@busybox/prettier-config`)
- **Version Control Hooks:** Husky and lint-staged for pre-commit checks.

## Skill Level Definitions

Below, I've defined my skill levels across various categories:

### Programming Language / Framework / Library

- **Master**: I can confidently work on features independently, follow best practices, and avoid reliance on extensive online research.
- **Intermediate**: I can work independently with some online research but require a code review by an experienced teammate.

### Architecture Components (Queues, Databases, etc.)

- **Master**: I can set up optimized configurations, integrate components, and deploy them to production.
- **Intermediate**: I can handle code integration and basic development environment setup.

### Protocols (REST, HTTP, GraphQL, etc.)

- **Master**: I understand best practices, security measures, and performance tuning for the protocol.
- **Intermediate**: I can integrate the protocol and understand its mechanics.

### Workflow

- **Master**: I have theoretical understanding paired with real-world execution experience. I can conduct technical discussions with teammates effectively.
- **Intermediate**: I have practical experience along with a strong theoretical foundation.

---

## Folder Structure

Here's an overview of the directory structure for better understanding:

```
resume.json
 ├── .github                 # GitHub-related configurations (e.g., workflows)
 ├── web-components          # Custom web components
 ├── node_modules            # Dependencies managed by npm
 ├── public                  # Static assets
 ├── scripts                 # Helper scripts for the project
 ├── dist                    # Production-ready output (built files)
 ├── README.md               # Documentation for the project
 ├── package.json            # NPM package file with dependencies
 └── vite.config.js          # Vite configuration file
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b GH-[issue_id]_my-feature
   ```
3. Commit your changes with meaningful messages.
4. Push your branch and submit a Pull Request.

Ensure that your changes pass tests (`bash ./scripts/test.sh`).

## License

This repository is licensed under the [MIT License](LICENSE).

---

Thank you for visiting! 😊
