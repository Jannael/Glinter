#!/usr/bin/env bun
import { addCommand } from './add/main'

const args = Bun.argv.slice(2)

if (args[0] === 'add' && !args[1]) await addCommand()
else {
	const proc = Bun.spawn(['git', ...args], {
		stdio: ['inherit', 'inherit', 'inherit'],
	})
	process.exit(await proc.exited)
}
