import type { SwitchRepository } from '../domain/switch.repository'

export class SwitchBranch {
	constructor(private readonly branchRepository: SwitchRepository) {}

	async execute({ branch }: { branch: string }) {
		await this.branchRepository.switchBranch({ branch })
	}
}
