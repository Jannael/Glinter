import { GREEN, MAGENTA, RED, YELLOW } from '@/utils/colors'

export interface ChangeProps {
	value: string
	status: string
	displayPath: string
}

export class Change {
	constructor(private readonly props: ChangeProps) {}

	get value() {
		return this.props.value
	}

	get status() {
		return this.props.status
	}

	get displayPath() {
		return this.props.displayPath
	}

	get label() {
		const { status, displayPath } = this.props
		let label = `${status}: ${displayPath}`

		if (status.includes('M')) {
			label = YELLOW({ text: `modified: ${displayPath}` })
		}
		if (status.includes('A') || status.includes('?')) {
			label = GREEN({ text: `new file: ${displayPath}` })
		}
		if (status.includes('D')) {
			label = RED({ text: `deleted: ${displayPath}` })
		}
		if (status.includes('R')) {
			label = MAGENTA({ text: `renamed: ${displayPath}` })
		}

		return label
	}

	isSensitive(): boolean {
		return this.value.includes('.env') || this.value.includes('node_modules')
	}

	getWarning(): string | null {
		if (this.value.includes('.env')) {
			return (
				YELLOW({ text: ' .env file hidden' }) +
				' (Add to .gitignore to avoid leaks)'
			)
		}
		if (this.value.includes('node_modules')) {
			return (
				YELLOW({ text: ' node_modules hidden' }) +
				' (Add to .gitignore to save space)'
			)
		}
		return null
	}

	static fromPorcelain(entries: string[]): Change[] {
		const changes: Change[] = []

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i]
			if (!entry) continue

			const status = entry.slice(0, 2)
			const file = entry.slice(3)

			// Skip if the file is already staged (index status is not empty or untracked)
			const isStaged = status[0] !== ' ' && status[0] !== '?'
			if (isStaged) continue

			let displayPath = file
			const value = file

			if (status.startsWith('R') || status.startsWith('C')) {
				const source = entries[++i]
				displayPath = `${source} -> ${file}`
			}

			changes.push(new Change({ value, status, displayPath }))
		}

		return changes
	}
}
