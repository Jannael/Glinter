#!/usr/bin/env bun
import { addCommand } from './add/main'
import { switchCommand } from './switch/main'

const args = Bun.argv.slice(2)

if (args[0] === 'add' && !args[1]) await addCommand()
else if (args[0] === 'switch' && !args[1]) await switchCommand()
else {
	const proc = Bun.spawn(['git', ...args], {
		stdio: ['inherit', 'inherit', 'inherit'],
	})
	process.exit(await proc.exited)
}
