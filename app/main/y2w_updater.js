const electron = require('electron');
const app = electron.app;
const path = require('path');
const util = require('util');
const Emitter = require('events').EventEmitter;
const fs = require('fs');
const fse = require('fs-extra');
const semver = require('semver');
const thenjs = require('thenjs');
const zip = require('cross-zip');
const download = require('./y2w_downloadFile');

var Updater = function () {
    var self = this;
    self.data = {};
    app.on('ready', function () {
        self.check();
    });
};

Updater.prototype.check = function () {
    this.data.currentVersion = semver.clean(app.getVersion());
    this.data.newestVersion = '1.1.10';

    if (semver.lt(this.data.currentVersion, this.data.newestVersion)) {
        this.emit('did-check', this.data);
    }
};

Updater.prototype.update = function () {
    var self = this;
    var newestVersion = self.data.newestVersion;
    var downloadPath = path.join(app.getPath('temp'), app.getName(), 'versions', newestVersion);
    var output = process.resourcesPath;
    var newPath = path.join(output, newestVersion);
    var appPath = path.join(output, 'app');

    thenjs()
        .then(function (cont) {
            download(url, downloadPath, cont);
        })
        .then(function (cont) {
            zip.unzip(downloadPath, output, cont);
        })
        .then(function (cont) {
            if (fs.existsSync(newPath)) {
                fse.remove(appPath, cont);
            }
        })
        .then(function (cont) {
            fs.rename(newPath, appPath, cont);
        })
        .then(function () {
            self.emit('did-update');
        })
        .fail(function (cont, error) {
            self.emit('did-error', error);
        });
};

Updater.prototype.restart = function () {
    app.relaunch();
    app.quit();
};

util.inherits(Updater, Emitter);
module.exports = new Updater();