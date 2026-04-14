import { describe, expect, it } from 'vitest'
import { Branch } from '../../../modules/switch/domain/branch'

describe('Branch', () => {
	it('create a branch', () => {
		const branch = new Branch({ name: 'main', current: false, remote: false })
		expect(branch).toBeInstanceOf(Branch)
		expect(branch.name).toBe('main')
		expect(branch.isCurrentBranch).toBe(false)
		expect(branch.isRemoteBranch).toBe(false)
	})

	it('create a branch from git branch', () => {
		const branches = Branch.fromGitBranch(['main', 'master'])
		expect(branches).toHaveLength(2)
		expect(branches[0]).toBeInstanceOf(Branch)
		expect(branches[1]).toBeInstanceOf(Branch)
		expect(branches[0]?.name).toBe('main')
		expect(branches[1]?.name).toBe('master')
		expect(branches[0]?.isCurrentBranch).toBe(false)
		expect(branches[1]?.isCurrentBranch).toBe(false)
		expect(branches[0]?.isRemoteBranch).toBe(false)
		expect(branches[1]?.isRemoteBranch).toBe(false)
	})
})
