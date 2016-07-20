const electron = require('electron');
const app = electron.app;
const AutoLaunch = require('auto-launch');
const localStorage = require('./y2w_localstorage');
const itemKey = 'needAutoLaunch';

var launcher = {};

launcher.init = function () {
    function getAppPath() {
        switch (process.platform) {
            case 'darwin':
                return app.getAppPath().split('/Contents/Resources')[0];

            case 'linux':
            // todo

            case 'win32':
                return app.getPath('exe');

            default:
                throw 'launcher.init';
        }
    }

    launcher.autoLauncher = new AutoLaunch({
        name: app.getName(),
        path: getAppPath()
    });

    var needAutoLaunch = localStorage.getItem(itemKey);
    if (needAutoLaunch === null) {
        needAutoLaunch = true;
    }
    launcher.setEnable(needAutoLaunch);
};

launcher.isEnable = function () {
    return !!localStorage.getItem(itemKey);
};

launcher.setEnable = function (enable, cb) {
    var promise = null;
    if (enable) {
        promise = launcher.autoLauncher.enable();
    } else {
        promise = launcher.autoLauncher.disable();
    }

    promise
        .then(function () {
            launcher.autoLauncher.isEnabled()
                .then(function (isEnabled) {
                    localStorage.setItem(itemKey, isEnabled);
                    cb(null, isEnabled);
                })
                .catch(function (error) {
                    cb(error);
                });
        })
        .catch(function (error) {
            cb(error);
        });
};

launcher.init();

module.exports = launcher;
