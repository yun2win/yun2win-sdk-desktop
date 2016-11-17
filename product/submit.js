var fs = require('fs');
var request = require('request');
var version = require('../app/package.json').version;

console.log('开始提交');

var data = {
    version: version,
    log: '',
    file: fs.createReadStream(__dirname + '/dist/' + version + '.zip')
};

request.post({url: 'http://localhost:8080/desktop/submit', formData: data}, function (error, res, data) {
    if (error) {
        throw error;
    }
    if (res.statusCode == 200) {
        console.log('提交成功');
    }
    else {
        console.error(JSON.parse(data).message);
    }
});