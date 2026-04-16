import { describe, expect, it } from 'vitest'
import { Change } from '../../../modules/add/domain/change'
import { GREEN, YELLOW } from '../../../utils/colors'

describe('Change', () => {
	it('Create a change instance', () => {
		const change = new Change({
			value: 'test',
			status: 'A',
			displayPath: 'test',
		})
		expect(change.value).toBe('test')
		expect(change.status).toBe('A')
		expect(change.displayPath).toBe('test')
	})

	it('Get label', () => {
		const change = new Change({
			value: 'test',
			status: 'A',
			displayPath: 'test',
		})

		expect(change.label).toBe(GREEN({ text: 'new file: test' }))
	})

	it('Is sensitive', () => {
		const change = new Change({
			value: '.env',
			status: 'A',
			displayPath: '.env',
		})

		expect(change.isSensitive()).toBe(true)
	})

	it('Get warning', () => {
		const change = new Change({
			value: '.env',
			status: 'A',
			displayPath: '.env',
		})

		expect(change.getWarning()).toBe(
			YELLOW({ text: ' .env file hidden' }) +
				' (Add to .gitignore to avoid leaks)',
		)
	})

	it('Get changes from porcelain', () => {
		const changes = Change.fromPorcelain([' M bun.lock'])
		expect(changes).toHaveLength(1)
		expect(changes[0]?.value).toBe('bun.lock')
		expect(changes[0]?.status).toBe(' M')
		expect(changes[0]?.displayPath).toBe('bun.lock')
	})
})
