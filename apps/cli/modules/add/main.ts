import { AddCommand } from '@/modules/add/app/add-command'
import { GetChangesUseCase } from '@/modules/add/app/get-changes.use-case'
import { StageChangesUseCase } from '@/modules/add/app/stage-changes.use-case'
import { BunGitRepository } from '@/modules/add/infra/bun-git.repository'

export async function addCommand() {
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
