import { Branch } from '../domain/branch'
import type { SwitchRepository } from '../domain/switch.repository'

export class GetBranchesUseCase {
	constructor(private readonly branchRepository: SwitchRepository) {}

	async execute() {
		const branches = await this.branchRepository.getBranches()
		const allBranches = Branch.fromGitBranch(branches)

		return allBranches
	}
}
