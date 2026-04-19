#!/usr/bin/env bun
import { addCommand } from './modules/add/main'
import { commitCommand } from './modules/commit/main'
import { setupCommand } from './modules/setup/main'
import { switchCommand } from './modules/switch/main'

const args = Bun.argv.slice(2)

if (args[0] === 'add' && !args[1]) await addCommand()
else if (args[0] === 'commit' && !args[1]) await commitCommand()
else if (args[0] === 'switch' && !args[1]) await switchCommand()
else if (args[0] === 'setup') await setupCommand()
else {
	const proc = Bun.spawn(['git', ...args], {
		stdio: ['inherit', 'inherit', 'inherit'],
	})
	process.exit(await proc.exited)
}
