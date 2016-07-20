var argv = {
    getParms: function getParms() {
        var parms = {};
        process.argv.forEach(function (arg) {
            if (arg.indexOf('=') > -1) {
                var parm = arg.split('=');
                if (parm.length == 2) {
                    parms[parm[0]] = parm[1];
                }
            }
        });
        return parms;
    },
    hasParms: function () {
        var parms = argv.getParms();
        return parms.username && parms.password;
    }
};

module.exports = argv;