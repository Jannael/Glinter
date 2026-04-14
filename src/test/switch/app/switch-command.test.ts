import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GREEN, RESET } from '../../../packages/colors'
import * as selectModule from '../../../packages/select'
import { GetBranchesUseCase } from '../../../switch/app/get-branches.use-case'
import { SwitchBranch } from '../../../switch/app/switch-branch.use-case'
import { SwitchCommand } from '../../../switch/app/switch-command'

const mockBranches = ['* main', 'feature/new-feature', 'remotes/origin/main']

const BranchMockRepo = {
	getBranches: vi.fn(),
	switchBranch: vi.fn(),
}

vi.mock('../../../packages/select', () => ({
	Select: vi.fn(),
}))

describe('SwitchCommand', () => {
	const switchBranchUseCase = new SwitchBranch(BranchMockRepo)
	const getBranchesUseCase = new GetBranchesUseCase(BranchMockRepo)
	const mockSelect = vi.mocked(selectModule.Select)

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('execute get branches', async () => {
		BranchMockRepo.getBranches.mockResolvedValue(mockBranches)

		const branches = await getBranchesUseCase.execute()

		expect(BranchMockRepo.getBranches).toHaveBeenCalled()
		expect(branches).toHaveLength(3)
	})

	it('execute switch branch use case', async () => {
		BranchMockRepo.switchBranch.mockResolvedValue(undefined)

		await switchBranchUseCase.execute({ branch: 'main' })

		expect(BranchMockRepo.switchBranch).toHaveBeenCalled()
		expect(BranchMockRepo.switchBranch).toHaveBeenCalledWith({ branch: 'main' })
	})

	it('execute switch command', async () => {
		const switchCommand = new SwitchCommand(
			getBranchesUseCase,
			switchBranchUseCase,
		)

		BranchMockRepo.getBranches.mockResolvedValue(mockBranches)

		await switchCommand.execute()

		expect(mockSelect).toHaveBeenCalled()
		expect(mockSelect).toHaveBeenCalledWith({
			message: 'Select the branch you want to switch to.',
			options: [
				{ value: 'feature/new-feature', label: 'feature/new-feature' },
				{ value: 'main', label: `${GREEN}remote branch:${RESET} main` },
			],
		})
	})
})
