# Glinter ✨

Glinter is a high-performance, transparent Git wrapper built with **Bun**. It enhances the standard `git add` workflow with a beautiful, interactive CLI interface while acting as a seamless pass-through for all other Git commands.

https://github.com/user-attachments/assets/f488ac07-f36a-4a56-a533-9598c46596ed

## 🚀 What it does

Glinter's primary goal is to make staging changes more intuitive and safe:

- **Interactive `add`**: When you run `glinter add`, it presents a color-coded list of your modified, new, and deleted files. You can multi-select exactly what you want to stage using a GUI-like interface in your terminal.
- **Transparent Wrapper**: For every other command (like `commit`, `push`, `log`, or `status`), Glinter acts as a direct tunnel to Git. It preserves all original colors, formatting, and interactive features of the native Git CLI.
- **Visual Clarity**: Highly readable, color-coded status indicators (Yellow for modified, Green for new, Red for deleted).
- **Safe by Default**: Automatically filters and prevents accidental staging of sensitive files like `.env` (coming soon/optional).

## 🛠 How it works

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

## 📦 Installation

To use Glinter as your primary Git interface (e.g., using the command `g`):

1. **Clone the repo**
2. **Install dependencies**: `bun install`
3. **Link the binary**: `npm link` (or use `bun link`)

Now you can simply run:
```bash
g add      # Opens the interactive selector
g status   # Runs standard git status
g push     # Runs standard git push
```

## 🛡 .env Protection (Feature)

Glinter includes a built-in safety check that warns you or automatically excludes `.env` files from being staged when using the interactive selector, preventing sensitive credentials from ever reaching your repository.
