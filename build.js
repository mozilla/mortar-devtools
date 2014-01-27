// A build script that doesn't use any task runner.
// Probably a bad idea, but a bad idea that works.

var glob = require('glob');
var q = require('q');
var path = require('path');
var fs = require('fs');
var archiver = require('archiver');
var sha1sum = require('shasum');


function compress(directory, outputPath, doneCallback) {

  var base = path.basename(directory);
  var srcDirectory = directory + '/src/';
  var output = fs.createWriteStream(outputPath);
  var outputSize = 0;
  var zipArchive = archiver('zip');

  // "you should be listening to output's close event.
  // finalize fires when archiver data has been *emitted*,
  // not *consumed* by your destination."
  // from https://github.com/ctalkington/node-archiver/issues/58#issuecomment-32690028
  output.on('close', function() {

    console.log('done with the zip', outputPath);

    // TODO Maybe it's not ideal to read the whole thing again!
    doneCallback(outputSize, sha1sum(fs.readFileSync(outputPath)));

  });

  zipArchive.pipe(output);

  zipArchive.bulk([
    { src: [ '**/*' ], cwd: srcDirectory, expand: true }
  ]);

  zipArchive.finalize(function(err, bytes) {

    if(err) {
      throw err;
    }

    outputSize = bytes;

    console.log('done compressing', base, bytes);

  });

}


function buildProject(projectPath) {

  var deferred = q.defer();
  var base = path.basename(projectPath);
  var filename = base + '.zip';
  var outputPath = 'dist/' + filename;

  compress(projectPath, outputPath, function(compressedSize, sha1sum) {
    deferred.resolve({
      file: filename,
      size: compressedSize,
      sha1: sha1sum
    });
  });

  return deferred.promise;

}


function doneCallback(result) {

  var jsonList = JSON.stringify(result, null, '\t');
  fs.writeFileSync('dist/list.json', jsonList);
  console.log('mortar-devtools built! superYAY!');

}


glob('templates/*', function(err, files) {

  var tasks = [];

  files.forEach(function(f) {
    tasks.push( buildProject(f) );
  });

  q.all( tasks )
    .then(doneCallback);

});

