import { CreateError } from './error-constructor'

type INotFound =
	| 'Repository not found'
	| 'Branch not found'
	| 'File not found'
	| 'Change not found'
	| 'No branches available'
	| 'No changes detected'
export const NotFound = CreateError<INotFound>('NotFound')

type IForbidden =
	| 'Access denied'
	| 'Operation not permitted'
	| 'Permission denied for git operation'
export const Forbidden = CreateError<IForbidden>('Forbidden')

type IConflict =
	| 'Branch already exists'
	| 'File already staged'
	| 'Uncommitted changes'
	| 'Merge conflict'
export const Conflict = CreateError<IConflict>('Conflict')

type IServerError =
	| 'Git status failed'
	| 'Git add failed'
	| 'Git commit failed'
	| 'Git checkout failed'
	| 'Git branch failed'
	| 'Unexpected execution error'
export const ServerError = CreateError<IServerError>('ServerError')

type IBadRequest =
	| 'Invalid branch name'
	| 'No changes selected'
	| 'Invalid configuration'
	| 'Invalid git command'
export const BadRequest = CreateError<IBadRequest>('BadRequest')
