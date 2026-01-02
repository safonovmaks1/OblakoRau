import fs from 'fs';
import * as Gulp from 'gulp';
import ttf2woff2 from 'gulp-ttf2woff2';
import path from '../config/path.js';

import { handleError } from '../plugins/handle-error.js';

export const ttfToWoff2 = () =>
	Gulp.src(`${path.src_folder}/assets/fonts/*.ttf`, { encoding: false })
		.pipe(handleError('Fonts ( ttfToWoff2)'))
		.pipe(ttf2woff2())
		.pipe(Gulp.dest(path.build.fonts, {}));

export const fontsStyle = (done) => {
	const fontsFileScss = `${path.src_folder}/scss/_fonts.scss`;
	const fontsFileHtml = `${path.src_folder}/partials/config/fonts.html`;

	function cb() {}

	fs.readdir(path.build.fonts, (err, fontsFiles) => {
		if (!fontsFiles) {
			return done();
		}

		fs.writeFileSync(fontsFileScss, '', cb);
		fs.writeFileSync(fontsFileHtml, '', cb);

		// Чтобы не дублировать VariableFont
		const processedFonts = new Set();

		fontsFiles.forEach((file) => {
			const fontFileName = file.split('.')[0];
			const fontParts = fontFileName.split('-');
			const fontName = fontParts[0];
			const weightPart = fontParts[1] || '';

			let fontWeight;

			// Variable Font
			if (fontFileName.includes('-VariableFont_wght')) {
				if (processedFonts.has(fontName)) {
					return;
				} // уже добавили
				fontWeight = '100 900';
				processedFonts.add(fontName);
			} else {
				// Обычные веса
				switch (weightPart.toLowerCase()) {
					case 'thin':
						fontWeight = '100';
						break;
					case 'extralight':
						fontWeight = '200';
						break;
					case 'light':
						fontWeight = '300';
						break;
					case 'medium':
						fontWeight = '500';
						break;
					case 'semibold':
						fontWeight = '600';
						break;
					case 'bold':
						fontWeight = '700';
						break;
					case 'extrabold':
					case 'heavy':
						fontWeight = '800';
						break;
					case 'black':
						fontWeight = '900';
						break;
					default:
						fontWeight = '400';
						break;
				}
			}

			// Добавляем в SCSS
			fs.appendFileSync(fontsFileScss, `@use 'helpers' as *;\r\n@include font-face('${fontName}', '${fontFileName}', '${fontWeight}');\r\n`, cb);

			// Добавляем в HTML
			fs.appendFileSync(fontsFileHtml, `<link rel="preload" href="fonts/${fontFileName}.woff2" as="font" type="font/woff2" crossorigin />\r\n`, cb);
		});
	});

	done();
};

export const fonts = () =>
	Gulp.src(path.src.fonts, { encoding: false }).pipe(handleError('Fonts ( ttfToWoff2)')).pipe(ttf2woff2()).pipe(Gulp.dest(path.build.fonts, {}));
