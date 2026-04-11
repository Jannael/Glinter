import { GetChanges } from './domain/get-changes'
import { MultiSelect } from './infra/multiselect'

export async function main() {
	const { changes, warnings } = await GetChanges()

	// Add 'all' option at the top
	const options = [
		{ value: 'all', label: '\x1b[1mall changes\x1b[0m' },
		...changes,
	]

	const selectedChanges = await MultiSelect({
		message:
			'Select the changes you want to commit. (select with space and confirm with enter)',
		options,
	})

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
