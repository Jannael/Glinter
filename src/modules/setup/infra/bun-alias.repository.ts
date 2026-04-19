// cspell:disable
import { ServerError } from '../../../error/error-instance'
import type { AliasRepository } from '../domain/alias.repository'
import { BunAliasWindows } from './bun-alias-windows'

export class BunAliasRepository implements AliasRepository {
	private getOS(): 'windows' | 'unix' {
		return process.platform === 'win32' ? 'windows' : 'unix'
	}

	async setAlias(name: string, value: string): Promise<void> {
		try {
			const system = this.getOS()

			if (system === 'windows') {
				const bunAliasWindows = new BunAliasWindows()
				bunAliasWindows.setAlias(name, value)
			}
		} catch {
			throw new ServerError(
				'Unexpected execution error',
				`Failed to set alias: ${name}`,
			)
		}
	}
}
