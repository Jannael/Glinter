import type { Commit } from '@/modules/reset-hard/domain/commit'

export interface ResetHardRepository {
	getCommits(page: number, pageSize: number): Promise<{ commits: Commit[]; hasMore: boolean }>
	resetHard(hash: string): Promise<void>
}
