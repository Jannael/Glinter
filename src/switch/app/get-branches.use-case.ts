import type { SwitchRepository } from '../domain/switch.repository'

export class GetBranchesUseCase {
	constructor(private readonly branchRepository: SwitchRepository) {}

	async execute() {
		return await this.branchRepository.getBranches()
	}
}
