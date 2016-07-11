const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const inject = require('../inject');
const IMTray = require('./y2w_IMTray');


const IM = function () {
    this.window = null;
    this.tray = null;
    this.isLogged = false;
};


IM.prototype.createWindow = function () {
    var self = this;
    if (self.window) {
        return;
    }

    self.window = new BrowserWindow({
        minWidth: 500,
        minHeight: 500,
        show: false,
        transparent: true,
        titleBarStyle: 'hidden-inset',
        useContentSize: true,
        webPreferences: {
            webSecurity: false
        }
    });

    //self.window.on('close', function (event) {
    //    if (self.window.isVisible()) {
    //        event.preventDefault();
    //        self.window.hide();
    //    }
    //});
    self.window.on('closed', function (event) {
        self.window = null;
    });
    self.window.webContents.on('did-start-loading', function () {
        self.resizeWindow();
    });
    self.window.webContents.on('did-finish-load', function (event) {
        self.resizeWindow();
    });
    self.window.webContents.on('dom-ready', function (event) {
        event.sender.insertCSS(inject.css);
        event.sender.executeJavaScript(inject.js);
    });

    self.window.loadURL('file://' + __dirname + '/../render/web/index.html');
    //self.window.webContents.openDevTools();
    this.createTray();
};

IM.prototype.resizeWindow = function () {
    var self = this;
    var canResizable = false;
    var size = {width: 0, height: 0};

    switch (path.basename(self.window.webContents.getURL(), '.html')) {
        case 'index':
            size = {width: 350, height: 495};
            break;

        case 'register':
            size = {width: 350, height: 495};
            break;

        case 'main':
            canResizable = true;
            size = {width: 980, height: 580};
            break;
    }
    this.window.setResizable(canResizable);
    this.window.setSize(size.width, size.height);
    this.window.center();
    this.window.show();
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
