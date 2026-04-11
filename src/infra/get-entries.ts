import { $ } from 'bun'

export async function GetEntries() {
	// Use --porcelain -z for reliable machine-readable parsing (handles spaces/quotes)
	const output = await $`git status --porcelain -z`.quiet().text()

	if (!output.trim()) {
		console.log('\x1b[32m✔\x1b[0m  No changes detected.')
		return []
	}

	// Split by NUL character
	const entries = output.split('\0').filter(Boolean)

	return entries
}
