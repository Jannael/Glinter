<p align="center">
  <br>
  <br>
  <a href="https://glinter.jannael.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img alt="Glinter" src="https://github.com/Jannael/glinter/raw/main/apps/web/public/og.png">
    </picture>
  </a>
</p>

Glinter is a high-performance, transparent Git wrapper built with **Bun**.

[Tutorial](https://youtu.be/LQWp6flYeyI)

[Commands](https://glinter.jannael.com/#commands)

[Aliases](https://glinter.jannael.com/alias)

[Quick start](https://glinter.jannael.com/#quick-start)

## Preview

### Badge

| Preview                                                                          | Copy                                                                               |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [![Glinter](https://glinter.jannael.com/badge.svg)](https://glinter.jannael.com) | `[![Glinter](https://glinter.jannael.com/badge.svg)](https://glinter.jannael.com)` |

<video src="https://github.com/user-attachments/assets/63b401a0-e1e1-453c-9e38-c36cd14e200f" controls="false" autoplay="true" loop="true" muted="true" style="max-width: 100%;">
Your browser does not support the video tag.
</video>

### Screenshots

| `g add`                              | `g commit`                              |
| ------------------------------------ | --------------------------------------- |
| ![glinter add](./screenshots/ga.png) | ![glinter commit](./screenshots/gc.png) |

## Security

Security is a top priority for this project.

This project uses Bun as its runtime and package manager. You don't need to worry about package vulnerabilities — the `bunfig.toml` configuration includes `minimumReleaseAge = 259200` (3 days), which prevents newly published packages from being installed automatically. This protects against supply chain attacks that have become increasingly common in the npm ecosystem.

## Features

- **Abbreviation**: You can use `g` instead of `git`.

- **Safe by Default**: Automatically filters and prevents accidental staging of sensitive files: `.env` and `node_modules`.

- **Transparent Wrapper**: For every other command (like `commit`, `push`, `log`, or `status`), Glinter acts as a direct tunnel to Git. It preserves all original colors, formatting, and interactive features of the native Git CLI.

## Test environment

- for windows i used my own laptop (windows 11) so if you have a problem please create an issue

- for linux i used WSL (windows subsystem linux) with a kali-linux vm so if you have a problem please create an issue

## How it works

Glinter is designed to be as "natural" as possible, meaning it shouldn't feel like a wrapper at all.

### 1. The Transparent Proxy

In `src/index.ts`, Glinter uses `Bun.spawn` with `stdio: 'inherit'`. This is a low-level operation that connects the standard input, output, and error streams of the Git process directly to your terminal.

- **Result**: Git "knows" it's in a real terminal, so it correctly detects colors and allows for interactive prompts (like credential entry).

### 2. Reliable Status Parsing

For the interactive `add` feature, Glinter runs `git status --porcelain`.

- **Why?**: Standard `git status` output is designed for humans and can change based on your Git version or system language. `--porcelain` is a machine-readable format that is consistent across all environments, making the file detection 100% reliable.

### 3. Interactive Selection

Using the `@clack/prompts` library, Glinter transforms the raw status data into a selectable list.

- The selection logic uses Bun's high-speed shell to execute the final `git add` command, correctly escaping filenames to handle spaces and special characters.

## Installation

To use Glinter as your primary Git interface (e.g., using the command `g`):

```bash
npm install -g @jannael/glinter
```

### For Development

1. **Clone the repo**
2. **Install dependencies**: `bun install`
3. **Link the binary**: `bun link`

now you can simply run:

```bash
g add           # Opens the interactive selector
g commit        # Opens commit type + message prompt
g add <file>    # Runs standard git add <file>
g commit -m ""  # Runs standard git commit -m ""
g status        # Runs standard git status
g push          # Runs standard git push
```

## TODO
- [ ] remove get-commits.use.case.ts (it's rebundant better to call the method from the repo) 
- [ ] ggclean (shorthand for git reset --hard && git clean -fd )
