import { cancel, isCancel, multiselect } from '@clack/prompts'
import { $ } from 'bun'

export async function main() {
	// Use --porcelain -z for reliable machine-readable parsing (handles spaces/quotes)
	const output = await $`git status --porcelain -z`.quiet().text()

	if (!output.trim()) {
		console.log('\x1b[32m✔\x1b[0m No changes detected.')
		return
	}

	// Aggregator for unique warnings
	const warnings = new Set<string>()

	// Split by NUL character
	const entries = output.split('\0').filter(Boolean)
	const changes = []

	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i]
		if (!entry) continue

		const status = entry.slice(0, 2)
		const file = entry.slice(3) // XY <path>

		// Skip if the file is already staged (index status is not empty or untracked)
		const isStaged = status[0] !== ' ' && status[0] !== '?'
		if (isStaged) continue

		let displayPath = file
		const value = file

		if (status.startsWith('R') || status.startsWith('C')) {
			const source = entries[++i]
			displayPath = `${source} -> ${file}`
			// For renames, 'file' is the new path which is what we want to add
		}

		let label = ''
		// Map status codes to colored labels (Yellow for M, Green for A/??, Red for D)
		if (status.includes('M')) {
			label = `\x1b[33mmodified:\x1b[0m ${displayPath}`
		} else if (status.includes('A') || status.includes('?')) {
			label = `\x1b[32mnew file:\x1b[0m ${displayPath}`
		} else if (status.includes('D')) {
			label = `\x1b[31mdeleted:\x1b[0m ${displayPath}`
		} else if (status.includes('R')) {
			label = `\x1b[35mrenamed:\x1b[0m ${displayPath}`
		} else {
			label = `${status}: ${displayPath}`
		}

		const isSensitive = value.includes('.env') || value.includes('node_modules')

		if (value.includes('.env')) {
			warnings.add(
				'\x1b[33m .env file hidden\x1b[0m (Add to .gitignore to avoid leaks)',
			)
		}
		if (value.includes('node_modules')) {
			warnings.add(
				'\x1b[33m node_modules hidden\x1b[0m (Add to .gitignore to save space)',
			)
		}

		if (!isSensitive) {
			changes.push({ value, label })
		}
	}

	if (changes.length === 0) {
		console.log(
			'\x1b[32m✔\x1b[0m All changes are either staged or sensitive (like .env).',
		)
		return
	}

	// Add 'all' option at the top
	const options = [
		{ value: 'all', label: '\x1b[1mall changes\x1b[0m' },
		...changes,
	]

	const selectedChanges = await multiselect({
		message:
			'Select the changes you want to commit. (select with space and confirm with enter)',
		options,
		required: true,
	})

	if (isCancel(selectedChanges)) {
		cancel('Operation cancelled.')
		process.exit(0)
	}

	let selected = (selectedChanges as string[]).map((file) => file.trim())

	if (selected.includes('all')) {
		selected = changes.map((c) => c.value) // Add all non-sensitive files
	}

	if (selected.length > 0) {
		// Bun shell correctly escapes array elements
		const proc = Bun.spawn(['git', 'add', ...selected], {
			stdio: ['inherit', 'inherit', 'inherit'],
		})

		const exitCode = await proc.exited

		if (warnings.size > 0) {
			console.log('\n\x1b[43m\x1b[30m WARNING \x1b[0m')
			for (const warning of warnings) {
				console.log(warning)
			}
			console.log('')
		}

		process.exit(exitCode)
	}
}
