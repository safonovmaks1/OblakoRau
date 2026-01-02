import gulpNotify from 'gulp-notify';
import gulpPlumber from 'gulp-plumber';

export const handleError = (taskName) => {
	return gulpPlumber({
		handleError: gulpNotify.onError({
			title: taskName,
			message: 'Error: <%= error.message %>',
			sound: false,
		}),
	});
};

// import { handleError } from '../plugins/handle-error.js';
// .pipe(handleError('SCSS'))
