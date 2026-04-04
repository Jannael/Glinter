import { cancel, isCancel, multiselect } from '@clack/prompts'
import { $ } from 'bun'

export async function main() {
	// Use --porcelain for reliable machine-readable parsing
	const output = await $`git status --porcelain`.quiet().text()

	if (!output.trim()) {
		console.log('\x1b[32m✔\x1b[0m No changes detected.')
		return
	}

	const lines = output.trim().split('\n')
	const changes = lines.map((line) => {
		const status = line.slice(0, 2)
		const file = line.slice(2)

		let label = ''
		// Map status codes to colored labels (Yellow for M, Green for A/??, Red for D)
		if (status.includes('M')) {
			label = `\x1b[33mmodified:\x1b[0m ${file}`
		} else if (status.includes('A') || status.includes('?')) {
			label = `\x1b[32mnew file:\x1b[0m ${file}`
		} else if (status.includes('D')) {
			label = `\x1b[31mdeleted:\x1b[0m ${file}`
		} else if (status.includes('R')) {
			label = `\x1b[35mrenamed:\x1b[0m ${file}`
		} else {
			label = `${status}: ${file}`
		}

		return { value: file, label }
	})

	// Add 'all' option at the top
	const options = [
		{ value: 'all', label: '\x1b[1mall changes\x1b[0m' },
		...changes,
	]

	const selectedChanges = await multiselect({
		message: 'Select the changes you want to commit. (select with space and confirm with enter)',
		options,
		required: true,
	})

	if (isCancel(selectedChanges)) {
		cancel('Operation cancelled.')
		process.exit(0)
	}

	const selected = (selectedChanges as string[]).map((file) => file.trim())

	if (selected.includes('all')) {
		await $`git add .`
	} else {
		// Bun shell correctly escapes array elements
		await $`git add ${selected}`
	}
}
