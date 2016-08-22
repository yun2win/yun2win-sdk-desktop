var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var app = electron.remote.app;
var path = require('path');
var setTitleBar = require('./js/titlebar');
var name = path.basename(location.pathname, '.html');
delete window.localStorage;
window.localStorage = require('../main/y2w_localstorage');

ipcRenderer.on('log', function (event, data) {
    console.log('log:', data);
});

switch (name) {
    case 'index':
        login();
        break;

    case 'main':
        main();
        break;
}


window.addEventListener("load", function () {
    setTitleBar(document.body);
    $('title').text(app.getName());
});


function login() {
    window.addEventListener("load", function () {
        ipcRenderer.send('autoLogin');
        ipcRenderer.on('autoLogin', function (event, data) {
            $('#email').val(data.username);
            $('#password').val(data.password);
            Login.validate();
        });
    });
}


function main() {
    window.async = require('async');

    window.addEventListener("load", function () {

        var clear = y2w.clearUnRead;
        y2w.clearUnRead = function () {
            clear.apply(this, arguments);
            badgeChanged();
        };

        var render = y2w.tab.userConversationPanel.render;
        y2w.tab.userConversationPanel.render = function () {
            render.apply(this, arguments);
            badgeChanged();
        };

        function badgeChanged() {
            var count = y2w.tab.getUnreadCount();
            ipcRenderer.send("badge-changed", count);
        }
    });

    ipcRenderer.on('download', function (event, data) {
        var a = "a[href='"+data.url+"']";
        $(a).children('.downloading').css({display: data.isDownloading?'block':'none'});
    });
}