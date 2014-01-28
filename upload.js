// ~/public_html/mortar_devtools/


var options = require('./config');
var username = options.username;
var host = options.host;
var remote_path = options.remote_path;
var exec = require('child_process').exec;

console.log('upload');
console.log(options);


// scp -R dist/ user@host:remote_path
var scpOptions = ['-r', 'dist/*', username + '@' + host + ':' + remote_path ];

var cmd = ['scp', scpOptions.join(' ')].join(' ');
console.log('cmd', cmd);

exec(cmd, function(error, stdout, stderr) {
  console.log('error?', error);
  console.log('stdout', stdout);
  console.log('stderr', stderr);
});

