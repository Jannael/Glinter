import { $ } from 'bun'
import { ServerError } from '@/error/error-instance'
import { Commit } from '@/modules/reset-hard/domain/commit'
import type { ResetHardRepository } from '@/modules/reset-hard/domain/reset-hard.repository'

export class BunResetHardRepository implements ResetHardRepository {
	async getCommits(page: number, pageSize: number) {
		try {
			const skip = page * pageSize
			const output = await $`git --no-pager log -n ${pageSize + 1} --skip=${skip} --format="%H %s"`.quiet().text()

			const allCommits = Commit.fromGitLog(output)
			const hasMore = allCommits.length > pageSize
			const commits = hasMore ? allCommits.slice(0, pageSize) : allCommits

			return { commits, hasMore }
		} catch {
			throw new ServerError('Git log failed', 'Could not retrieve commits')
		}
	}

	async resetHard(hash: string) {
		const proc = Bun.spawn(['git', 'reset', '--hard', hash], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new ServerError('Git reset failed', `Failed to reset to commit ${hash}`)
		}
	}
}
