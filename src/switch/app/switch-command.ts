import { Select } from '../../packages/select'
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
			console.log(
				'\x1b[32m✔\x1b[0m  No branches found.',
			)
			return
		}

		const selectedBranch = await Select({
			message: 'Select the branch you want to switch to.',
			options: branches.map((branch) => ({ value: branch, label: branch })),
		})

		await this.switchBranch.execute({ branch: selectedBranch })
	}
}