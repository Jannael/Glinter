export function GetLabel({
	status,
	displayPath,
}: {
	status: string
	displayPath: string
}) {
	let label = ''
	if (status.includes('M')) {
		label = `\x1b[33mmodified:\x1b[0m ${displayPath}`
	} else if (status.includes('A') || status.includes('?')) {
		label = `\x1b[32mnew file:\x1b[0m ${displayPath}`
	} else if (status.includes('D')) {
		label = `\x1b[31mdeleted:\x1b[0m ${displayPath}`
	} else if (status.includes('R')) {
		label = `\x1b[35mrenamed:\x1b[0m ${displayPath}`
	} else {
		label = `${status}: ${displayPath}`
	}
	return label
}
