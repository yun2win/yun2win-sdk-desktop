var request = require('request');
var config = require('./config');
var version = require('../app/package.json').version;

console.log('开始发布   host:', config.host);

request.post(config.publishUrl(), {
    form: {version: version},
    json: true
}, function (error, res, data) {
    if (error) {
        throw error;
    }
    if (res.statusCode == 200) {
        console.log('发布成功');
    }
    else {
        console.error(data.message);
    }
});