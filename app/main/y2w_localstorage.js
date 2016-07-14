const app = require('electron').app || require('electron').remote.app;
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage(app.getPath('temp'));

module.exports = localStorage;