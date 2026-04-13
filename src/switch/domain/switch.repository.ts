export interface SwitchRepository {
	getBranches(): Promise<string[]>
	switchBranch({ branch }: { branch: string }): Promise<void>
}
