import { describe, expect, it, mock } from 'bun:test'
import { GetCommitsUseCase } from '@/modules/reset-hard/app/get-commits.use-case'
import { Commit } from '@/modules/reset-hard/domain/commit'

const mockRepo = {
	getCommits: mock(),
	resetHard: mock(),
}

describe('GetCommitsUseCase', () => {
	it('returns paginated commits from the repository', async () => {
		const useCase = new GetCommitsUseCase(mockRepo)
		const mockCommits = [new Commit({ hash: 'a'.repeat(40), subject: 'feat: initial commit' })]
		mockRepo.getCommits.mockResolvedValue({ commits: mockCommits, hasMore: false })

		const result = await useCase.execute({ page: 0, pageSize: 10 })

		expect(mockRepo.getCommits).toHaveBeenCalledWith(0, 10)
		expect(result.commits).toHaveLength(1)
		expect(result.hasMore).toBe(false)
	})

	it('passes page and pageSize correctly', async () => {
		const useCase = new GetCommitsUseCase(mockRepo)
		mockRepo.getCommits.mockResolvedValue({ commits: [], hasMore: false })

		await useCase.execute({ page: 2, pageSize: 5 })

		expect(mockRepo.getCommits).toHaveBeenCalledWith(2, 5)
	})
})
