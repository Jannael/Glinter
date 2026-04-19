import * as p from '@clack/prompts'
import { errorHandler } from '../../../error/error-handler'
import { BLUE, GREEN, MAGENTA, YELLOW } from '../../../utils/colors'
import { CHECK } from '../../../utils/icons-terminal'
import { ALIASES } from '../domain/alias'
import type { SetupAliasesUseCase } from './setup-aliases.use-case'

export class SetupCommand {
	constructor(private readonly setupAliasesUseCase: SetupAliasesUseCase) {}

	async execute() {
		try {
			p.intro(MAGENTA({ text: ' Glinter Setup ' }))

			console.log(
				YELLOW({ text: '\nThe following aliases will be set globally:\n' }),
			)

			for (const alias of ALIASES) {
				const tag =
					alias.kind === 'glinter'
						? MAGENTA({ text: '[glinter]' })
						: BLUE({ text: '[git]    ' })
				console.log(
					`  ${tag}  ${GREEN({ text: alias.name.padEnd(8) })} → ${alias.command}`,
				)
			}

			console.log('')

			const confirmed = await p.confirm({
				message: 'Apply these aliases to your global git config?',
			})

			if (p.isCancel(confirmed) || !confirmed) {
				p.outro('Setup cancelled.')
				return
			}

			const spinner = p.spinner()
			spinner.start('Writing aliases...')

			const { total } = await this.setupAliasesUseCase.execute()

			spinner.stop(
				`${CHECK({ text: `${total} aliases configured successfully.` })}`,
			)
			p.outro(GREEN({ text: 'Glinter is ready! 🚀' }))
		} catch (error) {
			errorHandler(error)
		}
	}
}
