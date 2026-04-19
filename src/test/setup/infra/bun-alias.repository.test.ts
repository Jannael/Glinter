import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BunAliasRepository } from '@/modules/setup/infra/bun-alias.repository'
import { BunAliasWindows } from '@/modules/setup/infra/bun-alias-windows'

describe('BunAliasRepository', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('delegates alias setup to windows adapter on windows', async () => {
		const repository = new BunAliasRepository()

		vi.spyOn(
			repository as unknown as { getOS: () => 'windows' | 'unix' },
			'getOS',
		).mockReturnValue('windows')

		const windowsSetAliasSpy = vi
			.spyOn(BunAliasWindows.prototype, 'setAlias')
			.mockResolvedValue(undefined)

		await repository.setAlias('ga', 'g add')

		expect(windowsSetAliasSpy).toHaveBeenCalledWith('ga', 'g add')
	})

	it('does not call windows adapter on unix', async () => {
		const repository = new BunAliasRepository()

		vi.spyOn(
			repository as unknown as { getOS: () => 'windows' | 'unix' },
			'getOS',
		).mockReturnValue('unix')

		const windowsSetAliasSpy = vi
			.spyOn(BunAliasWindows.prototype, 'setAlias')
			.mockResolvedValue(undefined)

		await repository.setAlias('ga', 'g add')

		expect(windowsSetAliasSpy).not.toHaveBeenCalled()
	})

	it('throws server error when windows adapter fails', async () => {
		const repository = new BunAliasRepository()

		vi.spyOn(
			repository as unknown as { getOS: () => 'windows' | 'unix' },
			'getOS',
		).mockReturnValue('windows')

		vi.spyOn(BunAliasWindows.prototype, 'setAlias').mockRejectedValue(
			new Error('boom'),
		)

		await expect(repository.setAlias('ga', 'g add')).rejects.toMatchObject({
			name: 'ServerError',
			message: 'Unexpected execution error',
			description: 'Failed to set alias: ga',
		})
	})
})
