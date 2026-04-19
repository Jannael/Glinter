import { Change } from '@/modules/add/domain/change'
import type { GitRepository } from '@/modules/add/domain/git.repository'

export class GetChangesUseCase {
	constructor(private readonly gitRepository: GitRepository) {}

	async execute() {
		const entries = await this.gitRepository.getEntries()

		if (entries.length === 0) {
			return { changes: [], warnings: new Set<string>() }
		}

		const allChanges = Change.fromPorcelain(entries)

		const warnings = new Set<string>()
		const changes: Change[] = []

		for (const change of allChanges) {
			const warning = change.getWarning()
			if (warning) {
				warnings.add(warning)
			}

			if (!change.isSensitive()) {
				changes.push(change)
			}
		}

		return { changes, warnings }
	}
}
