import { ALIASES } from '@/alias'
import { BLUE, GREEN, MAGENTA, YELLOW } from '@/utils/colors'

function resolveAlias(name: string, command: string, kind: 'git' | 'glinter') {
	const aliasName = `g${name}`
	const aliasCommand = kind === 'git' ? `git ${command}` : `g ${command}`
	return { aliasName, aliasCommand }
}

export function printAliases({
	title = 'The following aliases are configured by setup:',
}: {
	title?: string
} = {}) {
	console.log(YELLOW({ text: `\n${title}\n` }))

	for (const alias of ALIASES) {
		const tag =
			alias.kind === 'glinter'
				? MAGENTA({ text: '[glinter]' })
				: BLUE({ text: '[git]    ' })
		const { aliasName, aliasCommand } = resolveAlias(
			alias.name,
			alias.command,
			alias.kind,
		)

		console.log(
			`  ${tag}  ${GREEN({ text: aliasName.padEnd(8) })} → ${aliasCommand}`,
		)
	}

	console.log('')
}

export async function aliasCommand() {
	printAliases()
}
