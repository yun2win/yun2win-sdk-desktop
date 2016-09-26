module.exports = function (node) {
    var electron = require('electron');
    var remote = electron.remote;

    require('titlebar')()
        .appendTo(node)
        .on('close', function () {
            remote.getCurrentWindow().hide();
        })
        .on('minimize', function () {
            var win = remote.getCurrentWindow();
            if (!win.isFullScreen()) {
                win.minimize();
            }
        })
        .on('fullscreen', function () {
            var win = remote.getCurrentWindow();
            if (win.isFullScreenable()) {
                win.setFullScreen(!win.isFullScreen())
            }
        })
        .on('maximize', function () {
            var win = remote.getCurrentWindow();
            if (win.isMaximizable()) {
                win.isMaximized() ? win.unmaximize() : win.maximize();
            }
        });
};