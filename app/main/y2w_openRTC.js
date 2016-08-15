const childProcess = require('child_process');
const config = require('../config');

module.exports = function (parms, send) {

    // var path = '/Users/qs/Desktop/Y2WRTCQuick.app';

    var path = config.RTCPath;
    var parmList = toParmList(parms);

    openFile(path, parmList);
};


function toParmList(parmsDict) {
    var parmList = [];
    for (var key in parmsDict) {
        parmList.push(key + '=' + parmsDict[key]);
    }
    return parmList;
}


function openFile(path, parmList) {
    var cmd = process.platform === 'darwin' ? 'open' : 'start';
    cmd += ' ' + path + ' --args ' + parmList.join(' ');
    childProcess.exec(cmd);
}


function openApp(path, parmList) {
    var list = [path, '--args'];
    parmList.forEach(function (parm) {
        list.push(parm);
    });

    childProcess.execFile(process.execPath, list);
}