const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const applicationMenu = require('./main/y2w_applicationMenu');
const updater = require('./main/y2w_updater');
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


updater.on('did-check', function (current, max) {
    updater.update();

    // dialog.showMessageBox({
    //     type: 'question',
    //     title: '发现新版本',
    //     message: '是否开始更新',
    //     detail: '当前版本: ' + current.version + '\n最新版本: ' + max.version,
    //     buttons: ['取消', '更新']
    // }, function (button) {
    //     if (button == 1) {
    //         updater.update();
    //     }
    // })
});

updater.on('did-update', function () {
    dialog.showMessageBox({
        type: 'question',
        message: '更新完成',
        detail: '是否需要重启程序',
        buttons: ['取消', '重启']
    }, function (button) {
        if (button == 1) {
            updater.restart();
        }
    });
});

updater.on('did-error', function (error) {
    // dialog.showErrorBox('更新失败', JSON.stringify(error));
});