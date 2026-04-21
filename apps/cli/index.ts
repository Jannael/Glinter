#!/usr/bin/env bun
import { AVAILABLE_COMMANDS } from './commands'

const args = Bun.argv.slice(2)

const command = AVAILABLE_COMMANDS.find((command) => command.name === args[0])

if (command) {
	if (command.allowGitArgs) {
		await command.fn()
	} else {
		if (args.length > 1) {
			console.error('This command does not accept any arguments')
			process.exit(1)
		}
		await command.fn()
	}
} else {
	const proc = Bun.spawn(['git', ...args], {
		stdio: ['inherit', 'inherit', 'inherit'],
	})
	process.exit(await proc.exited)
}
