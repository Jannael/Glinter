import { GetCommitsUseCase } from '@/modules/reset-hard/app/get-commits.use-case'
import { ResetHardCommand } from '@/modules/reset-hard/app/reset-hard-command'
import { BunResetHardRepository } from '@/modules/reset-hard/infra/bun-reset-hard.repository'

export async function resetHardCommand() {
	const resetHardRepository = new BunResetHardRepository()

	const getCommitsUseCase = new GetCommitsUseCase(resetHardRepository)

	const resetHardCmd = new ResetHardCommand(getCommitsUseCase, resetHardRepository)

	await resetHardCmd.execute()
}
