import { errorHandler } from '@/error/error-handler'
import type { ResetHardRepository } from '@/modules/reset-hard/domain/reset-hard.repository'
import type { GetCommitsUseCase } from '@/modules/reset-hard/app/get-commits.use-case'
import { CHECK, WARNING } from '@/utils/icons-terminal'
import { Select } from '@/utils/select'

const PREV_PAGE = '< Previous page'
const NEXT_PAGE = 'Next page >'

export class ResetHardCommand {
	constructor(
		private readonly getCommitsUseCase: GetCommitsUseCase,
		private readonly resetHardRepository: ResetHardRepository,
	) {}

	async execute() {
		try {
			let page = 0
			const pageSize = 10

			while (true) {
				const { commits, hasMore } = await this.getCommitsUseCase.execute({ page, pageSize })

				if (commits.length === 0) {
					console.log(`${WARNING({ text: 'No commits found.' })}`)
					return
				}

				const options: { value: string; label: string }[] = []

				if (page > 0) {
					options.push({ value: PREV_PAGE, label: PREV_PAGE })
				}

				for (const commit of commits) {
					options.push({
						value: commit.hash,
						label: `${commit.shortHash} ${commit.subject}`,
					})
				}

				if (hasMore) {
					options.push({ value: NEXT_PAGE, label: NEXT_PAGE })
				}

				const selected = await Select({
					message: 'Select the commit you want to reset to.',
					options,
				})

				if (selected === PREV_PAGE) {
					page -= 1
					continue
				}

				if (selected === NEXT_PAGE) {
					page += 1
					continue
				}

				await this.resetHardRepository.resetHard(selected)
				console.log(`${CHECK({ text: 'Successfully reset to ' + selected })}`)
				break
			}
		} catch (error) {
			errorHandler(error)
		}
	}
}
