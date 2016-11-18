const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const config = require('../config');
const launcher = require('./y2w_autoLauncher');

const IMTray = function (controller) {

    this.controller = controller;
    this.tray = null;
    this.menu = new Menu();
    this.menu.append(new MenuItem({
        label: '开发者工具',
        click: function (item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.toggleDevTools();
        }
    }));
    this.menu.append(new MenuItem({
        label: '开机自启动',
        type: 'checkbox',
        checked: launcher.isEnable(),
        click: function (event) {
            launcher.setEnable(event.checked, function (error, isEnabled) {
                event.checked = isEnabled;
            });
        }
    }));
    this.menu.append(new MenuItem({
        type: 'separator'
    }));
    this.menu.append(new MenuItem({
        label: app.getVersion(),
        enabled: false
    }));
    this.menu.append(new MenuItem({
        type: 'separator'
    }));
    this.menu.append(new MenuItem({
        label: '退出',
        click: app.quit
    }));

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

IMTray.prototype.setTitle = function (title) {
    this.tray.setTitle(title);
};

module.exports = IMTray;
