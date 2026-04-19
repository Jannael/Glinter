import { SetupAliasesUseCase } from './app/setup-aliases.use-case'
import { SetupCommand } from './app/setup-command'
import { BunAliasRepository } from './infra/bun-alias.repository'

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
