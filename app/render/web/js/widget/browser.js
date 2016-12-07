

var Browser=function(){

    this.dom=$("#browserpanel");

    this.over=this.dom.find(".browser-over");

    this.toolbar=this.dom.find(".toolbar");
    this.btnBack=this.dom.find(".btn_back");
    this.btnClose=this.dom.find(".btn_close");
    this.lblname=this.dom.find(".name");
    this.btns=this.dom.find("#otherBtns");
    this.downbtns=this.dom.find("#downBtns");
    this.defaultBtn=this.dom.find("#defaultBtns");

    this.iframe = this.dom.find("iframe");
    this.btnClose.on("click",this.hide.bind(this));
    this.btnBack.on("click",this.back.bind(this));

    this.history = [];
    this.connect = new ActionConnect(this,this.iframe[0].contentWindow);
    this.color = {bg:"#fff",font:"#666",hoverbg:"#eee"};
    this.image = this.dom.find('#browserImage');
    this.file = this.dom.find("#browserFile");
    this.browserMask = $("#browserMask");
    this._initEvent();

};

y2wInherits(Browser, EventEmitter);

Browser.prototype._initEvent=function(){
    var that=this;
    this.btnClose.on("click",that.hide.bind(that));
    this.toolbar.find(".hoverBtn").on('mouseenter',function(e){
        $(this).css("background-color",that.color.hoverbg);
    }).on('mouseleave',function(e){
        $(this).css("background-color","transparent");
    });

    var clickEvent=function(e){
        var evt = e || window.event,
            target = evt.srcElement || evt.target;

        var t=$(target);
        if(!t.attr("class") || t.attr("class").indexOf("hoverBtn")<0){
            t=$(target).parents(".hoverBtn");
        }

        var data= t.attr("data-menu");
        try {
            var obj = JSON.parse(data);
            that.connect.request("onMenuClick", obj);
        }catch(ex){
            //console.error(ex);
        }
    };
    this.btns.on('click',clickEvent);
    this.downbtns.on('click',function(e){
        clickEvent(e);
        that.downbtns.addClass("hide");
        if(that.downbtnOver)
            that.downbtnOver.remove();
    });

    this.image.on('change', function(){
        var file = that.image[0].files[0];
        if(!file)
            return;
        if(file.size==0) {
            alert("不能传空文件");
            return;
        }

        //如此便可重复多次上传同一份文件
        that.image.val("");

        //上传图片
        var fileName = guid() + '.png';
        that.uploadImage(fileName, file, function(err, result){
            that.emit('uploadFileComplete', err, result);
        })
    });

    setInterval(function(){
        var span=that.over.find("span");
        that.__time=(that.__time||0);
        that.__time++;

        if(that.__time>=4)
            that.__time=0;

        var txt="正在加载";
        for(var i=0;i<that.__time;i++)
            txt+=".";

        span.text(txt);
    },1000);

    this.file.on('change', function(){
        var file = that.file[0].files[0];
        if(!file)
            return;
        if(file.size==0) {
            alert("不能传空文件");
            return;
        }

        //如此便可重复多次上传同一份文件
        that.file.val("");

        var ext = '';
        var name = '';
        if(file.name.lastIndexOf('.') >= 0) {
            ext = file.name.substr(file.name.lastIndexOf('.') + 1);
            name = file.name.substr(0, file.name.lastIndexOf('.'));
        }
        else
            name = file.name;
        //上传文件
        var fileName = guid() + (ext.length > 0 ? '.' + ext : '');
        that.uploadFile(fileName, file, name, ext, file.size, function(err, result){
            that.emit('uploadFileComplete', err, result);
        })
    });
};

Browser.prototype.uploadImage = function(fileName, file, cb){
    //开启遮罩
    this.browserMask.removeClass('hide');
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = this.onImageLoadSuccess.bind(this, fileName, cb);
    fileReader.onerror = this.onImageLoadError.bind(this, cb)
}

Browser.prototype.onImageLoadSuccess = function(fileName, cb, e){
    currentUser.attchments.uploadBase64Image(fileName, e.target.result, function(err, data) {
        if (err)
            cb('image upload err:' + err);

        else {
            var src = 'http://im.yun2win.com/v1/';
            src += 'attachments/' + data.id + '/' + data.md5;
            cb(null, [{
                url: src,
                thumbnailUrl: src
            }]);
        }
    })
}

