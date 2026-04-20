export interface BranchProps {
	name: string
	current: boolean
	remote: boolean
}

export class Branch {
	constructor(private readonly props: BranchProps) {}

	get name() {
		return this.props.name
	}

	get isCurrentBranch() {
		return this.props.current
	}

	get isRemoteBranch() {
		return this.props.remote
	}

	get isHeadBranch() {
		return this.props.name.includes('HEAD')
	}

	static fromGitBranch(entries: string[]): Branch[] {
		const branches: Branch[] = []

		for (let i = 0; i < entries?.length; i++) {
			const entry = entries[i]
			if (!entry) continue

			const current = entry.includes('*')
			const remote = entry.includes('remotes/')

			branches.push(
				new Branch({
					name: current ? entry.replace('*', '').trim() : entry,
					current,
					remote,
				}),
			)
		}

		return branches
	}
}
