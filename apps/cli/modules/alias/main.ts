import { ALIASES } from '@/alias'
import { BLUE, GREEN, MAGENTA, YELLOW } from '@/utils/colors'

function resolveAlias(name: string, command: string) {
	return { name, value: command }
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
		const { name, value } = resolveAlias(alias.name, alias.command)

		console.log(
			`  ${tag}  ${GREEN({ text: name.padEnd(8) })} → ${value}`,
		)
	}

	console.log('')
}

export async function aliasCommand() {
	printAliases()
}
