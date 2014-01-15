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
        console.log(projectGulp);


        var cwd = process.cwd();

        // call build script in that directory
        process.chdir(file.path);
        require(projectGulp).run('default');
        process.chdir(cwd);
        console.log('done with ' + projectGulp);
        
        // TODO collect project/dist/archive.zip file onto our dist/{base}.zip
        gulp.src(file.path + '/dist/archive.zip')
          .pipe(rename(projectBasename + '.zip'))
          .pipe(gulp.dest('dist'));
      }

    }));

});
