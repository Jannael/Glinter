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
		let label = ''
		const { status, displayPath } = this.props

		if (status.includes('M')) {
			label = `\x1b[33mmodified:\x1b[0m ${displayPath}`
		} else if (status.includes('A') || status.includes('?')) {
			label = `\x1b[32mnew file:\x1b[0m ${displayPath}`
		} else if (status.includes('D')) {
			label = `\x1b[31mdeleted:\x1b[0m ${displayPath}`
		} else if (status.includes('R')) {
			label = `\x1b[35mrenamed:\x1b[0m ${displayPath}`
		} else {
			label = `${status}: ${displayPath}`
		}
		return label
	}

	isSensitive(): boolean {
		return (
			this.value.includes('.env') ||
			this.value.includes('node_modules')
		)
	}

	getWarning(): string | null {
		if (this.value.includes('.env')) {
			return '\x1b[33m .env file hidden\x1b[0m (Add to .gitignore to avoid leaks)'
		}
		if (this.value.includes('node_modules')) {
			return '\x1b[33m node_modules hidden\x1b[0m (Add to .gitignore to save space)'
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
