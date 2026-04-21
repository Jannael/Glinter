export const AVAILABLE_COMMANDS = [
	{
		name: 'add',
		command: 'g add',
		description: 'Interactive add',
		allowGitArgs: true,
	},
	{
		name: 'commit',
		command: 'g commit',
		description: 'Interactive commit',
		allowGitArgs: true,
	},
	{
		name: 'switch',
		command: 'g switch',
		description: 'Interactive switch',
		allowGitArgs: true,
	},
	{
		name: 'alias',
		command: 'g alias',
		description: 'Show all the aliases',
		allowGitArgs: false,
	},
	{
		name: 'setup',
		command: 'g setup',
		description: 'Setup alias for git and glinter',
		allowGitArgs: true,
	},
] as const

export type CommandNames = (typeof AVAILABLE_COMMANDS)[number]['name']