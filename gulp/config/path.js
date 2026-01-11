import * as nodePath from 'path';

// --- 1. Логика определения папок и режимов ---
const root_folder = nodePath.basename(nodePath.resolve());
const src_folder = 'src';

// Проверка флагов в командной строке
const isProd = process.argv.includes('--production');
const isDev = !isProd;
const isDocs = process.argv.includes('--docs'); // Флаг для GitHub Pages
const isWp = process.argv.includes('--wp'); // Флаг для WordPress (опционально)

// Логика выбора папки билда
let build_folder = 'dist'; // Значение по умолчанию

if (isDocs) {
	build_folder = 'docs';
} else if (isWp) {
	build_folder = `/Applications/MAMP/htdocs/${root_folder}`;
}

// --- 2. Объект настроек ---

export default {
	// Основные пути и переменные
	src_folder,
	build_folder,
	root_folder,
	isProd,
	isDev,

	src: {
		html: [`${src_folder}/pages/*.html`],
		styles: `${src_folder}/scss/*.scss`,
		js: `${src_folder}/js/*.js`,
		images: [`${src_folder}/assets/images/**/*`],
		icons: `${src_folder}/assets/icons/**/*.svg`,
		fonts: `${src_folder}/assets/fonts/**/*`,
	},
	build: {
		html: `${build_folder}/`,
		styles: `${build_folder}/css/`,
		js: `${build_folder}/js/`,
		images: `${build_folder}/images/`,
		fonts: `${build_folder}/fonts/`,
	},
	watch: {
		html: [`${src_folder}/**/*.html`, `${src_folder}/data/*.json`],
		styles: `${src_folder}/**/*.scss`,
		js: `${src_folder}/**/*.js`,
		images: `${src_folder}/assets/images/**/*`,
		icons: `${src_folder}/assets/icons/**/*`,
	},

	clean: build_folder, // Папка для очистки
};
