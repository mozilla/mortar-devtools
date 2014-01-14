var gulp = require('gulp');
var through = require('through');


gulp.task('default', function() {
  console.log('hi and bye');

  gulp.src('templates/*')
    .pipe(through(function(file) {

      if(file.isDirectory) {
        console.log(file.path, 'is directory');

        // call build script in that directory
        // collect project/dist/archive.zip file onto our dist/{base}.zip

      }

    }));

});
