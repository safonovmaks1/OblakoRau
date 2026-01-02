import * as Gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import groupCssMediaQueries from 'gulp-group-css-media-queries'
import gulpSass from 'gulp-sass'
// import * as dartSass from 'sass'
import dartSass from 'sass';
import app from '../config/app.js'
import path from '../config/path.js'
import plugins from '../plugins/plugins.js'

const sass = gulpSass(dartSass);

export const scss = () => {
  return Gulp.src(path.src.styles, { sourcemaps: app.isDev })
    .pipe(plugins.changed(path.build.styles))
   .pipe(sass({ 
    includePaths: ['node_modules/bootstrap/scss'] 
}).on('error', sass.logError))
    .pipe(plugins.gulpIf(app.isProd, autoprefixer(app.autoprefixer)))
    .pipe(plugins.gulpIf(app.isProd, groupCssMediaQueries()))
    .pipe(plugins.gulpIf(app.isProd, cleanCSS(app.clean_css)))
    .pipe(Gulp.dest(path.build.styles, { sourcemaps: app.isDev }))
    .pipe(plugins.gulpIf(app.isDev, plugins.browserSync.stream()));
};
