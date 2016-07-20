const electron = require('electron');
const app = electron.app;
const applicationMenu = require('./main/y2w_applicationMenu');
const IM = require('./main/y2w_IM');
const im = new IM();


app.on('will-finish-launching', function () {

});

app.on('ready', function () {
    im.show();
    applicationMenu.init();
});

app.on('activate', function () {
    im.show();
});

app.on('window-all-closed', function () {
    app.quit();
});