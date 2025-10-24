# Contributing to morethan-log-astro

Thanks for taking the time to contribute! This template powers production sites, so every improvement helps the community ship faster and more safely.

## Before You Start

- Use the latest **Node.js 18 LTS** (or newer) and npm 9+.
- Fork or clone the repo, then install dependencies:
  ```bash
  npm install
  ```
- When you add or rename content collections, run `npx astro sync` so generated types stay current.
- The default branch is `main`. Create feature branches from `main` and keep pull requests narrowly scoped when possible.

## Project Scripts

| Command | What it does |
| ------- | ------------- |
| `npm run dev` | Starts Astro’s dev server and rebuilds the bundled client script (`public/js/main.js`) in watch mode. |
| `npm run build` | Produces a static build (`dist/`) and formats the output bundle. Run this before opening a PR. |
| `npm run preview` | Serves the last production build locally. |
| `npm run client:build` | Bundles client-side scripts once using `scripts/build-client.mjs` (useful for CI). |
| `npm run client:watch` | Rebuilds the client bundle on file changes. The dev script calls this automatically. |
| `npm run format:dist` | Re-applies the post-build formatters (HTML/CSS/JS beautify + CSSO minification). |

We don’t ship a lint step yet—if you add one, document it in the README and scripts table.

## Reporting Issues

- Search [existing issues](https://github.com/JustSereja/morethan-log-astro/issues) before opening a new one.
- Include a concise title, reproduction steps, expected vs. actual behaviour, and environment details.
- Attach screenshots or logs when they clarify the problem.

## Proposing Enhancements

- Open an issue describing the use case, the change you’d like to make, and any alternatives you considered.
- If you already have an implementation, mention it up front so maintainers can help scope the work.

## Pull Request Checklist

1. Fork the repo and create a branch (`feature/…`, `fix/…`, etc.).  
2. Make your changes along with unit or integration coverage where it adds value. (Astro content typically exercises behaviour via `npm run build`.)  
3. Run `npm run build` locally and ensure it completes without warnings or errors.  
4. Update documentation when behaviour or setup changes—particularly `README.md`, `PRODUCTION_CHECKLIST.md`, or configuration comments.  
5. Follow conventional, descriptive commit messages (e.g., `feat: add fr locale support`).  
6. Open a pull request against `main`, fill out the template, and link related issues. Include screenshots/gifs for UI changes.  
7. Be ready for review feedback; we value respectful, iterative collaboration.

## Code Style & Architecture

- Keep configuration centralized in `src/config/`—avoid hard-coded strings in components.  
- Use existing utility modules (`@lib/content`, `@utils/url`, etc.) instead of duplicating logic.  
- Prefer TypeScript-defined interfaces (see `src/config/types.ts`) when expanding config.  
- For client scripts, export initialization functions from `src/scripts/modules/*` and register them in `src/scripts/main.ts` so hot reloading behaves consistently.  
- When adding third-party assets, prefer hosting them locally via the bundler instead of new CDN calls.  
- Limit component-level inline scripts/styles to the behaviour they control; shared logic belongs in modules under `src/scripts` or `src/utils`.

## Documentation

This repo ships as a template. When you add or change features, update:

- `README.md` for public-facing instructions.
- `PRODUCTION_CHECKLIST.md` so adopters know what to customize.
- `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` if collaboration expectations change.

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behaviour to demo@morethan-log.com.

## Getting Help

If something is unclear, open a discussion or issue. We’re happy to clarify expectations or pair on a solution.

Thank you for investing your time in making morethan-log-astro better! Your contributions help everyone launch beautiful Astro blogs faster.***
