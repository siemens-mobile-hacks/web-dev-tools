export function formatId(id: number) {
	return id.toString(16).padStart(3, '0').toUpperCase();
}