Browser.prototype.onImageLoadError = function(cb){
    cb('image load error');
}

Browser.prototype.uploadFile = function(fileName, file, name, ext, size, cb){
    //开启遮罩
    this.browserMask.removeClass('hide');
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = this.onFileLoadSuccess.bind(this, fileName, name, ext, size, cb);
    fileReader.onerror = this.onFileLoadError.bind(this, cb)
}

Browser.prototype.onFileLoadSuccess = function(fileName, name, ext, size, cb, e){
    currentUser.attchments.uploadBase64("application/octet-stream", fileName, e.target.result, function(err, data) {
        if (err)
            cb('file upload err:' + err);
        else {
            var src = 'http://im.yun2win.com/v1/';
            src += 'attachments/' + data.id + '/' + data.md5;
            cb(null, [{
                url: src,
                name: name,
                ext: ext,
                size: size,
                time: data.createdAt
            }]);
        }
    })
};

Browser.prototype.onFileLoadError = function(cb){
    cb('file load error');
};

Browser.prototype.open=function(url,over){
    if(!url)
        return;

    if(y2w.dev)
        url=url.replace("enterprise.yun2win.com","127.0.0.1:8080");

    if(this.cUrl==url)
        return;

    if(over)
        this.over.removeClass("hide");

    this.history=[];
    this.defaultBtn.removeClass("hide").find("a").attr("href",url);
    this.toolbar.css("background-color","#fff").css("color","#666");
    this.color = { bg:"#fff", font:"#666", hoverbg:"#eee" };
    this.lblname.text(url);
    this.changeUrl(url);
    this.cUrl=url;
};
Browser.prototype.show=function(){
    this.dom.removeClass("hide");

    this.btnBack.addClass("hide");
    this.btnClose.addClass("hide");
    if(!this.history)
        return;

    this.btnClose.removeClass("hide");
    if(this.history.length>1)
        this.btnBack.removeClass("hide");

};
Browser.prototype.hide=function(){
    this.dom.addClass("hide");
    this.iframe.attr("src","");
    this.cUrl=null;
};
Browser.prototype.back=function(){
    var url= this.history.pop();
    url=this.history.pop();
    this.changeUrl(url);
};
Browser.prototype.didShow=function(cb){
    this.over.addClass("hide");
};
Browser.prototype.changeUrl=function(url){
    if(!url)
        return;
    url= $.trim(url);
    if(url=="")
        return;
    if(url.indexOf("http")!=0)
        url="http://"+url;

    this.history.push(url);
    this.iframe.attr("src",url);
    this.btns.empty();
    this.show();
};
Browser.prototype.openNew=function(url){
    this.changeUrl(url);
};
Browser.prototype.changeTitle=function(title,cb){
    this.lblname.text(title);
    cb();
};
Browser.prototype.changeToolbarColor=function(bgcolor,hoverbgcolor,fontColor,cb){
    this.color.bg=bgcolor;
    this.color.hoverbg=hoverbgcolor;
    this.color.font=fontColor;
    this.toolbar.css("background-color",bgcolor).css("color",fontColor);
    this.downbtns.css("background-color",bgcolor);
    cb();
};
Browser.prototype.setMenus=function(menus,cb){
    var that=this;
    this.btns.empty();
    this.downbtns.empty();
    var showMenuCount=1;
    if(menus.length>showMenuCount) {
        $("<div data-menu='' class='opbtn'><i class='iconfont'>&#xe600;</i></div>").appendTo(this.btns)
            .on('mouseenter', function (e) {
                $(this).css("background-color", that.color.hoverbg);
            }).on('mouseleave', function (e) {
                $(this).css("background-color", "transparent");
            })
            .on('click',function(){

                that.downbtns.removeClass("hide");
                that.downbtnOver=$("<div class='downbtnOver' />").appendTo(that.toolbar).click(function(){
                    that.downbtnOver.remove();
                    that.downbtns.addClass("hide");
                });

            });
    }
    for(var i=0;i<menus.length;i++){

        var parentBtns=this.btns;
        if(menus.length>showMenuCount && i>0)
            parentBtns=this.downbtns;

        var menu=menus[i];
        var d=$("<div data-menu='"+JSON.stringify(menu)+"' class='opbtn hoverBtn'></div>")
            .appendTo(parentBtns)
            .on('mouseenter',function(e){
                $(this).css("background-color",that.color.hoverbg);
            }).on('mouseleave',function(e){
                $(this).css("background-color","transparent");
            });
        if(menu.type=='icon'){
            $("<img/>").attr("src",menu.iconSrc).appendTo(d);
        }
        else if(menu.type=='iconText'){
            $("<img/>").attr("src",menu.iconSrc).appendTo(d);
            $("<span>"+menu.name+"</span>").appendTo(d);
        }
        else{
            $("<span>"+menu.name+"</span>").appendTo(d);
        }
        if(i!=menus.length-1)
            $("<div class='split'></div>").appendTo(this.btns);
    }
    this.defaultBtn.addClass("hide");
    cb();
};
Browser.prototype.getCurrentUser=function(cb){
    if(currentUser) {
        var uobj = currentUser.toJSON();
        var obj={
            id: uobj.id,
            name: uobj.name,
            //pinyin: uobj.pinyin,
            account: uobj.account,
            avatarUrl: currentUser.getAvatarUrl(),
            //role: uobj.role,
            //jobTitle: uobj.jobTitle,
            //phone: uobj.phone,
            //address: uobj.address,
            //status: uobj.status,
            //createdAt: uobj.createdAt,
            //updatedAt: uobj.updatedAt
        };
        
        return cb(null, obj);
    }
    cb("无当前用户");
};
Browser.prototype.chooseDate=function(time, defaultTime, position, cb){
    var format = 'yyyy-MM-dd';
    if(time)
        format = 'yyyy-MM-dd HH:mm';
    $('#d123').val(defaultTime).removeClass('hide').css('top', position.y).css('left', position.x);
    WdatePicker({
        el:'d123',
        dateFmt: format,
        onpicked:function(){
            $('#d123').addClass('hide');
            cb(null, $('#d123').val());
        },
        oncleared:function(){
            $('#d123').addClass('hide');
            cb(null, $('#d123').val());
        }
    });
};
Browser.prototype.select=function(obj, cb){
    var selectorConf = {};
    selectorConf.title = obj.title;
    var tab = {};
    tab.type = 99;
    tab.avatar = obj.avatar;
    tab.selection = obj.mode == 'single' ? 0 : 1;
    tab.hidden = {};
    tab.selected = {};
    if(obj.selected)
        for(var i = 0; i < obj.selected.length; i++){
            tab.selected[obj.selected[i]] = true;
        }
    tab.title =  "所有项";//obj.title;
    tab.folder = obj.folder;
    tab.selectFolder = !!obj.selectFolder;
    tab.dataSource = obj.dataSource;
    selectorConf.tabs = [ tab ];
    selectorConf.onSelected = function (obj) {
        console.log('selected:' + JSON.stringify(obj));
        cb(null, obj.selected);
    };
    y2w.selector.show(selectorConf);

};
Browser.prototype.selectContact=function(obj,cb){
    var selectorConf = {
        title: obj.title,
        tabs: [
        ],
        onSelected: function (obj) {

            var list=[];
            var count=obj.selected.length;
            for(var i=0;i<obj.selected.length;i++) {
                var id=obj.selected[i];
                var o=currentUser.contacts.get(id);
                if(o) {
                    var email= o.account;
                    var name= o.name;
                    var avatarUrl= o.getAvatarUrl();
                    if(!email){
                        Users.getInstance().remote.get(id,currentUser.token,function(err,user){

                            list.push({
                                id: user.id,
                                name: user.name,
                                avatarUrl: user.getAvatarUrl(),
                                email: user.account
                            });
                            count--;
                            if(count<=0){
                                console.log(list);
                                cb(null,list);
                            }

                        });
                    }
                    else {
                        list.push({
                            id: o.userId,
                            name: name,
                            avatarUrl: avatarUrl,
                            email: email
                        });
                        count--;
                        if(count<=0){
                            console.log(list);
                            cb(null,list);
                        }
                    }
                }
                else{
                    count--;
                    if(count<=0){
                        console.log(list);
                        cb(null,list);
                    }
                }
            }



        }
    };

    var tab={
        type: y2w.selector.tabType.contact,
        selection: obj.mode == 'single' ? 0 : 1,
        hidden: {}
    };
    tab.selected = {};
    if(obj.selected)
        for(var i = 0; i < obj.selected.length; i++){
            tab.selected[obj.selected[i]] = true;
        }


    selectorConf.tabs.push(tab);

    y2w.selector.show(selectorConf);
};
Browser.prototype.confirm=function(title,content,cb){

    if(confirm(content))
        return cb(null,true);

    cb(null,false);
};

