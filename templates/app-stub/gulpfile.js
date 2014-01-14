var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {

  gulp.src('src/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'));

});
