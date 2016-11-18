const path = require('path');


var config = {
    trayIcon: path.join(__dirname, 'assets/osx/icon.png')
};

if (process.platform === 'darwin') {
    config.isMac = true;
    config.RTCPath = path.join(process.resourcesPath, 'Y2WRTCQuick/Y2WRTCQuick.app')
}
else {
    config.isWin = true;
    config.RTCPath = path.join(process.resourcesPath, 'Y2WRTCQuick/Y2WRTCQuick.exe')
}

module.exports = config;