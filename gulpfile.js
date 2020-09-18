const {
	src,
	dest,
	parallel,
	series,
	watch
} = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imgmin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/', // Путь у файлам
			notify: true, // Увидомления
			// online: false, // Работает без интернета

		}
	})
}

const sctiptsFiles = [
	'node_modules/jquery/dist/jquery.js',
	// 'node_modules/bootstrap/dist/js/bootstrap.js',
	'app/js/src/main.js',
];
const stylesFiles = [
	'app/css/src/reset.css',
	'app/css/src/fonts.css',
	'node_modules/font-awesome/css/font-awesome.css',
	// 'node_modules/bootstrap/dist/css/bootstrap.css',
	'app/css/src/main.scss',
	'app/css/src/media.scss',
];

function scripts() {
	return src(sctiptsFiles)
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(dest('app/js/dest'))
		.pipe(browserSync.stream())
}


function styles() {
	return src(stylesFiles)
		.pipe(sass())
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: true
		}))
		.pipe(cleancss(({
			level: {
				1: {
					specialComments: 0
				}
			}
		})))
		.pipe(dest('app/css/dest'))
		.pipe(browserSync.stream())
}

function images() {
	return src('app/img/src/**/*')
		.pipe(newer('app/img/dest/'))
		.pipe(imgmin())
		.pipe(dest('app/img/dest/'))
}

function fonts() {
	return src([
			'app/fonts/src/**/*',
			'node_modules/font-awesome/fonts/**/*'
		])
		.pipe(dest('app/fonts/dest/'))
}

function cleandest() {
	return del([
		'app/img/dest/**/*',
		'app/js/dest/**/*',
		'app/fonts/dest/**/*',
		'app/css/dest/**/*'
	])
}

function cleandist() {
	return del('dist/**/*')
}

function buildcopy() {
	return src([
			'app/css/dest/**/*',
			'app/js/dest/**/*',
			'app/fonts/dest/**/*',
			'app/img/dest/**/*',
			'app/**/*.html',
		], {
			base: 'app'
		})
		.pipe(dest('dist'));
}

function startwatch() {
	watch('app/css/src/**/*', styles);
	watch(['app/js/src/**/*'], scripts);
	watch('app/**/*.html').on('change', browserSync.reload);
	watch('app/img/src/**/*', images)
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.cleandest = cleandest;
exports.cleandist = cleandist;
exports.buildcopy = buildcopy;
// exports.build = series(cleandist, scripts, styles, images, buildcopy);

// exports.default = parallel(scripts, styles, images, browsersync, startwatch);
exports.default = series(cleandist, scripts, fonts, styles, images, buildcopy, parallel(browsersync, startwatch));