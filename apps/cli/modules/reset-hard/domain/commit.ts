export class Commit {
	constructor(
		private readonly props: {
			hash: string
			subject: string
		},
	) {}

	get hash() {
		return this.props.hash
	}

	get shortHash() {
		return this.props.hash.slice(0, 7)
	}

	get subject() {
		return this.props.subject
	}

	static fromGitLog(output: string): Commit[] {
		if (!output.trim()) return []

		const lines = output.split('\n').filter((line) => line.trim() !== '')

		return lines.map((line) => {
			const hash = line.substring(0, 40)
			const subject = line.substring(41).trim()

			return new Commit({ hash, subject })
		})
	}
}
