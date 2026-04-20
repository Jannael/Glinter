import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { CommitUseCase } from '@/modules/commit/app/commit.use-case'
import { CommitCommand } from '@/modules/commit/app/commit-command'
import * as inputModule from '@/utils/input'
import * as selectModule from '@/utils/select'

const commitMockRepo = {
	commit: vi.fn(),
}

vi.mock('@/utils/select', () => ({
	Select: vi.fn(),
}))

vi.mock('@/utils/input', () => ({
	Input: vi.fn(),
}))

describe('CommitCommand', () => {
	const commitUseCase = new CommitUseCase(commitMockRepo)

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('execute commit use case', async () => {
		await commitUseCase.execute({ message: 'feat: add new flow' })

		expect(commitMockRepo.commit).toHaveBeenCalledWith('feat: add new flow')
	})

	it('execute commit command', async () => {
		const selectMock = selectModule.Select as unknown as Mock
		const inputMock = inputModule.Input as unknown as Mock
		selectMock.mockResolvedValue('feat')
		inputMock.mockResolvedValue('add commit prompt')

		const commitCommand = new CommitCommand(commitUseCase)
		await commitCommand.execute()

		expect(selectModule.Select).toHaveBeenCalled()
		expect(inputModule.Input).toHaveBeenCalled()
		expect(commitMockRepo.commit).toHaveBeenCalledWith(
			'feat: add commit prompt',
		)
	})
})
