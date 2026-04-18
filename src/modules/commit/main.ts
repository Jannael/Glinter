import { CommitUseCase } from './app/commit.use-case'
import { CommitCommand } from './app/commit-command'
import { BunCommitRepository } from './infra/bun-commit.repository'

export async function commitCommand() {
	const commitRepository = new BunCommitRepository()

	const commitUseCase = new CommitUseCase(commitRepository)

	const commitCommand = new CommitCommand(commitUseCase)

	await commitCommand.execute()
}
