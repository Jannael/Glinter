import type { CommitRepository } from '../domain/commit.repository'

export class CommitUseCase {
	constructor(private readonly commitRepository: CommitRepository) {}

	async execute({ message }: { message: string }) {
		await this.commitRepository.commit(message)
	}
}