Browser.prototype.openImage=function(obj){

    var list=[];
    var link='';
    for(var i=0;i<obj.list.length;i++){
        list.push(obj.list[i].url);
        if(obj.index==i)
            link=obj.list[i].url;
    }
    blueimp.Gallery(list,{index:link});

    //alert(JSON.stringify(obj));
};
Browser.prototype.chooseImage = function(cb){
    var that = this;
    this.image.click();
    this.removeAllListeners('uploadFileComplete');
    this.on('uploadFileComplete', function(err, result){
        that.browserMask.addClass('hide');
        cb(err, result);
    });
};
Browser.prototype.chooseFile = function(cb){
    var that = this;
    this.file.click();
    this.removeAllListeners('uploadFileComplete');
    this.on('uploadFileComplete', function(err, result){
        that.browserMask.addClass('hide');
        cb(err, result);
    });
};
Browser.prototype.setData=function(key,data,cb){
    try {
        key=currentUser.id+"_"+key;
        localStorage.setItem(key, data);
        cb();
    }catch(ex){
        cb(ex);
    }
};
Browser.prototype.getData=function(key,cb){
    try{
        key=currentUser.id+"_"+key;
        var obj=localStorage.getItem(key);
        cb(null,obj);
    }
    catch(ex){
        cb(ex);
    }
};
Browser.prototype.talkTo=function(userId,cb){
    try{
        var contact=currentUser.contacts.get(userId);
        if(contact) {
            y2w.openChatBox(userId, "p2p");
            cb();
            return;
        }

        var that=this;
        currentUser.contacts.remote.add(userId,'',function(error,obj){
            currentUser.contacts.remote.sync(function(){
                y2w.openChatBox(userId, "p2p");
                cb();
            });
        });
    }
    catch(ex){
        cb(ex);
    }
};
Browser.prototype.downloadFile = function(url, name, ext){

    try{
        var ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('downloadFile', url, name, ext);


    }catch(e){

        try{
            var $browserIFrameForDownloadFire = $('#browserIFrameForDownloadFire');
            if(!$browserIFrameForDownloadFire || $browserIFrameForDownloadFire.length == 0) {
                $browserIFrameForDownloadFire = $('<iframe id="browserIFrameForDownloadFire" class="hide"></iframe>');
                $browserIFrameForDownloadFire.appendTo($('body'));
            }
            $browserIFrameForDownloadFire[0].src = url;
        }
        catch(ex){

        }
    }
};
Browser.prototype.upOtherCoversation = function(uids,time, cb){
    if(typeof time=="function"){
        cb=time;
        time=0;
    }
    setTimeout(function () {
        var syncs = [ { type: currentUser.y2wIMBridge.syncTypes.userConversation } ];
        for(var i = 0; i < uids.length; i++){
            var uid = uids[i];
            var imSession = currentUser.y2wIMBridge.transToIMSessionForY2wIMApp(uid, false);
            currentUser.y2wIMBridge.sendMessage(imSession, syncs);
        }
        if(cb)
            cb();
    },time);

};
Browser.prototype.syncData = function(list,time){
    time=time||0;
    setTimeout(function () {
        var obj = {
            cmd: 'sendMessage',
            message: {
                syncs: list
            }
        };
        currentUser.y2wIMBridge.onMessage(obj);
    },time);
};
Browser.prototype.callPhoneNumber = function(number, needCallback, cb){
    cb = cb || function(){};
    cb('web端不支持拨打电话!');
    //this.connect.request("phoneCallBack", [], function(err, obj){
    //
    //});
};
Browser.prototype.share=function(title,pic,url,remark,types,cb){
    var d=$("<div class='qrcode_over'><div class='qrcode_body'><h1>请使用微信扫一扫</h1><div class='qrcode'></div></div></div>").appendTo($("body"));

    d.find(".qrcode").qrcode({
        render: "canvas", //table方式
        width: 200, //宽度
        height:200, //高度
        text: url //任意内容
    });
    d.click(function(){
       d.remove();
    });
};
