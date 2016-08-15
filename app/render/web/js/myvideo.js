window.onload = function () {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    var dataId = theRequest["channelSign"];
 
   var sUserAgent = navigator.userAgent;
    //parseFloat 运行时逐个读取字符串中的字符，当他发现第一个非数字符是就停止  
   var appVersion = navigator.appVersion;
   var index = appVersion.indexOf('Chrome/');
   var sub = appVersion.substring(index+7);
   var fAppVersion = parseFloat(sub);
   if (fAppVersion < 49) {
       alert('您的浏览器版本太低！为了不影响您的视频聊天，请升级到最新版本');
   }
    //document.getElementById("iframe_videoaudio").src = "https://av-api.liyueyun.com/media/?channelSign=" + dataId;
   document.getElementById("iframe_videoaudio").src = "media?channelSign=" + dataId;
 
}








