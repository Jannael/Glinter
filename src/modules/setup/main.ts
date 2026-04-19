import { SetupAliasesUseCase } from '@/modules/setup/app/setup-aliases.use-case'
import { SetupCommand } from '@/modules/setup/app/setup-command'
import { BunAliasRepository } from '@/modules/setup/infra/bun-alias.repository'

export async function setupCommand() {
	// Instantiate Adapters
	const aliasRepository = new BunAliasRepository()

	// Instantiate Use Cases
	const setupAliasesUseCase = new SetupAliasesUseCase(aliasRepository)

	// Instantiate Command
	const setupCommand = new SetupCommand(setupAliasesUseCase)

	// Execute
	await setupCommand.execute()
}
