#!/usr/bin/env bun
import { AVAILABLE_COMMANDS } from '@/commands'
import { COMMANDS_FN } from '@/commands-fn'

const args = Bun.argv.slice(2)

const command = AVAILABLE_COMMANDS.find((command) => command.name === args[0])

if (command && args.length === 1) {
	await COMMANDS_FN[command.name]?.(args.slice(1))
} else {
	const proc = Bun.spawn(['git', ...args], {
		stdio: ['inherit', 'inherit', 'inherit'],
	})
	process.exit(await proc.exited)
}
