const path = require('path');
const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;


const IMTray = function (controller) {
    this.controller = controller;
    this.tray = null;
    this.menu = Menu.buildFromTemplate([
        {label: '退出', click: app.quit}
    ]);

    this.init();
};

IMTray.prototype.init = function () {
    var self = this;

    self.tray = new Tray(path.join(__dirname, '../assets/osx/installer.png'));

    self.tray.on('click', function () {
        self.controller.show();
    });
    self.tray.on('right-click', function () {
        self.tray.popUpContextMenu(self.menu);
    });
};


module.exports = IMTray;
