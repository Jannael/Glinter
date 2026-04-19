export interface AliasRepository {
	getOS(): 'windows' | 'unix'
	setAlias(name: string, value: string): Promise<void>
}
