var gulp = require('gulp'),

	// general
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
	rename = require('gulp-rename')
	concat = require('gulp-concat'),
	notify = require("gulp-notify"),
	browserSync = require('browser-sync').create(),
	plumber = require('gulp-plumber'),

	// styles
	sass = require('gulp-sass'),
	scsslint = require('gulp-scss-lint'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
	globbing = require('gulp-css-globbing'),

	// scripts
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify');


 //**************
// ERROR HANDLER

function onError(err) {
	console.log(err);
	notify().write(err)
	this.emit('end');
};


 //******
// TASKS

gulp.task('scss', function () {

	return gulp.src('./assets/scss/*.scss')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(globbing({ extensions: ['.scss'] }))
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('assets/css'))
		.pipe(concat('styles.min.css'))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('assets/css'))
		.pipe(livereload())
		.pipe(notify("Sass Compiled"));

});

gulp.task('js', function () {

	return gulp.src('assets/js/main.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('assets/js/'))
		.pipe(livereload());

});

gulp.task('markup', function () {

	return gulp.src('styleguide/templates/**/**/*.php')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(livereload());

});

gulp.task('scss:bs', function () {

	return gulp.src('./assets/scss/*.scss')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(globbing({ extensions: ['.scss'] }))
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('assets/css'))
		.pipe(browserSync.reload({stream: true}))
		.pipe(concat('styles.min.css'))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('assets/css'))
		.pipe(livereload())
		.pipe(notify("Sass Compiled"));

});

gulp.task('bs', function () {

	browserSync.init({
		proxy: "dev.frontendboilerplate.com",
		host: "localhost"
	});

	gulp.watch('assets/scss/**/*.scss', ['scss:bs']);
	gulp.watch("./*.html").on('change', browserSync.reload);

});


 //******
// WATCH

gulp.task('default', ['watch']);

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('styleguide/templates/**/**/*.php', ['markup', 'modernizr']);
	gulp.watch('assets/scss/**/*.scss', ['scss', 'modernizr']);
	gulp.watch('assets/js/*.js', ['js', 'modernizr']);
});


var modernizr = require('gulp-modernizr');

gulp.task('modernizr', function() {
  gulp.src('assets/js/main.js')
    .pipe(modernizr())
    .pipe(uglify())
    .pipe(gulp.dest("assets/js/libs/"))
});
