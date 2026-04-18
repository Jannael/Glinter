const RESET = '\x1b[0m'
export const GREEN = ({ text }: { text: string }) => `\x1b[32m${text}${RESET}`
export const YELLOW = ({ text }: { text: string }) => `\x1b[33m${text}${RESET}`
export const RED = ({ text }: { text: string }) => `\x1b[31m${text}${RESET}`
export const MAGENTA = ({ text }: { text: string }) => `\x1b[35m${text}${RESET}`
export const BLUE = ({ text }: { text: string }) => `\x1b[34m${text}${RESET}`
export const BOLD = ({ text }: { text: string }) => `\x1b[1m${text}${RESET}`
export const BLACK = ({ text }: { text: string }) => `\x1b[30m${text}${RESET}`
export const BG_YELLOW = ({ text }: { text: string }) =>
	`\x1b[43m${text}${RESET}`
