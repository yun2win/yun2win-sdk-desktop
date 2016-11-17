var version = require('../app/package.json').version;
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

console.log('开始打包');

var output = fs.createWriteStream(path.join(__dirname, 'dist', version + '.zip'));
var archive = archiver('zip', {zlib: {level: 9}});

output.on('close', function () {
    console.log('打包完成');
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);
archive.directory(path.join(__dirname, '..', 'app'), version);
archive.finalize();