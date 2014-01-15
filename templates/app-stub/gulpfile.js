var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {

  console.log('app stub gulp!');

  gulp.src('src/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'));

});

module.exports = gulp;
