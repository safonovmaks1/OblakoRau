import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [
		handlebars({
			partialDirectory: resolve(rootDir, 'src/partials'),
			context: {
				siteName: 'OBLAKO RAI',
			},
		}),
	],

	server: {
		host: '127.0.0.1',
		port: 5173,
		strictPort: true,
	},

	build: {
		outDir: 'dist',
		emptyOutDir: true,
		assetsDir: 'assets',
		sourcemap: true,

		rollupOptions: {
			input: {
				main: resolve(rootDir, 'index.html'),
				uiKit: resolve(rootDir, 'src/pages/ui-kit/index.html'),
			},
		},
	},
});
