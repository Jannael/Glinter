import type { SwitchRepository } from '@/modules/switch/domain/switch.repository'

export class SwitchBranch {
	constructor(private readonly branchRepository: SwitchRepository) {}

	async execute({ branch }: { branch: string }) {
		await this.branchRepository.switchBranch({ branch })
	}
}
