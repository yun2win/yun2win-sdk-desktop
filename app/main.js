const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;

const y2w_protocol = require('./main/y2w_protocol');
const IM = require('./main/y2w_IM');
const im = new IM();


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    im.show();
});

app.on('activate', function () {
    im.show();
});


ipcMain.on('get-protocol', function (event) {
    event.sender.send('get-protocol', {
        username: '3@qq.com',
        password: '111111'
    });
});