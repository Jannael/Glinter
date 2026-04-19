import { ALIASES } from '@/modules/setup/domain/alias'
import type { AliasRepository } from '@/modules/setup/domain/alias.repository'

export class SetupAliasesUseCase {
	constructor(private readonly aliasRepository: AliasRepository) {}

	async execute() {
		for (const alias of ALIASES) {
			const { name, value } = this.resolveAlias(
				alias.name,
				alias.command,
				alias.kind,
			)
			await this.aliasRepository.setAlias(name, value)
		}

		return { total: ALIASES.length }
	}

	// cspell:disable-next-line
	private resolveAlias(name: string, command: string, kind: 'git' | 'glinter') {
		const aliasName = `g${name}`
		const aliasCommand = kind === 'git' ? `git ${command}` : `g ${command}`
		return { name: aliasName, value: aliasCommand }
	}
}
