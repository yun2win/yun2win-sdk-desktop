const electron = require('electron');
const app = electron.app;
const IM = require('./main/y2w_IM');
const im = new IM();

app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {
    im.show();
});

app.on('activate', function () {
    im.show();
});