# 🚀 Frontend Application

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)
![pnpm](https://img.shields.io/badge/pnpm-8.x-blue?style=flat-square&logo=pnpm)
![Remix.js](https://img.shields.io/badge/Remix.js-%23white?style=flat-square&logo=remix)
![Biome.js](https://img.shields.io/badge/Biome.js-linter-orange?style=flat-square)
![Husky](https://img.shields.io/badge/Husky-git_hooks-red?style=flat-square)
![Commitlint](https://img.shields.io/badge/Commitlint-conventional_commit_rules-blue?style=flat-square)

## Overview

This project is a **frontend application** developed using the following stack:

- **Node.js v20**
- **pnpm v8** (Strictly no `npm`)
- **Remix.js**
- **Axios** for HTTP requests

## 🛠 Development Standards

1. **Dependency Installation**:
   - Use `--save-exact` flag for dependency installation.
   - **Dynamic versioning is prohibited** (e.g., no `^` or `~`).
   - Use **pnpm** exclusively for managing dependencies. 
   - Example:  
     ```bash
     pnpm install axios --save-exact
     ```

2. **Branch Commit Rules**:
   - Direct commits to `main` and `develop` branches are **strictly prohibited**.
   - Use **feature branches** and create pull requests for changes.

3. **Code Quality Tools**:
   - **Biome.js** is used for linting and formatting.
   - **Husky** is configured for Git hooks.
   - **Commitlint** ensures commits follow conventional commit rules.

## ⚙️ Installation and Setup

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## 🧹 Linting and Formatting

This project includes the following commands for maintaining code quality:

- **Lint Check**:  
  Run `pnpm check` to analyze the code with **Biome.js** and report any linting issues.
  ```bash
  pnpm check
  ```

- **Auto-Format**:  
  Run `pnpm format` to automatically fix formatting issues where possible.
  ```bash
  pnpm format
  ```

## 🤝 Contributing

Follow these guidelines to contribute to the project:

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/<feature-name>
   ```

2. Commit changes using conventional commit messages:
   ```bash
   git commit -m "feat: add new login component"
   ```

3. Push the branch and create a pull request.

## 📜 License

This project is licensed under [MIT License](LICENSE).

Enjoy coding! 🚀