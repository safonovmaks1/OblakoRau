import * as Gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import typograf from 'gulp-typograf';
import versionNumber from 'gulp-version-number';
import app from '../config/app.js';
import path from '../config/path.js';
import plugins from '../plugins/plugins.js';

import { handleError } from '../plugins/handle-error.js';

export const html = () => {
	return Gulp.src(path.src.html, {})
		.pipe(handleError('HTML'))
		.pipe(fileinclude(app.file_include))
		.pipe(typograf(app.typograf))
		.pipe(plugins.gulpIf(app.isProd, versionNumber(app.v_number)))
		.pipe(htmlmin(app.html_min))
		.pipe(Gulp.dest(path.build.html))
		.pipe(plugins.gulpIf(app.isDev, plugins.browserSync.stream()));
};

// .pipe(plugins.gulpif(app.isProd, webpHtml()))
// .pipe(plugins.changed(path.build.html, { hasChanged: plugins.changed.compareContents }))
