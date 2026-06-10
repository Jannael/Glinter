export type CustomError = Error & {
	description?: string
}

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

export function CreateError<T extends string>(name: string): new (message: T, description?: string) => CustomError {
	return class extends Error {
		readonly description?: string

		constructor(message: T, description?: string) {
			super(capitalize(message))
			this.name = name
			this.description = description !== undefined ? capitalize(description) : undefined
		}
	}
}
