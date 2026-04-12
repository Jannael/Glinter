export interface GitRepository {
	getEntries(): Promise<string[]>
	stageFiles(files: string[]): Promise<void>
}
