import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test'
type MockFn = Mock<(...args: unknown[]) => Promise<unknown>>
import { CommitUseCase } from '@/modules/commit/app/commit.use-case'
import { CommitCommand } from '@/modules/commit/app/commit-command'
import * as inputModule from '@/utils/input'
import * as selectModule from '@/utils/select'

mock.module('@/utils/select', () => ({
	Select: mock(),
}))

mock.module('@/utils/input', () => ({
	Input: mock(),
}))

const commitMockRepo = {
	commit: mock(),
}

describe('CommitCommand', () => {
	const commitUseCase = new CommitUseCase(commitMockRepo)

	beforeEach(() => {
		commitMockRepo.commit.mockClear()
	})

	it('execute commit use case', async () => {
		await commitUseCase.execute({ message: 'feat: add new flow' })

		expect(commitMockRepo.commit).toHaveBeenCalledWith('feat: add new flow')
	})

	it('execute commit command', async () => {
		const selectMock = selectModule.Select as unknown as MockFn
		const inputMock = inputModule.Input as unknown as MockFn
		selectMock.mockResolvedValue('feat')
		inputMock.mockResolvedValue('add commit prompt')

		const commitCommand = new CommitCommand(commitUseCase)
		await commitCommand.execute()

		expect(selectModule.Select).toHaveBeenCalled()
		expect(inputModule.Input).toHaveBeenCalled()
		expect(commitMockRepo.commit).toHaveBeenCalledWith('feat: add commit prompt')
	})
})
