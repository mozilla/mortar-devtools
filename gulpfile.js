var gulp = require('gulp');
var through = require('through');
var rename = require('gulp-rename');
var path = require('path');

gulp.task('default', function() {

  gulp.src('templates/*')
    .pipe(through(function(file) {

      if(file.isDirectory) {

        var projectGulp = file.path + '/gulpfile.js';
        var projectBasename = path.basename(file.path);
        var cwd = process.cwd();

        console.log('PROCESSING ' + projectBasename);
        
        // Call each project's build script, but change to its directory first
        // Otherwise gulp won't find the files we want it to process!
        process.chdir(file.path);
        require(projectGulp).run('default');
        process.chdir(cwd);
        
        // Now collect project/dist/archive.zip file onto our dist/{base}.zip
        gulp.src(file.path + '/dist/archive.zip')
          .pipe(rename(projectBasename + '.zip'))
          .pipe(gulp.dest('dist'));
      }

    }));

});
