export const AVAILABLE_COMMANDS = [
	{
		name: 'add',
		command: 'g add',
		description: 'Interactive add',
	},
	{
		name: 'commit',
		command: 'g commit',
		description: 'Interactive commit',
	},
	{
		name: 'switch',
		command: 'g switch',
		description: 'Interactive switch',
	},
	{
		name: 'alias',
		command: 'g alias',
		description: 'Show all the aliases',
	},
	{
		name: 'setup',
		command: 'g setup',
		description: 'Setup alias for git and glinter',
	},
] as const

export type CommandNames = (typeof AVAILABLE_COMMANDS)[number]['name']