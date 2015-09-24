'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var spa = require("browser-sync-spa");
var bower = require('gulp-bower');

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
	return bower()
		.pipe(gulp.dest('lib/'))
});

gulp.task('default', ['bower','serve'])