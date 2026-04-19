// cspell:disable
import { ServerError } from '@/error/error-instance'
import type { AliasRepository } from '@/modules/setup/domain/alias.repository'
import { BunAliasUnix } from '@/modules/setup/infra/bun-alias-unix'
import { BunAliasWindows } from '@/modules/setup/infra/bun-alias-windows'

export class BunAliasRepository implements AliasRepository {
	private getOS(): 'windows' | 'unix' {
		return process.platform === 'win32' ? 'windows' : 'unix'
	}

	async setAlias(name: string, value: string): Promise<void> {
		try {
			const system = this.getOS()

			if (system === 'windows') {
				const bunAliasWindows = new BunAliasWindows()
				await bunAliasWindows.setAlias(name, value)
			}

			if (system === 'unix') {
				const bunAliasUnix = new BunAliasUnix()
				await bunAliasUnix.setAlias(name, value)
			}
		} catch {
			throw new ServerError(
				'Unexpected execution error',
				`Failed to set alias: ${name}`,
			)
		}
	}
}
