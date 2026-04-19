import { GetBranchesUseCase } from '@/modules/switch/app/get-branches.use-case'
import { SwitchBranch } from '@/modules/switch/app/switch-branch.use-case'
import { SwitchCommand } from '@/modules/switch/app/switch-command'
import { BunSwitchRepository } from '@/modules/switch/infra/bun-switch-repository'

export async function switchCommand() {
	const switchRepo = new BunSwitchRepository()

	const switchBranchUseCase = new SwitchBranch(switchRepo)
	const getBranchesUseCase = new GetBranchesUseCase(switchRepo)

	const switchCommand = new SwitchCommand(
		getBranchesUseCase,
		switchBranchUseCase,
	)

	await switchCommand.execute()
}
