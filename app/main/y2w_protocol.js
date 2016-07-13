var config = require('../config');
var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;
var dialog = electron.dialog;


var y2w_protocol = function (cb) {
    if (data) {
        cb(parse(data));

    } else {
        callback = cb;
    }
};


//ipc.on('get-protocol', function (event) {
//    y2w_protocol(function (data) {
//        event.sender.send('get-protocol', data);
//    });
//});


app.setAsDefaultProtocolClient(config.protocol);


var data = "y2w-rtc-quick:userid=c75db5c1-c789-4928-8661-459faddb287a-----name=zs-----token=4aecab8c8c8402ebbb440c934e7b5d413216ebe2-----channelId=b8d97a92-508f-4301-bdc9-f3ccad110e73-----type=video";
var callback = null;
process.argv.forEach(function (arg) {
    if (arg.startsWith(config.protocol)) {
        data = arg;
    }
});


app.on('open-url', function (event, url) {
    data = url;
    if (callback) {
        callback(parse(data));
    }
});


var parse = function (url){
    if (!url)
        return null;

    var data = url.replace(config.protocol + ':', '');
    return data.replace(/-----/g, '&');
};

module.exports = y2w_protocol;