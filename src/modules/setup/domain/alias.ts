type AliasKind = 'git' | 'glinter'

export interface Alias {
	name: string
	command: string
	kind: AliasKind
}

export const ALIASES: Alias[] = [
	// Status & logs
	{ name: 's', command: 'status -sb', kind: 'git' },
	{
		name: 'l',
		command: 'log --oneline --decorate --graph --all -n 20',
		kind: 'git',
	},
	{ name: 'll', command: 'log --stat', kind: 'git' },

	// Diff
	{ name: 'd', command: 'diff', kind: 'git' },
	{ name: 'ds', command: 'diff --staged', kind: 'git' },

	// Add (Glinter interactive)
	{ name: 'a', command: 'add', kind: 'glinter' },
	{ name: 'aa', command: 'add -A', kind: 'git' },

	// Commit (Glinter interactive)
	{ name: 'c', command: 'commit', kind: 'glinter' },
	{ name: 'cm', command: 'commit -m', kind: 'git' },
	{ name: 'ca', command: 'commit --amend', kind: 'git' },
	{ name: 'can', command: 'commit --amend --no-edit', kind: 'git' },

	// Branch & switch
	{ name: 'b', command: 'branch', kind: 'git' },
	{ name: 'ba', command: 'branch -a', kind: 'git' },
	{ name: 'co', command: 'switch', kind: 'glinter' },
	{ name: 'cb', command: 'checkout -b', kind: 'git' },

	// Pull & push
	{ name: 'pl', command: 'pull', kind: 'git' },
	{ name: 'plr', command: 'pull --rebase', kind: 'git' },
	{ name: 'p', command: 'push', kind: 'git' },
	{ name: 'ggpush', command: 'push origin HEAD', kind: 'git' },
	{ name: 'pf', command: 'push --force-with-lease', kind: 'git' },

	// Stash
	{ name: 'st', command: 'stash', kind: 'git' },
	{ name: 'stp', command: 'stash pop', kind: 'git' },
	{ name: 'stl', command: 'stash list', kind: 'git' },

	// Cleanup
	{ name: 'cl', command: 'clean -fd', kind: 'git' },
	{ name: 'rh', command: 'reset --hard', kind: 'git' },
]
