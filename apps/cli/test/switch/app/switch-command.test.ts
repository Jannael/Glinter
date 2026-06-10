import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { GetBranchesUseCase } from '@/modules/switch/app/get-branches.use-case'
import { SwitchBranch } from '@/modules/switch/app/switch-branch.use-case'
import { SwitchCommand } from '@/modules/switch/app/switch-command'
import { GREEN } from '@/utils/colors'
import * as selectModule from '@/utils/select'

mock.module('@/utils/select', () => ({
	Select: mock(),
}))

const mockBranches = ['* main', 'feature/new-feature', 'remotes/origin/main']

const BranchMockRepo = {
	getBranches: mock(),
	switchBranch: mock(),
}

describe('SwitchCommand', () => {
	const switchBranchUseCase = new SwitchBranch(BranchMockRepo)
	const getBranchesUseCase = new GetBranchesUseCase(BranchMockRepo)
	const mockSelect = selectModule.Select

	beforeEach(() => {
		BranchMockRepo.getBranches.mockClear()
		BranchMockRepo.switchBranch.mockClear()
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
		const switchCommand = new SwitchCommand(getBranchesUseCase, switchBranchUseCase)

		BranchMockRepo.getBranches.mockResolvedValue(mockBranches)

		await switchCommand.execute()

		expect(mockSelect).toHaveBeenCalled()
		expect(mockSelect).toHaveBeenCalledWith({
			message: 'Select the branch you want to switch to.',
			options: [
				{ value: 'feature/new-feature', label: 'feature/new-feature' },
				{ value: 'main', label: `${GREEN({ text: 'remote branch: ' })}main` },
			],
		})
	})
})
