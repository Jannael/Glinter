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
				'\x1b[32m✔\x1b[0m  All changes are either staged or sensitive (like .env).',
			)
			return
		}

		// Add 'all' option at the top
		const options = [
			{ value: 'all', label: '\x1b[1mall changes\x1b[0m' },
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
				console.log('\n\x1b[43m\x1b[30m WARNING \x1b[0m')
				for (const warning of warnings) {
					console.log(warning)
				}
				console.log('')
			}
		}
	}
}
