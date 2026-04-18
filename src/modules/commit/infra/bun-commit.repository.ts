import { ServerError } from '../../../error/error-instance'
import type { CommitRepository } from '../domain/commit.repository'

export class BunCommitRepository implements CommitRepository {
	async commit(message: string) {
		const proc = Bun.spawn(['git', 'commit', '-m', message], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new ServerError(
				'Git commit failed',
				'Could not create commit from interactive prompt',
			)
		}
	}
}
