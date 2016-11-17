var request = require('request');
var version = require('../app/package.json').version;


var url = 'http://localhost:8080/desktop/publish';
console.log('开始发布');

request.post(url, {
    form: {version: version},
    json: true
}, function (error, res, data) {
    if (error) {
        throw error;
    }
    console.info('发布成功');
});