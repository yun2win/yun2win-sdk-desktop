const path = require('path');


var mac = {
    trayIcon: path.join(__dirname, 'assets/osx/icon.png'),
    RTCPath: path.join(process.resourcesPath, 'Y2WRTCQuick/Y2WRTCQuick.app')
};

var win = {
    trayIcon: path.join(__dirname, 'assets/osx/icon.png'),
    RTCPath: path.join(process.resourcesPath, 'Y2WRTCQuick/Y2WRTCQuick.exe')
};

module.exports = process.platform === 'darwin' ? mac : win;