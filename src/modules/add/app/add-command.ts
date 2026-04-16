import { NotFound, ServerError } from '../../../error/error-instance'
import { BLUE, GREEN, MAGENTA, RED } from '../../../utils/colors'
import { CHECK, WARNING, X } from '../../../utils/icons-terminal'
import { MultiSelect } from '../../../utils/multiselect'
import type { GetChangesUseCase } from './get-changes.use-case'
import type { StageChangesUseCase } from './stage-changes.use-case'

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
					BLUE({ text: '[space] to select and' }) +
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
			this.errorHandler(error)
		}
	}

	private errorHandler(error: unknown) {
		if (error instanceof ServerError) {
			console.error(X({ text: error.message }))
			if (error.description) {
				console.error(`  ${error.description}`)
			}
			return
		}
		if (error instanceof NotFound) {
			console.error(WARNING({ text: error.message }))
			return
		}
		// Unknown error — something truly unexpected
		console.error(X({ text: 'An unexpected error occurred' }))
		if (error instanceof Error) {
			console.error(`  ${error.message}`)
		}
	}
}
