var ipcRenderer = require('electron').ipcRenderer;
var path = require('path');
var setTitleBar = require('./js/titlebar');
var name = path.basename(location.pathname, '.html');
delete window.localStorage;
window.localStorage = require('../main/y2w_localstorage');


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
});


function login() {
    window.addEventListener("load", function () {
        ipcRenderer.send('get-protocol');
        ipcRenderer.on('get-protocol', function (event, data) {
            $('#email').val(data.username);
            $('#password').val(data.password);
            Login.validate();
        });
    });
}


function main() {
    window.async = require('async');
}