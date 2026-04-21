import { addCommand } from '@/modules/add/main'
import { aliasCommand } from '@/modules/alias/main'
import { commitCommand } from '@/modules/commit/main'
import { setupCommand } from '@/modules/setup/main'
import { switchCommand } from '@/modules/switch/main'

interface Command {
	name: string
	fn: () => Promise<void>
	allowGitArgs: boolean
}

export const AVAILABLE_COMMANDS: Command[] = [
	{
		name: 'add',
		fn: addCommand,
		allowGitArgs: true,
	},
	{
		name: 'commit',
		fn: commitCommand,
		allowGitArgs: true,
	},
	{
		name: 'switch',
		fn: switchCommand,
		allowGitArgs: true,
	},
	{
		name: 'alias',
		fn: aliasCommand,
		allowGitArgs: false,
	},
	{
		name: 'setup',
		fn: setupCommand,
		allowGitArgs: true,
	},
] as const
