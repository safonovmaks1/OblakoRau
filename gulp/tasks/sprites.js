import * as Gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import app from '../config/app.js';
import path from '../config/path.js';
import plugins from '../plugins/plugins.js';

import { handleError } from '../plugins/handle-error.js';

export const sprites = () => {
	return Gulp.src(path.src.icons, {})
		.pipe(handleError('Sprites'))
		.pipe(svgSprite(app.svg_symbol))
		.pipe(Gulp.dest(path.build.images, {}))
		.pipe(plugins.gulpIf(app.isDev, plugins.browserSync.stream()));
};
