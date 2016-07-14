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

        //parms = {
        //    username: '3@qq.com',
        //    password: '111111'
        //}
        return parms;
    },
    hasUser: function () {
        var parms = argv.getParms();
        return parms.username && parms.password;
    }
};

module.exports = argv;