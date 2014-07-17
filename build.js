// A build script that doesn't use any task runner.
// Probably a bad idea, but a bad idea that works.

var glob = require('glob');
var q = require('q');
var path = require('path');
var fs = require('fs');
var archiver = require('archiver');
var sha1sum = require('shasum');
var copyFile = require('fast-copy-file');
var config = require('./config');
var distDir = 'dist';

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

    // TODO it's probably not ideal to read the whole thing again!
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


// We're actually using the manifest.webapp file to get metadata about each template
function readMetadata(projectPath) {

  var metaPath = path.join(projectPath, 'src', 'manifest.webapp');
  console.log('using:', projectPath, metaPath);

  var metadata = {};

  if(fs.existsSync(metaPath)) {
    try {
      var data = fs.readFileSync(metaPath);
      metadata = JSON.parse(data);
    } catch(e) {
      console.error("Invalid JSON file", metaPath);
    }
  }

  return metadata;
}


function buildProject(projectPath, remotePath) {

  var deferred = q.defer();
  var base = path.basename(projectPath);
  var zipFilename = base + '.zip';
  var outputPath = path.join(distDir, zipFilename);
  var iconFilename = base + '.png';
  var srcIcon = path.join(projectPath, 'icon.png');
  var dstIcon = path.join(distDir, iconFilename);

  compress(projectPath, outputPath, function(compressedSize, sha1sum) {

    var projectMetadata = readMetadata(projectPath);
    var name = projectMetadata.name || base;
    var description = projectMetadata.description || '';

    console.log('ICON:', srcIcon, '->', dstIcon);

    copyFile(srcIcon, dstIcon, function(err) {

      if(err) {
        console.log('error copying file', err);
        deferred.reject();
        return;
      }

      deferred.resolve({
        file: remotePath + zipFilename,
        icon: remotePath + iconFilename,
        size: compressedSize,
        sha1: sha1sum,
        name: name,
        description: description
      });

    });

  });

  return deferred.promise;

}


function writeListOfTemplates(result) {

  var jsonList = JSON.stringify(result, null, '\t');
  fs.writeFileSync('dist/list.json', jsonList);
  console.log('mortar-devtools built! superYAY!');
  console.log(jsonList);

}

// ---

if(!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

glob('templates/*', function(err, files) {

  var tasks = [];
  var remotePath = config.remote_directory;

  if(remotePath[ remotePath.length - 1 ] !== '/') {
    remotePath += '/';
    console.error('Woops, remotePath does not end with /, it was automatically corrected.');
  }

  files.forEach(function(f) {
    tasks.push( buildProject(f, remotePath) );
  });

  q.all( tasks )
    .then(writeListOfTemplates);

});

