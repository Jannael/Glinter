import { AddCommand } from './app/add-command'
import { GetChangesUseCase } from './app/get-changes.use-case'
import { StageChangesUseCase } from './app/stage-changes.use-case'
import { BunGitRepository } from './infra/bun-git.repository'

export async function main() {
	// Instantiate Adapters
	const gitRepository = new BunGitRepository()

	// Instantiate Use Cases
	const getChangesUseCase = new GetChangesUseCase(gitRepository)
	const stageChangesUseCase = new StageChangesUseCase(gitRepository)

	// Instantiate Command
	const addCommand = new AddCommand(getChangesUseCase, stageChangesUseCase)

	// Execute
	await addCommand.execute()
}
