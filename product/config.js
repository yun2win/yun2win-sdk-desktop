var host = require('../app/package.json')['updater-host'];

module.exports = {
    host: host,
    submit: function () {
        return host + '/desktop/submit';
    },
    publishUrl: function () {
        return host + '/desktop/publish';
    }
};