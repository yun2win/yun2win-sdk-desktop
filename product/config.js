var host = require('../app/package.json')['updater-host'];

module.exports = {
    submit: function () {
        return host + '/desktop/submit';
    },
    publishUrl: function () {
        return host + '/desktop/publish';
    }
};