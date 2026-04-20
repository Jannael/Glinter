import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { AliasRepository } from '@/modules/setup/domain/alias.repository'

export class BunAliasWindows implements AliasRepository {
	async setAlias(name: string, value: string): Promise<void> {
		const psProfilePath = this.getWindowsProfilePath()

		fs.mkdirSync(path.dirname(psProfilePath), { recursive: true })
		const current = fs.existsSync(psProfilePath)
			? fs.readFileSync(psProfilePath, 'utf8')
			: ''

		const updated = this.upsertWindowsProfileFunction(current, name, value)
		fs.writeFileSync(psProfilePath, updated)
	}

	private upsertWindowsProfileFunction(
		content: string,
		name: string,
		value: string,
	): string {
		const escapedName = this.escapeRegex(name)
		const removeAliasLine = `if (Get-Alias -Name ${name} -ErrorAction SilentlyContinue) { Remove-Item Alias:${name} -Force }`
		const functionLine = `function ${name} { ${value} @args }`

		const removeAliasRegex = new RegExp(
			`^if \\(Get-Alias -Name ${escapedName} -ErrorAction SilentlyContinue\\) \\{ Remove-Item Alias:${escapedName} -Force \\}\\r?\\n?`,
			'gm',
		)
		const functionRegex = new RegExp(
			`^function ${escapedName} \\{[^\\r\\n]*\\}\\r?\\n?`,
			'gm',
		)

		const cleaned = content
			.replace(removeAliasRegex, '')
			.replace(functionRegex, '')
			.trimEnd()
		const prefix = cleaned.length > 0 ? `${cleaned}\n` : ''

		return `${prefix}${removeAliasLine}\n${functionLine}\n`
	}

	private escapeRegex(value: string): string {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	private getWindowsProfilePath(): string {
		return path.join(
			this.getWindowsDocumentsPath(),
			'PowerShell',
			'Microsoft.PowerShell_profile.ps1',
		)
	}

	private getWindowsDocumentsPath(): string {
		const proc = Bun.spawnSync(
			[
				'powershell',
				'-NoProfile',
				'-Command',
				"[Environment]::GetFolderPath('MyDocuments')",
			],
			{
				stdout: 'pipe',
				stderr: 'pipe',
			},
		)

		if (proc.exitCode === 0) {
			const docsPath = new TextDecoder().decode(proc.stdout).trim()
			if (docsPath.length > 0) {
				return docsPath
			}
		}

		return path.join(os.homedir(), 'Documents')
	}
}
