import { CommitUseCase } from '@/modules/commit/app/commit.use-case'
import { CommitCommand } from '@/modules/commit/app/commit-command'
import { BunCommitRepository } from '@/modules/commit/infra/bun-commit.repository'

export async function commitCommand() {
	const commitRepository = new BunCommitRepository()

	const commitUseCase = new CommitUseCase(commitRepository)

	const commitCommand = new CommitCommand(commitUseCase)

	await commitCommand.execute()
}
