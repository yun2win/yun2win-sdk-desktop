const electron = require('electron');
const app = electron.app;
const url = require('url');
const path = require('path');
const util = require('util');
const Emitter = require('events').EventEmitter;
const fs = require('fs');
const fse = require('fs-extra');
const semver = require('semver');
const request = require('request');
const thenjs = require('thenjs');
const zip = require('cross-zip');
const plist = require('simple-plist');
const download = require('./y2w_downloadFile');
const host = require('../package.json')['updater-host'];

var Updater = function () {
    var self = this;
    self.url = host + '/desktop/check';
    self.current = {version: semver.clean(app.getVersion())};
    self.updated = false;
    app.on('ready', function () {
        self.check();
    });
    // 定时检查更新,如果更新完成变为定时提醒重启
    setInterval(function () {
        if (self.updated) {
            self.emit('did-update');
        }
        else {
            self.check();
        }
    }, 1000 * 60 * 60 * 6);
};

Updater.prototype.check = function () {
    var self = this;

    thenjs()
        .then(function (cont) {
            request.post(self.url, {
                form: {version: self.current.version},
                json: true
            }, cont);
        })
        .then(function (cont, httpResponse, body) {
            self.max = body.maxVersion;
            if (self.max && semver.lt(self.current.version, self.max.version)) {
                self.emit('did-check', self.current, self.max);
            }
        })
        .fail(function (cont, error) {
            self.emit('did-error', error);
        });
};

Updater.prototype.update = function () {
    var self = this;
    var maxVersion = self.max.version;
    var downloadPath = path.join(app.getPath('temp'), app.getName(), 'versions', maxVersion);
    var output = process.resourcesPath;
    var newPath = path.join(output, maxVersion);
    var appPath = path.join(output, 'app');
    var plistPath = path.join(output, '..', 'Info.plist');

    thenjs()
        .then(function (cont) {
            if (downloadPath) {
                fse.remove(downloadPath, cont);
            }
            else {
                cont();
            }
        })
        .then(function (cont) {
            download(self.max.url, downloadPath, cont);
        })
        .then(function (cont) {
            zip.unzip(downloadPath, output, cont);
        })
        .then(function (cont) {
            if (fs.existsSync(newPath))
                fse.remove(appPath, cont);
        })
        .then(function (cont) {
            fs.rename(newPath, appPath, cont);
        })
        .then(function (cont) {
            if (!fs.existsSync(plistPath)) {
                return cont();
            }
            var data = plist.readFileSync(plistPath);
            data.CFBundleShortVersionString = self.max.version;
            data.CFBundleVersion = data.CFBundleShortVersionString;
            plist.writeFile(plistPath, data, cont);
        })
        .then(function () {
            self.updated = true;
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