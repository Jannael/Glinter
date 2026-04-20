import { commitTypeOptions } from '@/commit-options'
import { errorHandler } from '@/error/error-handler'
import type { CommitUseCase } from '@/modules/commit/app/commit.use-case'
import { Input } from '@/utils/input'
import { Select } from '@/utils/select'

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
