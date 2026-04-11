import { GetEntries } from '../infra/get-entries'

export async function GetChanges() {
	const entries = await GetEntries()

	// Aggregator for unique warnings
	const warnings = new Set<string>()
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
			'\x1b[32m✔\x1b[0m  All changes are either staged or sensitive (like .env).',
		)
		process.exit(0)
	}

	return { changes, warnings }
}
