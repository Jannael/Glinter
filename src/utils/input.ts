import { cancel, isCancel, text } from '@clack/prompts'

export async function Input({
	message,
	placeholder,
}: {
	message: string
	placeholder?: string
}) {
	const value = await text({
		message,
		placeholder,
		validate(input) {
			if (!input?.trim()) {
				return 'Commit message is required.'
			}
		},
	})

	if (isCancel(value)) {
		cancel('Operation cancelled.')
		process.exit(0)
	}

	return value.trim()
}
