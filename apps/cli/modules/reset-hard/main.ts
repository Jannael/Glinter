import { ResetHardCommand } from '@/modules/reset-hard/app/reset-hard-command'
import { BunResetHardRepository } from '@/modules/reset-hard/infra/bun-reset-hard.repository'

export async function resetHardCommand() {
	const resetHardRepository = new BunResetHardRepository()

	const resetHardCmd = new ResetHardCommand(resetHardRepository)

	await resetHardCmd.execute()
}
