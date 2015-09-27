var test = require('tape');
var directory = require('fs').readdirSync;
var path = require('path');
var spawn = require('child_process').spawn;
var frameworks = require('css-frameworks');

function setup (args, callback) {
    process.chdir(__dirname);

    var timer = process.hrtime();
    var ps = spawn(process.execPath, [
        path.resolve(__dirname, './node_modules/.bin/cssnano')
    ].concat(args));

    var out = '';
    var err = '';

    ps.stdout.on('data', function (buffer) { out += buffer; });
    ps.stderr.on('data', function (buffer) { err += buffer; });

    ps.on('exit', function (code) {
        var completed = process.hrtime(timer);
        var time = Math.round((1000 * completed[0] + completed[1] / 1000000) * 100) / 100;
        callback.call(this, err, time, code);
    });
}

function getPath (framework) {
  return path.resolve(__dirname, './node_modules/css-frameworks/frameworks/' + framework + '.css');
}

Object.keys(frameworks).forEach(function (framework) {
    test('benchmark: ' + framework, function (t) {
        t.plan(1);
        setup([getPath(framework)], function (err, time, code) {
            t.ok(time, 'minified in ' + time + 'ms');
        });
    });
});
