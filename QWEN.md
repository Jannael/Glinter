# Glinter - QWEN.md

## Project Overview

**Glinter** is a high-performance, transparent Git wrapper built with **Bun** and **TypeScript**. It enhances the standard `git add` and `git switch` workflows with beautiful, interactive CLI interfaces while acting as a seamless pass-through for all other Git commands.

### Key Features
- **Interactive `add`**: Multi-select interface for staging files with color-coded status indicators
- **Interactive `switch`**: Branch selection interface with visual distinction between local and remote branches
- **Transparent Proxy**: For all other commands, passes through to native Git with full color and interactivity support
- **Safe by Default**: Automatically prevents accidental staging of `.env` and `node_modules`

### Architecture
The project follows **Hexagonal Architecture (Ports and Adapters)** with vertical slicing:

```
src/
├── add/                    # Add feature vertical slice
│   ├── domain/             # Business logic & ports
│   │   ├── change.ts       # Change entity
│   │   └── git.repository.ts  # Repository port interface
│   ├── app/                # Use cases & commands
│   │   ├── add-command.ts
│   │   ├── get-changes.use-case.ts
│   │   └── stage-changes.use-case.ts
│   ├── infra/              # External adapters
│   │   └── bun-git.repository.ts
│   └── main.ts             # Feature entry point
│
├── switch/                 # Switch feature vertical slice
│   ├── domain/
│   │   ├── branch.ts       # Branch entity
│   │   └── switch.repository.ts
│   ├── app/
│   │   ├── switch-command.ts
│   │   ├── get-branches.use-case.ts
│   │   └── switch-branch.use-case.ts
│   ├── infra/
│   │   └── bun-switch-repository.ts
│   └── main.ts
│
├── packages/               # Shared utilities
│   ├── colors.ts           # ANSI color constants
│   ├── check.ts            # Check mark symbol constant
│   ├── multiselect.ts      # Clack multiselect wrapper
│   └── select.ts           # Clack select wrapper
│
├── test/                   # Tests (mirrors src structure)
│   └── add/
│       ├── app/
│       └── domain/
│
└── index.ts                # Main entry point
```

## Building and Running

### Prerequisites
- **Bun** >= 1.0.0
- **TypeScript** 5

### Commands

```bash
# Development
bun run dev                 # Run src/index.ts
bun run src/index.ts        # Direct execution

# Production
bun run build               # Build to dist/index.js

# Testing
bun run test                # Run vitest
bun run test <path>         # Run specific test file

# Linting & Formatting
bun run lint                # Run biome check
bun run lint:fix            # Format with biome
```

### CLI Usage
```bash
g add           # Opens interactive file selector
g switch        # Opens interactive branch selector
g <any-command> # Passes through to git (status, commit, push, etc.)
```

## Development Conventions

### Code Style
- **Tabs** for indentation (Biome config)
- **Single quotes** for strings
- **No semicolons** (asNeeded)
- **ESNext** target with strict TypeScript

### Testing
- Uses **Vitest** for unit tests
- Tests mirror the source structure under `src/test/`
- Mock external dependencies (e.g., `@clack/prompts`) using `vi.mock()`
- Follow the existing test patterns for consistency

### Color Constants
All ANSI color codes are centralized in `src/packages/colors.ts`:
- `GREEN`, `YELLOW`, `RED`, `BLUE`, `MAGENTA` - Text colors
- `BOLD`, `BLACK` - Formatting
- `BG_YELLOW` - Background color (for warnings)
- `RESET` - Reset formatting

Use the `CHECK` constant from `src/packages/check.ts` for the green checkmark symbol.

### Architecture Patterns
- **Use Cases**: Contain business logic, depend on repository interfaces (domain layer)
- **Commands**: Orchestrate use cases, handle I/O
- **Repositories**: Implement domain interfaces, interact with external systems (git, filesystem)
- **Entities/Domain**: Pure business objects with no external dependencies

### Dependencies
- `@clack/prompts` - CLI prompt components (multiselect, select)
- `@biomejs/biome` - Linting and formatting
- `vitest` - Testing framework
