import { ALIASES } from '../domain/alias'
import type { AliasRepository } from '../domain/alias.repository'

export class SetupAliasesUseCase {
	constructor(private readonly aliasRepository: AliasRepository) {}

	async execute() {
		const os = this.aliasRepository.getOS()

		for (const alias of ALIASES) {
			const value = this.resolveAlias(alias.command, alias.kind, os)
			await this.aliasRepository.setAlias(alias.name, value)
		}

		return { total: ALIASES.length }
	}

	private resolveAlias(
		command: string,
		kind: 'git' | 'glinter',
		os: 'windows' | 'unix',
	): string {
		if (kind === 'git') return command

		// Glinter-handled: invoke the `g` binary via shell alias
		if (os === 'windows') return `!g ${command}`

		// Unix: forward all trailing arguments
		return `!g ${command} '$@'`
	}
}
