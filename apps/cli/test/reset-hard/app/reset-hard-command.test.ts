import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'
import { Commit } from '@/modules/reset-hard/domain/commit'
import { GetCommitsUseCase } from '@/modules/reset-hard/app/get-commits.use-case'
import { ResetHardCommand } from '@/modules/reset-hard/app/reset-hard-command'
import * as selectModule from '@/utils/select'

mock.module('@/utils/select', () => ({
	Select: mock(),
}))

const mockRepo = {
	getCommits: mock<(page: number, pageSize: number) => Promise<{ commits: Commit[]; hasMore: boolean }>>(),
	resetHard: mock<(hash: string) => Promise<void>>(),
}

describe('ResetHardCommand', () => {
	const getCommitsUseCase = new GetCommitsUseCase(mockRepo)
	const mockSelect = selectModule.Select as unknown as Mock<
		(opts: { message: string; options: { value: string; label: string }[] }) => Promise<string>
	>

	beforeEach(() => {
		mockRepo.getCommits.mockClear()
		mockRepo.resetHard.mockClear()
		mockSelect.mockClear()
	})

	it('selects a commit and resets to it', async () => {
		const commits = [new Commit({ hash: 'a'.repeat(40), subject: 'feat: test' })]
		mockRepo.getCommits.mockResolvedValue({ commits, hasMore: false })
		mockSelect.mockResolvedValue('a'.repeat(40))

		const cmd = new ResetHardCommand(getCommitsUseCase, mockRepo)
		await cmd.execute()

		expect(mockRepo.getCommits).toHaveBeenCalledTimes(1)
		expect(mockRepo.resetHard).toHaveBeenCalledWith('a'.repeat(40))
	})

	it('navigates to next page when selected', async () => {
		const page1 = Array.from({ length: 10 }, (_, i) => new Commit({ hash: `${i}`.padEnd(40, 'a'), subject: `commit ${i}` }))
		const page2 = [new Commit({ hash: 'b'.repeat(40), subject: 'commit 10' })]
		mockRepo.getCommits.mockResolvedValueOnce({ commits: page1, hasMore: true }).mockResolvedValueOnce({ commits: page2, hasMore: false })
		mockSelect.mockResolvedValueOnce('Next page >').mockResolvedValueOnce('b'.repeat(40))

		const cmd = new ResetHardCommand(getCommitsUseCase, mockRepo)
		await cmd.execute()

		expect(mockRepo.getCommits).toHaveBeenCalledTimes(2)
		expect(mockRepo.getCommits).toHaveBeenCalledWith(1, 10)
		expect(mockRepo.resetHard).toHaveBeenCalledWith('b'.repeat(40))
	})
})
