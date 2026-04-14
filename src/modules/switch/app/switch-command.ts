import { CHECK } from '../../../utils/check'
import { GREEN, RESET } from '../../../utils/colors'
import { Select } from '../../../utils/select'
import type { GetBranchesUseCase } from './get-branches.use-case'
import type { SwitchBranch } from './switch-branch.use-case'

export class SwitchCommand {
	constructor(
		private readonly getBranchesUseCase: GetBranchesUseCase,
		private readonly switchBranch: SwitchBranch,
	) {}

	async execute() {
		const branches = await this.getBranchesUseCase.execute()

		if (branches.length === 0) {
			console.log(`${CHECK}  No branches found.`)
			return
		}

		const options: { value: string; label: string }[] = []
		for (const branch of branches) {
			let label = branch.name
			let value = branch.name

			if (branch.isHeadBranch) continue

			if (branch.isCurrentBranch) {
				console.log(`${CHECK}  Current branch: ${branch.name}`)
				continue
			}

			if (branch.isRemoteBranch) {
				label = branch.name.replace(
					'remotes/origin/',
					`${GREEN}remote branch:${RESET} `,
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
	}
}
