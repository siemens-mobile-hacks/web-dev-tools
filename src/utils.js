export function resolveURL(url) {
	return `${import.meta.env.BASE_URL}${url}`.replace(/[\/]+/g, '/');
}
