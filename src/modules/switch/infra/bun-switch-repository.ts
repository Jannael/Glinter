import { $ } from 'bun'
import type { SwitchRepository } from '../domain/switch.repository'

export class BunSwitchRepository implements SwitchRepository {
	async getBranches() {
		const output = await $`git branch -a`.quiet().text()

		if (!output.trim()) {
			return []
		}

		return output.split('\n').map((branch) => branch.trim())
	}

	async switchBranch({ branch }: { branch: string }) {
		const proc = Bun.spawn(['git', 'checkout', branch], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (exitCode !== 0) {
			throw new Error(`Git checkout failed with exit code ${exitCode}`)
		}
	}
}
