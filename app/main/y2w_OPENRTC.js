var childProcess = require('child_process');
var config = require('../config');

module.exports = function (parms) {
    var path = '/Users/qs/Desktop/Y2WRTCQuick.app';

    path = config.RTCPath;

    var parmList = [];
    for (var key in parms) {
        parmList.push(key + '=' + parms[key]);
    }
    childProcess.exec('open ' + path + ' --args ' + parmList.join(' '));
};

