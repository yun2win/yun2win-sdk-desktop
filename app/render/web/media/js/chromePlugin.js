function chromePlugin(){
        var index = 1;
        var cb_caches = {};
        var starmark = "$STARTMARK";
        var chromePluginReady = false;

        var onSystemMessage = function (error, data) {
            console.log("~~~~~~" + error);
        };

        var receiveMessage = function (event) {
            if (event.data == "rtcmulticonnection-extension-loaded") {
                chromePluginReady = true;
                console.log(event.data);
            }

            try {
                if (event.data && event.data.indexOf && event.data.indexOf(starmark) != 0)
                    return;

                var data = event.data.substr(starmark.length, event.data.length - starmark.length);

                //alert("chromePlugin.onMessage:"+event.data);
                obj = JSON.parse(data);
                var mindex = obj.index;
                if (mindex <= 0) {
                    onSystemMessage(obj.error, obj.data);
                    return;
                }
                if (cb_caches[mindex]) {
                    cb_caches[mindex](obj.error, obj.data);
                    delete cb_caches[mindex];
                }
            }
            catch (e) { }
        };

        window.addEventListener('message', receiveMessage);

        var postMessage = function (method, parms,cb) {
            var mindex=index++;
            var obj = {
                index: mindex,
                method: method,
                parms: parms || []
            };
            window.postMessage(JSON.stringify(obj),"*");
            if (cb) {
                cb_caches[mindex] = cb;
            } 
        };

        //测试chrome插件是否准备好
        window.postMessage("are-you-there", "*");

            this.req =function (method, parms, cb) {
                postMessage(method, parms, cb);
            }
            this.getReady=function () {
                return chromePluginReady;
            }

        //var mail = context.mail; 
        //return back;
}