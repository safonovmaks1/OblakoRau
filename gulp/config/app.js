const isProd = process.argv.includes('--production');
const isDev = !isProd;

export default {
	isProd,
	isDev,

	server: {
		livereload: true,
		open: true,
	},

	file_include: {
		prefix: '@@',
		basepath: '@file',
	},

	typograf: {
		locale: ['ru', 'en-US'],
		htmlEntity: { type: 'digit' },
		safeTags: [
			['<\\?php', '\\?>'],
			['<no-typography>', '</no-typography>'],
		],
	},

	v_number: {
		value: '%DT%',
		append: {
			key: '_v',
			cover: 0,
			to: ['css', 'js'],
		},
		output: 'gulp/version.json',
	},

	html_min: {
		collapseWhitespace: isProd,
		removeComments: isProd,
		removeEmptyAttributes: isProd,
		removeScriptTypeAttributes: isProd,
		removeStyleLinkTypeAttributes: isProd,
	},

	autoprefixer: {
		grid: true,
		cascade: false,
	},

	clean_css: {
		level: 2,
	},

	webpack: {
		mode: isProd ? 'production' : 'development',
		devtool: false,
		entry: {
			index: './src/js/main.js',
		},
		output: {
			filename: '[name].bundle.js',
			// filename: "script.js",
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
	},

	svg_symbol: {
		mode: {
			symbol: {
				sprite: '../sprite.symbol.svg',
			},
		},
		shape: {
			transform: [
				{
					svgo: {
						js2svg: { indent: 4, pretty: true },
						plugins: [
							{
								name: 'removeAttrs',
								params: {
									attrs: '(fill|stroke)',
								},
							},
						],
					},
				},
			],
		},
	},
};
