import { $ } from 'bun'
import type { GitRepository } from '../domain/git.repository'

export class BunGitRepository implements GitRepository {
	async getEntries() {
		// Use --porcelain -z for reliable machine-readable parsing (handles spaces/quotes)
		const output = await $`git status --porcelain -z`.quiet().text()

		if (!output.trim()) {
			return []
		}

		// Split by NUL character
		return output.split('\0').filter(Boolean)
	}

	async stageFiles(files: string[]) {
		if (files.length === 0) return

		// Bun shell correctly escapes array elements
		const proc = Bun.spawn(['git', 'add', ...files], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new Error(`Git add failed with exit code ${exitCode}`)
		}
	}
}
