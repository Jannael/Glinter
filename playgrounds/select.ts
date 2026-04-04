import { select } from '@clack/prompts'

const projectType = await select({
	message: 'Pick a project type.',
	options: [
		{ value: 'ts', label: 'TypeScript' },
		{ value: 'js', label: 'JavaScript', disabled: true },
		{ value: 'coffee', label: 'CoffeeScript', hint: 'oh no' },
	],
})

console.log(projectType)
