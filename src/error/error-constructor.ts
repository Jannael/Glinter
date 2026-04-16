export type CustomError = Error & {
	description?: string
}

export function CreateError<T extends string>(
	name: string,
): new (
	message: T,
	description?: string,
) => CustomError {
	const capitalize = (text: string): string =>
		text.charAt(0).toUpperCase() + text.slice(1)

	return class extends Error {
		readonly description?: string

		constructor(message: T, description?: string) {
			super(capitalize(message))
			this.name = name
			this.description =
				description !== undefined ? capitalize(description) : undefined
		}
	}
}
