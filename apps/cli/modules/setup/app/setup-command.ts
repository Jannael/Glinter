import { errorHandler } from '@/error/error-handler'
import { printAliases } from '@/modules/alias/main'
import type { SetupAliasesUseCase } from '@/modules/setup/app/setup-aliases.use-case'
import { GREEN, MAGENTA } from '@/utils/colors'
import { Confirm } from '@/utils/confirm'
import { CHECK } from '@/utils/icons-terminal'
import { Intro } from '@/utils/intro'
import { Outro } from '@/utils/outro'
import { Spinner } from '@/utils/spinner'

export class SetupCommand {
	constructor(private readonly setupAliasesUseCase: SetupAliasesUseCase) {}

	async execute() {
		try {
			Intro(MAGENTA({ text: ' Glinter Setup ' }))

			printAliases({ title: 'The following aliases will be set globally:' })

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
