import { errorHandler } from '../../../error/error-handler'
import { BLUE, GREEN, MAGENTA, YELLOW } from '../../../utils/colors'
import { Confirm } from '../../../utils/confirm'
import { CHECK } from '../../../utils/icons-terminal'
import { Intro } from '../../../utils/intro'
import { Outro } from '../../../utils/outro'
import { Spinner } from '../../../utils/spinner'
import { ALIASES } from '../domain/alias'
import type { SetupAliasesUseCase } from './setup-aliases.use-case'

export class SetupCommand {
	constructor(private readonly setupAliasesUseCase: SetupAliasesUseCase) {}

	async execute() {
		try {
			Intro(MAGENTA({ text: ' Glinter Setup ' }))

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

			const confirmed = await Confirm({
				message: 'Apply these aliases to your global git config?',
				exitOnCancel: false,
			})

			if (!confirmed) {
				Outro('Setup cancelled.')
				return
			}

			const spinner = Spinner()
			spinner.start('Writing aliases...')

			const { total } = await this.setupAliasesUseCase.execute()

			console.log('')
			spinner.stop(
				`${CHECK({ text: `${total} aliases configured successfully.` })}`,
			)

			Outro(
				`${GREEN({ text: 'GLINTER' })}, if you like the project, give a star on github: https://github.com/jannael/glinter`,
			)

			console.log('')
			console.log(
				MAGENTA({ text: 'To use the aliases, please restart your terminal.' }),
			)
		} catch (error) {
			errorHandler(error)
		}
	}
}
