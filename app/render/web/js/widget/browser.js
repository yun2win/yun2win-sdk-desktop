

var Browser=function(){

    this.dom=$("#browserpanel");

    this.toolbar=this.dom.find(".toolbar");
    this.btnBack=this.dom.find(".btn_back");
    this.btnClose=this.dom.find(".btn_close");
    this.lblname=this.dom.find(".name");
    this.btns=this.dom.find("#otherBtns");
    this.defaultBtn=this.dom.find("#defaultBtns");

    this.iframe = this.dom.find("iframe");
    this.btnClose.on("click",this.hide.bind(this));

    this.history = [];
    this.connect = new ActionConnect(this,this.iframe[0].contentWindow);
    this.color = {bg:"#fff",font:"#666",hoverbg:"#eee"};
    this._initEvent();

};

Browser.prototype._initEvent=function(){
    var that=this;
    this.btnClose.on("click",that.hide.bind(that));
    this.toolbar.find(".hoverBtn").on('mouseenter',function(e){
        $(this).css("background-color",that.color.hoverbg);
    }).on('mouseleave',function(e){
        $(this).css("background-color","transparent");
    });

    this.btns.on('click',function(e){
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
            console.error(ex);
        }
    });

};

Browser.prototype.open=function(url){
    if(!url)
        return;
    url= $.trim(url);
    if(url.indexOf("http")!=0)
        url="http://"+url;
    this.history=[url];
    this.show();
    this.iframe.attr("src",url);
    this.lblname.text(url);
    this.toolbar.css("background-color","#fff").css("color","#666");
    this.color = { bg:"#fff", font:"#666", hoverbg:"#eee" };
    this.btns.empty();
    this.defaultBtn.find("a").attr("href",url);

    var that=this;
    //setTimeout(function(){
    //    that.sendMessage("fuck....");
    //},5000);
    setTimeout(function(){
        that.connect.request("alert",'afwfewf',function(){
            console.log('aba');
        });
    },2000);
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
    cb();
};
Browser.prototype.setMenus=function(menus,cb){
    var that=this;
    for(var i=0;i<menus.length;i++){
        var menu=menus[i];
        var d=$("<div data-menu='"+JSON.stringify(menu)+"' class='opbtn hoverBtn'></div>")
            .appendTo(this.btns)
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


