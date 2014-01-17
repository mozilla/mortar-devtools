// A build script that doesn't use any task runner.
// Probably a bad idea, but a bad idea that works.

var glob = require('glob');
var q = require('q');
var path = require('path');
var fs = require('fs');
var archiver = require('archiver');


function compress(directory, outputPath, doneCallback) {
  var base = path.basename(directory);
  var srcDirectory = directory + '/src/';
  var output = fs.createWriteStream(outputPath);
  var zipArchive = archiver('zip');

  output.on('close', function() {
    console.log('done with the zip', outputPath);
    doneCallback();
  });

  zipArchive.pipe(output);

  zipArchive.bulk([
      { src: [ '**/*' ], cwd: srcDirectory, expand: true }
  ]);

  zipArchive.finalize(function(err, bytes) {

    if(err) {
      throw err;
    }

    console.log('done:', base, bytes);

  });

}


function buildProject(projectPath) {
  var deferred = q.defer();
  var base = path.basename(projectPath);
  var outputPath = 'dist/' + base + '.zip';

  compress(projectPath, outputPath, function() {
    deferred.resolve(projectPath);
  });

  return deferred.promise;
}


function doneCallback(result) {
  console.log('mortar-devtools built! superYAY!');
  console.log(result.join('\n'));
}


glob('templates/*', function(err, files) {

  var tasks = [];

  files.forEach(function(f) {
    tasks.push( buildProject(f) );
  });

  q.all( tasks )
    .then(doneCallback);

});

