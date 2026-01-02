import * as nodePath from 'path';

const root_folder = nodePath.basename(nodePath.resolve());

const src_folder = 'src';
const build_folder = 'dist';

// Папка и путь для разработки и тестирования wordpress проекта
// const build_folder = `/Applications/MAMP/htdocs/${rootFolder}`;

// Папка и путь для разработки и тестирования github проекта
// const build_folder = `docs`;

// Path
export default {
	src_folder,
	build_folder,
	root_folder,
	clean: build_folder,

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
};
