const electron = require('electron');
const app = electron.app;
const AutoLaunch = require('auto-launch');
const localStorage = require('./y2w_localstorage');

var itemKey = 'needAutoLaunch';
var launcher = {
    autoLauncher: new AutoLaunch({
        name: app.getName()
    }),
    init: function () {
        var needAutoLaunch = localStorage.getItem(itemKey);
        if (needAutoLaunch === null) {
            launcher.setEnable(true);
        }
    },
    isEnable: function () {
        return !!localStorage.getItem(itemKey);
    },
    setEnable: function (enable) {

        localStorage.setItem(itemKey, enable);
        if (enable) {
            launcher.autoLauncher.enable();
        } else {
            launcher.autoLauncher.disable();
        }
    }
};

launcher.init();

module.exports = launcher;
