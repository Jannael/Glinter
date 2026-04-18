# Glinter Diff Module - Functional Spec

## Goal
Implement `g diff` as an interactive experience that feels consistent with existing modules:
- `g add` -> interactive `git status` + staging
- `g switch` -> interactive `git branch` + checkout
- `g diff` -> interactive diff context selector + target selector + execution

At the same time, preserve Git transparency:
- `g diff` (no extra args): interactive mode
- `g diff ...args`: pass-through to native `git diff ...args`

---

## UX Principles
1. **Start simple**: ask for *what to diff* first (context), not flags.
2. **Keep Git-native output**: always render final diff via native git in inherited stdio.
3. **Fast path first**: unstaged/staged/file diff should be one or two prompts max.
4. **Advanced paths available**: branch and commit comparisons remain first-class.

---

## Interactive Flow (`g diff`)

### Step 1 - Select diff context
Show a `Select` menu:

1. **Unstaged changes**
2. **Staged changes**
3. **Specific files**
4. **Branch vs branch**
5. **Commit vs commit**
6. **Commit vs parent** (quick review for one commit)

### Step 2 - Ask only required follow-up prompts

#### A) Unstaged changes
- Command: `git diff`

#### B) Staged changes
- Command: `git diff --cached`

#### C) Specific files
- Source list comes from the same porcelain parsing idea as `add` (`git status --porcelain -z`)
- Multi-select changed files
- Optional sub-context prompt:
  - Unstaged file diff -> `git diff -- <files...>`
  - Staged file diff -> `git diff --cached -- <files...>`

#### D) Branch vs branch
- Select base branch
- Select compare branch
- Command: `git diff <base>..<compare>`

#### E) Commit vs commit
- Select first commit
- Select second commit
- Command: `git diff <commitA>..<commitB>`

#### F) Commit vs parent
- Select one commit
- Command: `git show <commit>`
  - Alternative equivalent: `git diff <commit>^!`

---

## Output and Execution
- Before running, show a small preview line:
  - `Running: git diff ...`
- Execute with `Bun.spawn(['git', ...args], { stdio: ['inherit','inherit','inherit'] })`
- Do not re-render or reinterpret patch output in Glinter.
- Let Git own colors, pager, and formatting.

---

## Optional View Modes (v1.1)
After core flow, optional secondary prompt:
- **Patch (default)**: standard diff output
- **Names only**: `--name-only`
- **Stats**: `--stat`

Applied as command modifiers to selected context.

---

## Data Sources

### Changed files list
- Reuse `add` strategy:
  - `git status --porcelain -z`
  - NUL-split entries for robust filename handling
- Reuse `Change.fromPorcelain()` behavior so file handling is consistent across modules.

### Branch list
- Reuse switch-style source:
  - `git branch -a`
- Parse into domain entity (same style as `Branch.fromGitBranch`).

### Commit list
- Suggested source for UX-friendly picker:
  - `git log --oneline -n 30`
- Value: SHA
- Label: `SHA message`

---

## Architecture (same pattern as existing modules)
Create a new vertical slice:

`src/modules/diff/`
- `domain/`
  - `diff.repository.ts` (port)
  - entities/value objects for selectable targets (`DiffContext`, `RefOption`, etc.)
- `app/`
  - `diff-command.ts` (orchestrates prompt flow)
  - use-cases:
    - `get-file-changes.use-case.ts`
    - `get-branches.use-case.ts`
    - `get-commits.use-case.ts`
    - `build-diff-command.use-case.ts`
    - `run-diff.use-case.ts`
- `infra/`
  - `bun-diff.repository.ts` (Git command access + final execution)
- `main.ts`
  - composition root for `diffCommand()`

Wire entrypoint in `src/index.ts`:
- `if (args[0] === 'diff' && !args[1]) await diffCommand()`
- else keep passthrough behavior.

---

## Prompt Components
- Use existing wrappers only:
  - `src/utils/select.ts`
  - `src/utils/multiselect.ts`
- Preserve existing cancel behavior:
  - `cancel('Operation cancelled.')`
  - `process.exit(0)`

---

## Error Handling
- Follow same error strategy:
  - throw typed errors in infra (`ServerError`, `NotFound`, etc.)
  - surface through centralized `errorHandler(...)`
- Typical errors:
  - no commits/branches/files available for selected context
  - git command execution failure

---

## Scope Recommendation

### MVP (recommended first implementation)
1. Unstaged
2. Staged
3. Specific files (unstaged/staged selection)
4. Branch vs branch
5. Keep `g diff ...args` passthrough

### Next iteration
1. Commit vs commit
2. Commit vs parent
3. View modes (`--name-only`, `--stat`)

This keeps delivery fast while giving immediate value in daily workflows.
