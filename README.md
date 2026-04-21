# Glinter

Glinter is a high-performance, transparent Git wrapper built with **Bun**. It enhances the standard `git add` workflow with a beautiful, interactive CLI interface while acting as a seamless pass-through for all other Git commands.

## Preview

<video src="https://github.com/user-attachments/assets/f488ac07-f36a-4a56-a533-9598c46596ed" controls="false" autoplay="true" loop="true" muted="true" style="max-width: 100%;">
Your browser does not support the video tag.
</video>


## Features

- **Interactive `add`**: When you run `g add`, it presents a color-coded list of your modified, new, and deleted files. You can multi-select exactly what you want to stage using a GUI-like interface in your terminal.

- **Interactive `commit`**: Running `g commit` opens a guided flow to select a Conventional Commit type (`feat`, `fix`, `chore`, etc.) and enter the commit message.

- **Transparent Wrapper**: For every other command (like `commit`, `push`, `log`, or `status`), Glinter acts as a direct tunnel to Git. It preserves all original colors, formatting, and interactive features of the native Git CLI.

- **Safe by Default**: Automatically filters and prevents accidental staging of sensitive files: `.env` and `node_modules`.

- **Abbreviation**: You can use `g` instead of `git`.



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
