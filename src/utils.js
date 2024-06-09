export const SWILIB_TOOLS_API = import.meta.env.VITE_SWILIB_TOOLS_API;
export const PMB887X_DEV_API = import.meta.env.VITE_PMB887X_DEV_API;

export function resolveURL(url) {
	return `${import.meta.env.BASE_URL}${url}`.replace(/[\/]+/g, '/');
}
