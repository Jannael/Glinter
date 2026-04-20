type AliasKind = 'git' | 'glinter'

export interface Alias {
	name: string
	command: string
	kind: AliasKind
}

export const ALIASES: Alias[] = [
	// Status & logs
	{ name: 'gs', command: 'status -sb', kind: 'git' },
	{
		name: 'gl',
		command: 'log --oneline --decorate --graph --all -n 20',
		kind: 'git',
	},
	{ name: 'gll', command: 'log --stat', kind: 'git' },

	// Diff
	{ name: 'gd', command: 'diff --word-diff=color', kind: 'git' },
	{ name: 'gds', command: 'diff --staged --word-diff=color', kind: 'git' },

	// Add (Glinter interactive)
	{ name: 'ga', command: 'add', kind: 'glinter' },
	{ name: 'gaa', command: 'add -A', kind: 'git' },

	// Commit (Glinter interactive)
	{ name: 'gc', command: 'commit', kind: 'glinter' },
	{ name: 'gcm', command: 'commit -m', kind: 'git' },
	{ name: 'gca', command: 'commit --amend', kind: 'git' },
	{ name: 'gcan', command: 'commit --amend --no-edit', kind: 'git' },

	// Branch & switch
	{ name: 'gb', command: 'branch', kind: 'git' },
	{ name: 'gba', command: 'branch -a', kind: 'git' },
	{ name: 'gco', command: 'switch', kind: 'glinter' },
	{ name: 'gcb', command: 'checkout -b', kind: 'git' },

	// Pull & push
	{ name: 'gpl', command: 'pull', kind: 'git' },
	{ name: 'gplr', command: 'pull --rebase', kind: 'git' },
	{ name: 'gp', command: 'push', kind: 'git' },
	{ name: 'ggpush', command: 'push origin HEAD', kind: 'git' },
	{ name: 'gpf', command: 'push --force-with-lease', kind: 'git' },

	// Stash
	{ name: 'gst', command: 'stash', kind: 'git' },
	{ name: 'gstp', command: 'stash pop', kind: 'git' },
	{ name: 'gstl', command: 'stash list', kind: 'git' },

	// Cleanup
	{ name: 'gcl', command: 'clean -fd', kind: 'git' },
	{ name: 'grh', command: 'reset --hard', kind: 'git' },
]
