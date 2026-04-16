import { errorHandler } from '../../../error/error-handler'
import { GREEN } from '../../../utils/colors'
import { CHECK } from '../../../utils/icons-terminal'
import { Select } from '../../../utils/select'
import type { GetBranchesUseCase } from './get-branches.use-case'
import type { SwitchBranch } from './switch-branch.use-case'

export class SwitchCommand {
	constructor(
		private readonly getBranchesUseCase: GetBranchesUseCase,
		private readonly switchBranch: SwitchBranch,
	) {}

	async execute() {
		try {
			const branches = await this.getBranchesUseCase.execute()

			if (branches.length === 0) {
				console.log(`${CHECK({ text: 'No branches found.' })}`)
				return
			}

			const options: { value: string; label: string }[] = []
			for (const branch of branches) {
				let label = branch.name
				let value = branch.name

				if (branch.isHeadBranch) continue

				if (branch.isCurrentBranch) {
					console.log(`${CHECK({ text: `Current branch: ${branch.name}` })}`)
					continue
				}

				if (branch.isRemoteBranch) {
					label = branch.name.replace(
						'remotes/origin/',
						GREEN({ text: 'remote branch: ' }),
					)
					value = branch.name.replace('remotes/origin/', '')
				}

				options.push({
					value,
					label,
				})
			}

			const selectedBranch = await Select({
				message: 'Select the branch you want to switch to.',
				options,
			})

			await this.switchBranch.execute({ branch: selectedBranch })
		} catch (error) {
			errorHandler(error)
		}
	}
}
