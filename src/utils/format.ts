export function formatId(id: number) {
	return id.toString(16).padStart(3, '0').toUpperCase();
}

export function formatAddress(address: number) {
	return address.toString(16).padStart(8, '0').toUpperCase();
}
