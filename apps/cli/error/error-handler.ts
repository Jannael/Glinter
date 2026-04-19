import { WARNING, X } from '../utils/icons-terminal'
import { NotFound, ServerError } from './error-instance'

export function errorHandler(error: unknown) {
	if (error instanceof ServerError) {
		console.error(X({ text: error.message }))
		if (error.description) {
			console.error(`  ${error.description}`)
		}
		return
	}
	if (error instanceof NotFound) {
		console.error(WARNING({ text: error.message }))
		return
	}
	// Unknown error — something truly unexpected
	console.error(X({ text: 'An unexpected error occurred' }))
	if (error instanceof Error) {
		console.error(`  ${error.message}`)
	}
}
