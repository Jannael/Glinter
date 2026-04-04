// step 1: exec git status to get the files that have been modified
// step 2: parse the output to get the file names
// step 3: print the file names

import { multiselect } from '@clack/prompts'
import { $ } from 'bun'

const GitAllStatus = ['modified', 'new file', 'deleted', 'renamed']

export async function main() {
	const output = await $`git status`.quiet().text()

	const files = new Set(
		output
			.split('\n')
			.filter((line) => GitAllStatus.some((status) => line.includes(status)))
			.map((line) => line.replace(/\t/g, '')),
	)

	const directories = new Set(
		output
			.split('Untracked files')[1]
			?.split('\n')
			.filter((line) => line.trim() !== '')
			.filter((line) => line.endsWith('/'))
			.map((line) => line.replace(/\t/g, '')),
	)

	const changes = ['all', ...files, ...(directories ?? [])]

	// once we have the changes, we need to ask the user to select the changes they want to commit

	const selectedChanges = await multiselect({
		message: 'Select the changes you want to commit.',
		options: changes.map((change) => ({ value: change, label: change })),
		required: true,
	})

	if ((selectedChanges as string[]).includes('all')) {
		await $`git add .`
	} else {
		const filenames = (selectedChanges as string[]).map((change) =>
			change
				.replace('new file: ', '')
				.replace('modified: ', '')
				.replace('deleted: ', '')
				.replace('renamed: ', '')
				.trim(),
		)

		await $`git add ${filenames.join(' ')}`
	}
}
