const app = require('electron').app || require('electron').remote.app;
const Storage = require('dom-storage');
const fs = require('fs');

var localStorage = new Storage(app.getPath('userData') + '/db.json', {strict: false, ws: '  '});

module.exports = localStorage;