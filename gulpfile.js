var gulp = require('gulp');
var through = require('through');


gulp.task('default', function() {

  gulp.src('templates/*')
    .pipe(through(function(file) {

      if(file.isDirectory) {

        var projectGulp = file.path + '/gulpfile.js';
        console.log(projectGulp);

        // call build script in that directory
        require(projectGulp).run('default');
        console.log('done with ' + projectGulp);
        
        // TODO collect project/dist/archive.zip file onto our dist/{base}.zip
        
      }

    }));

});
