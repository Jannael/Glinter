export interface CommitRepository {
	commit(message: string): Promise<void>
}
