const path = require('path');
const fs = require('original-fs');


module.exports = {
    css: fs.readFileSync(path.join(__dirname, './base.css'), "utf8"),
    js: fs.readFileSync(path.join(__dirname, './base.js'), "utf8")
};






