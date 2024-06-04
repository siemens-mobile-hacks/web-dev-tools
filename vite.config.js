import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
import path from 'path';
import fs from 'fs';

const ROUTES = [
	`/swilib`,
	`/swilib/phone`,
];

function postBuildPlugin() {
	return {
		name:	'postbuild-plugin',
		async closeBundle() {
			let outDir = `${import.meta.dirname}/dist`;
			for (let routeDir of ROUTES) {
				let symlinkSrc = path.relative(`${outDir}/${routeDir}`, `${outDir}/index.html`);
				let symlinkDst = `${outDir}/${routeDir}/index.html`;

				fs.mkdirSync(`${outDir}/${routeDir}`, { recursive: true });

				if (!fs.existsSync(symlinkDst))
					fs.symlinkSync(symlinkSrc, `${outDir}/${routeDir}/index.html`);
			}
		}
	};
}

export default defineConfig({
	resolve: {
		alias: [{ find: '~', replacement: path.resolve(import.meta.dirname, '/src') }],
	},
	plugins: [
		/*
		Uncomment the following line to enable solid-devtools.
		For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
		*/
		// devtools(),
		solidPlugin(),
		postBuildPlugin(),
	],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
