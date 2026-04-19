import { $ } from 'bun'
import { ServerError } from '@/error/error-instance'
import type { SwitchRepository } from '@/modules/switch/domain/switch.repository'

export class BunSwitchRepository implements SwitchRepository {
	async getBranches() {
		try {
			const output = await $`git branch -a`.quiet().text()

			if (!output.trim()) {
				return []
			}

			return output.split('\n').map((branch) => branch.trim())
		} catch {
			throw new ServerError('Git branch failed', 'Could not retrieve branches')
		}
	}

	async switchBranch({ branch }: { branch: string }) {
		const proc = Bun.spawn(['git', 'checkout', branch], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new ServerError(
				'Git checkout failed',
				`Failed to switch to branch ${branch}`,
			)
		}
	}
}
