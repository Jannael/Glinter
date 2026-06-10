import { describe, expect, it, spyOn } from 'bun:test'
import { ALIASES } from '@/alias'
import { aliasCommand } from '@/modules/alias/main'

describe('aliasCommand', () => {
	it('prints all setup aliases with resolved names', async () => {
		const logSpy = spyOn(console, 'log').mockImplementation(() => {})

		await aliasCommand()

		expect(logSpy).toHaveBeenCalled()
		for (const alias of ALIASES) {
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`${alias.name}`))
		}
	})
})
