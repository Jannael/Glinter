import { $ } from 'bun'
import { ServerError } from '@/error/error-instance'
import type { GitRepository } from '@/modules/add/domain/git.repository'

export class BunGitRepository implements GitRepository {
	async getEntries() {
		try {
			// Use --porcelain -z for reliable machine-readable parsing (handles spaces/quotes)
			const output = await $`git status --porcelain -z`.quiet().text()

			if (!output.trim()) {
				return []
			}

			// Split by NUL character
			return output.split('\0').filter(Boolean)
		} catch {
			throw new ServerError(
				'Git status failed',
				'Could not retrieve repository status',
			)
		}
	}

	async stageFiles(files: string[]) {
		if (files.length === 0) return

		// Bun shell correctly escapes array elements
		const proc = Bun.spawn(['git', 'add', ...files], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new ServerError(
				'Git add failed',
				`Failed to stage ${files.length} file(s)`,
			)
		}
	}
}
