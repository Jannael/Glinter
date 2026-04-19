import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AddCommand } from '@/modules/add/app/add-command'
import { GetChangesUseCase } from '@/modules/add/app/get-changes.use-case'
import { StageChangesUseCase } from '@/modules/add/app/stage-changes.use-case'
import * as multiselectModule from '@/utils/multiselect'

const mockFiles = [' M bun.lock', ' A a.lock']

const mockGitRepo = {
	getEntries: () => Promise.resolve(mockFiles),
	stageFiles: vi.fn(),
}

vi.mock('@/utils/multiselect', () => ({
	MultiSelect: vi.fn(),
}))

describe('AddCommand', () => {
	const getChangesUseCase = new GetChangesUseCase(mockGitRepo)
	const stageChangesUseCase = new StageChangesUseCase(mockGitRepo)
	const mockMultiSelect = vi.mocked(multiselectModule.MultiSelect)

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('execute get changes', async () => {
		const { changes, warnings } = await getChangesUseCase.execute()

		expect(changes).toHaveLength(2)
		expect(warnings).toHaveLength(0)
	})

	it('execute stage changes', async () => {
		await stageChangesUseCase.execute(mockFiles)

		expect(mockGitRepo.stageFiles).toHaveBeenCalledWith(mockFiles)
	})

	it('execute add command', async () => {
		mockMultiSelect.mockResolvedValue(['all'])

		const addCommand = new AddCommand(getChangesUseCase, stageChangesUseCase)
		await addCommand.execute()

		expect(mockMultiSelect).toHaveBeenCalled()
	})
})
