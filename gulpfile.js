'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var spa = require("browser-sync-spa");
var bower = require('gulp-bower');
var stylus = require('gulp-stylus');

gulp.task('serve', function () {
	browserSync.use(spa({
		selector : "[ng-app]" // Only needed for angular apps
	}));

	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});

	gulp.watch("app/**/*").on("change", browserSync.reload);
});

gulp.task('bower', function() {
	return bower();
});

gulp.task('stylus', function(){
	gulp.src('app/stylus/main.styl')
		.pipe(stylus())
		.pipe(gulp.dest('app/css'))
});


gulp.task('watch', function(){
	gulp.watch('app/stylus/*.styl', ['stylus']);
});

gulp.task('default', ['bower', 'stylus', 'serve'])