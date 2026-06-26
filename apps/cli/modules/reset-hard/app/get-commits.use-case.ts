import type { Commit } from '@/modules/reset-hard/domain/commit'
import type { ResetHardRepository } from '@/modules/reset-hard/domain/reset-hard.repository'

export class GetCommitsUseCase {
	constructor(private readonly resetHardRepository: ResetHardRepository) {}

	async execute({ page, pageSize }: { page: number; pageSize: number }): Promise<{ commits: Commit[]; hasMore: boolean }> {
		return this.resetHardRepository.getCommits(page, pageSize)
	}
}
