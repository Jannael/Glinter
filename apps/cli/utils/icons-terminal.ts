import { BG_YELLOW, BLACK, GREEN, RED } from './colors'

export const X = ({ text }: { text: string }) => RED({ text: `✖ ${text}` })
export const CHECK = ({ text }: { text: string }) =>
	`${GREEN({ text: '✔' })}  ${text}`
export const WARNING = ({ text }: { text: string }) =>
	BG_YELLOW({ text: BLACK({ text: ` ⚠ ${text}` }) })
