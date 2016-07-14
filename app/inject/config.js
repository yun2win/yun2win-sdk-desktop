const path = require('path');
const fs = require('original-fs');


module.exports = {
    css: fs.readFileSync(path.join(__dirname, './css/base.css'), "utf8")
};