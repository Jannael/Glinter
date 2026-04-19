import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { AliasRepository } from '@/modules/setup/domain/alias.repository'
import { GREEN } from '@/utils/colors'

export class BunAliasUnix implements AliasRepository {
	async setAlias(name: string, value: string): Promise<void> {
		const profilePath = this.getUnixProfilePath()

		fs.mkdirSync(path.dirname(profilePath), { recursive: true })
		const current = fs.existsSync(profilePath)
			? fs.readFileSync(profilePath, 'utf8')
			: ''

		const updated = this.upsertUnixProfileAlias(current, name, value)
		fs.writeFileSync(profilePath, updated)
		console.log(`Alias ${name} set ${GREEN({ text: 'successfully' })}`)
	}

	private upsertUnixProfileAlias(content: string, name: string, value: string) {
		const escapedName = this.escapeRegex(name)
		const escapedValue = this.escapeSingleQuotes(value)
		const aliasLine = `alias ${name}='${escapedValue}'`
		const aliasRegex = new RegExp(`^alias ${escapedName}=.*\\r?\\n?`, 'gm')

		const cleaned = content.replace(aliasRegex, '').trimEnd()
		const prefix = cleaned.length > 0 ? `${cleaned}\n` : ''

		return `${prefix}${aliasLine}\n`
	}

	private getUnixProfilePath(): string {
		const home = os.homedir()
		const shellName = path.basename(process.env.SHELL ?? '')

		const preferredProfile =
			shellName === 'zsh'
				? '.zshrc'
				: shellName === 'bash'
					? '.bashrc'
					: '.profile'

		const candidates = [preferredProfile, '.bashrc', '.zshrc', '.profile']
		const uniqueCandidates = [...new Set(candidates)]

		for (const candidate of uniqueCandidates) {
			const candidatePath = path.join(home, candidate)
			if (fs.existsSync(candidatePath)) {
				return candidatePath
			}
		}

		return path.join(home, preferredProfile)
	}

	private escapeRegex(value: string): string {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	private escapeSingleQuotes(value: string): string {
		return value.replace(/'/g, `'"'"'`)
	}
}
