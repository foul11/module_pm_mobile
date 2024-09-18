/* eslint-disable no-unused-vars */

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const fileinclude = require("gulp-file-include");
// @ts-ignore
const inlineimg = require('gulp-inline-image-html');

const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(2));

let watching = false;
function isDev(){
	return watching ? true : false;
}

const pubFolder = path.join(__dirname, './dist');
const webpackConfigGen = require('./webpack.config');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevMiddleware = require('webpack-dev-middleware');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const tasks = {
	build(){
		return gulp.src(['src/**/*.{js,jsx}', '!src/**/_ignore/**'])
			.pipe(plumber()) // @ts-ignore
			.pipe(webpackStream(webpackConfigGen(isDev(), argv, pubFolder), webpack))
			.pipe(gulpIf(function(file) { return !/\.map$/g.exec(file.basename); },
				gulp.dest(`${pubFolder}`)
			))
	},
	
	browserSync() {
		const webpackConfig = webpackConfigGen(isDev(), argv, pubFolder);
		const bundler = webpack(webpackConfig);
		
		browserSync.init({
			cors: true,
			// https: {
				// cert: require('./config.cjs').server.CertFullChain,
				// key: require('./config.cjs').server.CertPrivateKey,
			// },
			socket: {
				// domain: require('./config.cjs').FrontendURL,
			},
			server: {
				baseDir: 'public',
				index: 'index.html',
				middleware: [
					require('./etags_cache')(),
					
					function (req, res, next) {
						// @ts-ignore
						res.etagify();
						
						// @ts-ignore
						if (!req.url.match(/^\/(assets|api)\//)) {
							req.url = '/';
						}
						
						next();
					},
					
					webpackDevMiddleware(bundler, {
						stats: { colors: true },
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
							"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
						},
					}),
				],
			}
		}, (err) => { if (err) { console.log(err) } });
	},
	
	htmlCompile(){
		return gulp.src('src/html/**/*.html')
			.pipe(gulpIf(!isDev(), inlineimg()))
			.pipe(fileinclude({
				prefix: "@@",
				basepath: "@root",
				context: {
					__DEV__: isDev(),
				},
			}))
			.pipe(gulp.dest(`${pubFolder}/`))
			.pipe(reload({ stream: true }))
	},
	
	watch(){
		watching = true;
		
		gulp.watch(['src/**/*.{js,jsx,less}', './config.cjs'], (complite) => { reload(); complite(); } );
		
		tasks.browserSync();
	}
}

exports.default	= gulp.series(tasks.build);

exports.build		= tasks.build;
exports.watch		= tasks.watch;
