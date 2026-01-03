
export function resolveURL(url: string) {
	return `${import.meta.env.BASE_URL}${url}`.replace(/[\/]+/g, '/');
}
