import * as Gulp from 'gulp';

// Конфигурация
import app from './gulp/config/app.js';
import path from './gulp/config/path.js';
import plugins from './gulp/plugins/plugins.js';

// Tasks
import {
	clean,
	fonts,
	html,
	images,
	scripts,
	scss,
	sprites,
} from './gulp/tasks/index.js';

// Server
const server = () => {
	return plugins.browserSync.init({
		server: {
			baseDir: path.build_folder,
		},
		logLevel: 'info',
		cors: true,
		notify: false,
		open: true,
		browser: 'google chrome',
		reloadOnRestart: true,
		port: process.env.PORT ?? 3000,
	});
};

// Watcher
const watcher = () => {
	Gulp.watch(path.watch.html, html);
	Gulp.watch(path.watch.styles, scss);
	Gulp.watch(path.watch.js, scripts);
	Gulp.watch(path.watch.images, images);
	Gulp.watch(path.watch.icons, sprites);
};

const tasks = Gulp.series(
	Gulp.parallel(html, scss, images, scripts, sprites, fonts)
);

const build = Gulp.series(clean, tasks);
const dev = Gulp.series(build, Gulp.parallel(watcher, server));

export default app.isProd ? build : dev;
