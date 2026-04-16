# Agent Guidelines - Glinter

This document provides essential information for agentic coding agents working on the Glinter repository.

## Project Overview
Glinter is a high-performance, transparent Git wrapper with interactive staging, built with **Bun** and **TypeScript** using **Hexagonal Architecture** (Domain, App, Infra).

## Development Commands

### Environment
- **Runtime**: Bun (>= 1.0.0)
- **Package Manager**: Bun

### Core Commands
- **Install dependencies**: `bun install`
- **Build**: `bun run build` (outputs to `./dist/index.js`)
- **Lint**: `bun run lint` (uses Biome)
- **Format**: `bun run lint:fix`
- **Development run**: `bun run src/index.ts`

### Testing (Vitest)
- **Run all tests**: `bun test` or `bun run test`
- **Run a single test file**: `bun test src/test/path/to/file.test.ts`
- **Run tests matching a pattern**: `bun test -t "pattern"`
- **Watch mode**: `bun test --watch`

## Code Style & Architecture

### Architecture (Hexagonal/DDD)
Follow the established module structure:
- `domain/`: Business logic, entities, and repository interfaces.
- `app/`: Use cases and command handlers.
- `infra/`: Concrete implementations (e.g., `BunGitRepository`) and external adapters.
- `test/`: Mirrored structure for unit and integration tests.

### Naming Conventions
- **Files**: `kebab-case.ts` (e.g., `add-command.ts`, `bun-git.repository.ts`).
- **Classes**: `PascalCase` (e.g., `AddCommand`, `GetChangesUseCase`).
- **Interfaces**: Usually same as domain name (e.g., `GitRepository`).
- **Variables/Functions**: `camelCase`.

### TypeScript Usage
- **Strict Typing**: Avoid `any`. Use `unknown` if necessary.
- **Interfaces/Types**: Prefer `interface` for repository definitions and `type` for simple data structures or use case parameters.
- **Imports**: Use `import type` for type-only imports. Omit file extensions in imports (handled by Bun/TS).

### Formatting (Biome)
The project uses Biome for linting and formatting. 
- Use **Tabs** for indentation (not spaces).
- No semicolons (except where required by JS syntax).
- Single quotes for strings.

### Error Handling
- Throw descriptive errors in `infra` or `domain` layers.
- Use cases should manage flow; commands should handle UI reporting.
- Prefer specific error classes if they exist in `src/error/`.

### Git/Shell Operations
- Use Bun's `$` shell for executing git commands: `await $`git status --porcelain -z`.quiet().text()`.
- For complex operations, use `Bun.spawn` to handle stdio properly (see `BunGitRepository.stageFiles`).

## Interaction & UX
- Glinter uses `@clack/prompts` for CLI interactions.
- Maintain consistent use of colors from `src/utils/colors.ts`.
- Ensure interactive prompts (Select, MultiSelect) are used for user decisions.

## Prohibited Actions
- Do NOT use `npm` or `yarn`. Use `bun`.
- Do NOT add semi-colons to TypeScript files.
- Do NOT change the directory structure without explicit approval.
