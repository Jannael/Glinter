import { GREEN } from '@/utils/colors'

export const commitTypeOptions = [
	{
		value: 'feat',
		label: `${GREEN({ text: 'feat' })}: A new feature`,
	},
	{
		value: 'fix',
		label: `${GREEN({ text: 'fix' })}: A bug fix`,
	},
	{
		value: 'chore',
		label: `${GREEN({ text: 'chore' })}: Routine maintenance`,
	},
	{
		value: 'docs',
		label: `${GREEN({ text: 'docs' })}: Documentation updates`,
	},
	{
		value: 'refactor',
		label: `${GREEN({ text: 'refactor' })}: Code changes without behavior change`,
	},
	{
		value: 'test',
		label: `${GREEN({ text: 'test' })}: Add or update tests`,
	},
	{
		value: 'perf',
		label: `${GREEN({ text: 'perf' })}: Performance improvements`,
	},
	{
		value: 'style',
		label: `${GREEN({ text: 'style' })}: Formatting or style-only changes`,
	},
]
