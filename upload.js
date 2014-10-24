var nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

var username = nconf.get('username');
var host = nconf.get('host');
var remote_path = nconf.get('remote-path');
var spawn = require('child_process').spawn;
var glob = require('glob');

// When we use spawn we don't call a shell that does the wildcard expansion for us,
// so we'll use glob to get the expanded list of files
glob('dist/*', function(err, files) {
  if(err) {
    console.log(err);
  } else {
    uploadFiles(files);
  }
});

// scp -R list of files user@host:remote_path
function uploadFiles(files) {

  var scpOptions = [ '-r' ].concat(files).concat(username + '@' + host + ':' + remote_path);

  var scp = spawn('scp', scpOptions);

  console.log('scp options', scpOptions);

  scp.stdout.pipe(process.stdout);

  scp.stderr.pipe(process.stderr);

  scp.on('close', function(code, signal) {
    if(code) {
      console.error('Something went wrong; signal = ' + signal);
    } else {
      console.log('Child process terminated due to receipt of signal ' + signal);
    }
  });

}
