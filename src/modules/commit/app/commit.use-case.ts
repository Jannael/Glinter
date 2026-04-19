import type { CommitRepository } from '@/modules/commit/domain/commit.repository'

export class CommitUseCase {
	constructor(private readonly commitRepository: CommitRepository) {}

	async execute({ message }: { message: string }) {
		await this.commitRepository.commit(message)
	}
}
