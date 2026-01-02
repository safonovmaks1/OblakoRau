import * as Gulp from 'gulp'
import babel from 'gulp-babel'
import webpackStream from 'webpack-stream'
import app from '../config/app.js'
import path from '../config/path.js'
import plugins from '../plugins/plugins.js'

import { handleError } from '../plugins/handle-error.js'

export const scripts = () => {
	return Gulp.src(path.src.js, { sourcemaps: app.isDev })
		.pipe(plugins.changed(path.build.js))
		.pipe(handleError('Scripts'))
		.pipe(babel())
		.pipe(webpackStream(app.webpack))
		.pipe(Gulp.dest(path.build.js, { sourcemaps: app.isDev }))
		.pipe(plugins.gulpIf(app.isDev, plugins.browserSync.stream()));
};
