import { errorHandler } from '@/error/error-handler'
import type { CommitUseCase } from '@/modules/commit/app/commit.use-case'
import { Input } from '@/utils/input'
import { Select } from '@/utils/select'

const commitTypeOptions = [
	{ value: 'feat', label: 'feat: A new feature' },
	{ value: 'fix', label: 'fix: A bug fix' },
	{ value: 'chore', label: 'chore: Routine maintenance' },
	{ value: 'docs', label: 'docs: Documentation updates' },
	{
		value: 'refactor',
		label: 'refactor: Code changes without behavior change',
	},
	{ value: 'test', label: 'test: Add or update tests' },
	{ value: 'perf', label: 'perf: Performance improvements' },
	{ value: 'style', label: 'style: Formatting or style-only changes' },
]

export class CommitCommand {
	constructor(private readonly commitUseCase: CommitUseCase) {}

	async execute() {
		try {
			const commitType = await Select({
				message: 'Select the commit type.',
				options: commitTypeOptions,
			})

			const commitDescription = await Input({
				message: 'Write your commit message.',
				placeholder: 'e.g. add interactive commit flow',
			})

			await this.commitUseCase.execute({
				message: `${commitType}: ${commitDescription}`,
			})
		} catch (error) {
			errorHandler(error)
		}
	}
}
