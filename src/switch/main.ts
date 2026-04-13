import { GetBranchesUseCase } from './app/get-branches.use-case'
import { SwitchBranch } from './app/switch-branch.use-case'
import { SwitchCommand } from './app/switch-command'
import { BunSwitchRepository } from './infra/bun-switch-repository'

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
