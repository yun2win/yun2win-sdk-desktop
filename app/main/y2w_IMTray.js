const config = require('../config');
const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;


const IMTray = function (controller) {
    this.controller = controller;
    this.tray = null;
    this.menu = Menu.buildFromTemplate([
        //{
        //    label: '刷新',
        //    accelerator: 'CmdOrCtrl+R',
        //    click: function (item, focusedWindow) {
        //        if (focusedWindow)
        //            focusedWindow.reload();
        //    }
        //},
        //{
        //    label: '开发者工具',
        //    accelerator: (function () {
        //        if (process.platform == 'darwin')
        //            return 'Alt+Command+I';
        //        else
        //            return 'Ctrl+Shift+I';
        //    })(),
        //    click: function (item, focusedWindow) {
        //        if (focusedWindow)
        //            focusedWindow.toggleDevTools();
        //    }
        //},
        {label: '退出', click: app.quit}
    ]);

    this.init();
};

IMTray.prototype.init = function () {
    var self = this;

    self.tray = new Tray(config.trayIcon);

    self.tray.on('click', function () {
        self.controller.show();
    });
    self.tray.on('right-click', function () {
        self.tray.popUpContextMenu(self.menu);
    });
};


module.exports = IMTray;
