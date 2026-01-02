import * as Gulp from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import webp from 'gulp-webp';
import app from '../config/app.js';
import path from '../config/path.js';
import plugins from '../plugins/plugins.js';

import { handleError } from '../plugins/handle-error.js';

export const images = () => {
	return Gulp.src(path.src.images, { encoding: false })
		.pipe(plugins.changed(path.build.images))
		.pipe(handleError('Images'))
		.pipe(
			plugins.gulpIf(
				app.isProd,
				imagemin(
					[
						svgo({ plugins: [{ name: 'removeViewBox', active: false }] }),
						mozjpeg({ quality: 80, progressive: true }),
						optipng({ optimizationLevel: 3 }),
						gifsicle({ interlaced: true }),
					],
					{
						verbose: true,
					}
				)
			)
		)
		.pipe(Gulp.dest(path.build.images, {}))
		.pipe(plugins.gulpIf(app.isDev, plugins.browserSync.stream()));
};

export const imagesWebp = () => {
	return Gulp.src(path.src.images, { encoding: false })
		.pipe(plugins.changed(path.build.images))
		.pipe(handleError('Images Webp'))
		.pipe(plugins.gulpIf(app.isProd, webp(app.webp)))
		.pipe(Gulp.dest(path.build.images, {}));
};
