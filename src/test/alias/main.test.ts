import { describe, expect, it, vi } from 'vitest'
import { ALIASES } from '@/alias'
import { aliasCommand } from '@/modules/alias/main'

describe('aliasCommand', () => {
	it('prints all setup aliases with resolved names', async () => {
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

		await aliasCommand()

		expect(logSpy).toHaveBeenCalled()
		for (const alias of ALIASES) {
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining(`g${alias.name}`),
			)
		}
	})
})
