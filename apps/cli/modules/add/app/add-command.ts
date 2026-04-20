import { errorHandler } from '@/error/error-handler'
import type { GetChangesUseCase } from '@/modules/add/app/get-changes.use-case'
import type { StageChangesUseCase } from '@/modules/add/app/stage-changes.use-case'
import { BLUE, GREEN, MAGENTA, RED } from '@/utils/colors'
import { CHECK, WARNING } from '@/utils/icons-terminal'
import { MultiSelect } from '@/utils/multiselect'

export class AddCommand {
	constructor(
		private readonly getChangesUseCase: GetChangesUseCase,
		private readonly stageChangesUseCase: StageChangesUseCase,
	) {}

	async execute() {
		try {
			const { changes, warnings } = await this.getChangesUseCase.execute()

			if (changes.length === 0) {
				console.log(
					`${CHECK({ text: 'All changes are either staged or sensitive (like .env).' })}`,
				)
				return
			}

			// Add 'all' option at the top
			const options = [
				...changes.map((c) => ({ value: c.value, label: c.label })),
			]

			const selectedChanges = await MultiSelect({
				message:
					'Select the changes you want to commit. \n' +
					BLUE({ text: '[space] to select' }) +
					'\n' +
					GREEN({ text: '[enter] to confirm' }) +
					'\n' +
					MAGENTA({ text: '[a] to select all' }) +
					'\n' +
					RED({ text: '[esc] to cancel' }) +
					'\n',
				options,
			})

			let selected = (selectedChanges as string[]).map((file) => file.trim())

			if (selected.includes('all')) {
				selected = changes.map((c) => c.value) // Add all non-sensitive files
			}

			if (selected.length > 0) {
				await this.stageChangesUseCase.execute(selected)

				if (warnings.size > 0) {
					console.log(`\n${WARNING({ text: ' WARNING ' })}`)
					for (const warning of warnings) {
						console.log(warning)
					}
					console.log('')
				}
			}
		} catch (error) {
			errorHandler(error)
		}
	}
}
