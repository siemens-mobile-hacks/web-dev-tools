export const SWILIB_TOOLS_API = import.meta.env.VITE_SWILIB_TOOLS_API;

export function resolveURL(url) {
	return `${import.meta.env.BASE_URL}${url}`.replace(/[\/]+/g, '/');
}
