export interface AliasRepository {
	setAlias(name: string, value: string): Promise<void>
}
