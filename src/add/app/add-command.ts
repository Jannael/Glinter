import { CHECK } from '../../packages/check'
import { BG_YELLOW, BLACK, BOLD, RESET } from '../../packages/colors'
import { MultiSelect } from '../../packages/multiselect'
import type { GetChangesUseCase } from './get-changes.use-case'
import type { StageChangesUseCase } from './stage-changes.use-case'

export class AddCommand {
	constructor(
		private readonly getChangesUseCase: GetChangesUseCase,
		private readonly stageChangesUseCase: StageChangesUseCase,
	) {}

	async execute() {
		const { changes, warnings } = await this.getChangesUseCase.execute()

		if (changes.length === 0) {
			console.log(
				`${CHECK}  All changes are either staged or sensitive (like .env).`,
			)
			return
		}

		// Add 'all' option at the top
		const options = [
			{ value: 'all', label: `${BOLD}all changes${RESET}` },
			...changes.map((c) => ({ value: c.value, label: c.label })),
		]

		const selectedChanges = await MultiSelect({
			message:
				'Select the changes you want to commit. (select with space and confirm with enter)',
			options,
		})

		let selected = (selectedChanges as string[]).map((file) => file.trim())

		if (selected.includes('all')) {
			selected = changes.map((c) => c.value) // Add all non-sensitive files
		}

		if (selected.length > 0) {
			await this.stageChangesUseCase.execute(selected)

			if (warnings.size > 0) {
				console.log(`\n${BG_YELLOW}${BLACK} WARNING ${RESET}`)
				for (const warning of warnings) {
					console.log(warning)
				}
				console.log('')
			}
		}
	}
}
