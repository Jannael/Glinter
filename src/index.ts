// step 1: exec git status to get the files that have been modified
// step 2: parse the output to get the file names
// step 3: print the file names

import { execSync } from 'node:child_process'
import { multiselect } from '@clack/prompts'

const GitAllStatus = ['modified', 'new file', 'deleted', 'renamed']

const output = execSync('git status').toString()

const files = output
	.split('\n')
	.filter((line) => GitAllStatus.some((status) => line.includes(status)))
	.map((line) => line.replace(/\t/g, ''))

const directories = output
	.split('Untracked files')[1]
	?.split('\n')
	.filter((line) => line.trim() !== '')
	.filter((line) => line.endsWith('/'))
	.map((line) => line.replace(/\t/g, ''))

const changes = [...files, ...(directories ?? []), 'all']

// once we have the changes, we need to ask the user to select the changes they want to commit

const selectedChanges = await multiselect({
	message: 'Select the changes you want to commit.',
	options: changes.map((change) => ({ value: change, label: change })),
	required: true,
})

if ((selectedChanges as string[]).includes('all')) {
	execSync('git add .')
} else {
	execSync(`git add ${(selectedChanges as string[]).join(' ')}`)
}
