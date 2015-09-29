var gulp=require('gulp');
var usemin=require('gulp-usemin');
var uglify=require('gulp-uglify');
var minifyCss=require('gulp-minify-css');

var replace = require('gulp-replace');
var header = require('gulp-header');

gulp.task('default', function() {
   gulp.src(['dev/*.html'], {base: 'dev'})
   	.pipe(usemin())
    .pipe(gulp.dest('deploy'));
   
   gulp.src(['dev/assets/enchant/**/*'], {base: 'dev'})
   	.pipe(gulp.dest('deploy'));
});
