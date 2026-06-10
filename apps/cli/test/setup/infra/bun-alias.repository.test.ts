import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { BunAliasRepository } from '@/modules/setup/infra/bun-alias.repository'
import { BunAliasUnix } from '@/modules/setup/infra/bun-alias-unix'
import { BunAliasWindows } from '@/modules/setup/infra/bun-alias-windows'

describe('BunAliasRepository', () => {
	beforeEach(() => {
		mock.restore()
	})

	it('delegates alias setup to windows adapter on windows', async () => {
		const repository = new BunAliasRepository()

		spyOn(repository as unknown as { getOS: () => 'windows' | 'unix' }, 'getOS').mockReturnValue('windows')

		const windowsSetAliasSpy = spyOn(BunAliasWindows.prototype, 'setAlias').mockResolvedValue(undefined)

		await repository.setAlias('ga', 'g add')

		expect(windowsSetAliasSpy).toHaveBeenCalledWith('ga', 'g add')
	})

	it('delegates alias setup to unix adapter on unix', async () => {
		const repository = new BunAliasRepository()

		spyOn(repository as unknown as { getOS: () => 'windows' | 'unix' }, 'getOS').mockReturnValue('unix')

		const windowsSetAliasSpy = spyOn(BunAliasWindows.prototype, 'setAlias').mockResolvedValue(undefined)
		const unixSetAliasSpy = spyOn(BunAliasUnix.prototype, 'setAlias').mockResolvedValue(undefined)

		await repository.setAlias('ga', 'g add')

		expect(windowsSetAliasSpy).not.toHaveBeenCalled()
		expect(unixSetAliasSpy).toHaveBeenCalledWith('ga', 'g add')
	})

	it('throws server error when windows adapter fails', async () => {
		const repository = new BunAliasRepository()

		spyOn(repository as unknown as { getOS: () => 'windows' | 'unix' }, 'getOS').mockReturnValue('windows')

		spyOn(BunAliasWindows.prototype, 'setAlias').mockRejectedValue(new Error('boom'))

		await expect(repository.setAlias('ga', 'g add')).rejects.toMatchObject({
			name: 'ServerError',
			message: 'Unexpected execution error',
			description: 'Failed to set alias: ga',
		})
	})

	it('throws server error when unix adapter fails', async () => {
		const repository = new BunAliasRepository()

		spyOn(repository as unknown as { getOS: () => 'windows' | 'unix' }, 'getOS').mockReturnValue('unix')

		spyOn(BunAliasUnix.prototype, 'setAlias').mockRejectedValue(new Error('boom'))

		await expect(repository.setAlias('ga', 'g add')).rejects.toMatchObject({
			name: 'ServerError',
			message: 'Unexpected execution error',
			description: 'Failed to set alias: ga',
		})
	})
})
