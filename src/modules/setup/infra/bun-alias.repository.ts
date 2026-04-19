import { $ } from 'bun'
import { ServerError } from '../../../error/error-instance'
import type { AliasRepository } from '../domain/alias.repository'

export class BunAliasRepository implements AliasRepository {
	getOS(): 'windows' | 'unix' {
		return process.platform === 'win32' ? 'windows' : 'unix'
	}

	async setAlias(name: string, value: string): Promise<void> {
		try {
			await $`git config --global alias.${name} ${value}`.quiet()
		} catch {
			throw new ServerError(
				'Unexpected execution error',
				`Failed to set alias: ${name}`,
			)
		}
	}
}
