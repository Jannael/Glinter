import type { GitRepository } from '../domain/git.repository'

export class StageChangesUseCase {
	constructor(private readonly gitRepository: GitRepository) {}

	async execute(files: string[]) {
		if (files.length === 0) return

		await this.gitRepository.stageFiles(files)
	}
}
