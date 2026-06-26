import type { CommandNames } from '@/commands'
import { addCommand } from '@/modules/add/main'
import { aliasCommand } from '@/modules/alias/main'
import { commitCommand } from '@/modules/commit/main'
import { resetHardCommand } from '@/modules/reset-hard/main'
import { setupCommand } from '@/modules/setup/main'
import { switchCommand } from '@/modules/switch/main'

type CommandHandler = (args: string[]) => Promise<void>

export const COMMANDS_FN: Record<CommandNames, CommandHandler> = {
	add: addCommand,
	commit: commitCommand,
	switch: switchCommand,
	alias: aliasCommand,
	setup: setupCommand,
	'reset-hard': resetHardCommand,
} as const
