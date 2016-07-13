const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const inject = require('../inject/config');
const IMTray = require('./y2w_IMTray');
const localStorage = require('./y2w_localstorage');


const IM = function () {
    this.window = null;
    this.tray = null;
};


IM.prototype.createWindow = function () {
    var self = this;
    if (self.window) {
        return;
    }

    self.window = new BrowserWindow({
        show: false,
        frame: false,
        transparent: true,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, '../inject/index.js')
        }
    });


    self.window.on('closed', function () {
        self.window = null;
    });
    self.window.webContents.on('did-finish-load', function () {
        self.resizeWindow();
    });
    self.window.webContents.on('dom-ready', function (event) {
        event.sender.insertCSS(inject.css);
    });
    //self.window.webContents.openDevTools();

    this.load();
    this.createTray();
};

IM.prototype.resizeWindow = function () {
    var self = this;
    var isMain = false;
    var size = {width: 0, height: 0};
    var minSize = {width: 0, height: 0};

    switch (path.basename(self.window.webContents.getURL(), '.html')) {
        case 'index':
            minSize = size = {width: 350, height: 495};
            break;

        case 'register':
            minSize = size = {width: 350, height: 495};
            break;

        case 'main':
            isMain = true;
            size = {width: 980, height: 580};
            minSize = {width: 500, height: 495};
            break;
    }
    //size = {width: 980, height: 495};

    this.window.setResizable(isMain);
    this.window.setFullScreenable(isMain);
    this.window.setMaximizable(isMain);
    this.window.setMinimumSize(minSize.width, minSize.height);
    this.window.setContentSize(size.width, size.height, true);
    //this.window.center();
    this.window.show();
};

IM.prototype.isLogged = function () {
    localStorage.removeItem('y2wIMCurrentUserId');
    return !!localStorage.getItem('y2wIMCurrentUserId');
};

IM.prototype.load = function () {
    var name = this.isLogged() ? 'main' : 'index';
    this.window.loadURL('file://' + __dirname + '/../render/web/' + name + '.html');
};

IM.prototype.createTray = function () {
    if (this.tray) {
        return;
    }
    this.tray = new IMTray(this);
};

IM.prototype.show = function () {
    if (!this.window) {
        return this.createWindow();
    }
    this.window.show();
};

IM.prototype.hide = function () {
    this.window.hide();
};

module.exports = IM;
