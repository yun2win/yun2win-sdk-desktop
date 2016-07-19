var childProcess = require('child_process');
var config = require('../config');

module.exports = function (parms, send) {
    var path = '/Users/qs/Desktop/Y2WRTCQuick.app';

    path = config.RTCPath;

    var parmList = [];
    for (var key in parms) {
        parmList.push(key + '=' + parms[key]);
    }


    var cmd = process.platform === 'darwin' ? 'open' : 'start';
    cmd += ' ' + path + ' --args ' + parmList.join(' ');

    var child = childProcess.exec(cmd);

    send('log', cmd);
    send('log', child);
};

