function whiteboardManager() {
    var whiteboard_filespoint = [];
    var channelId, token;
    var whiteboard_info = {
        ownerId: '',
        whiteboardId: '',
        fileId: '',
        ownertype: '',
        filetype: '',
        fileurl: '',
        filename: '',
        filetag: '',
        filetime: ''
    };
    function wbinit(w, h) {
        _init();
        setCanvasSize(w, h);
        //设置默认值
        setPencilColor(getPencilColor());
        //重置画笔颜色
        resetPencilColor();
        //初始化宽度工具
        initWbWidth();
        initToolBar();
        setEraserCurser('pen-cursor');
        //var proxy = new moduleProxy();
        //proxy.request('mqtt', 'publishToTopic', {});

    }
    function _init() {
        initWBCommon();
        initDecorator();
        initEvents();
        initTextHandler();
    }

    function getWbColor() {
        return $('#wb_color');
    }

    function getWbWidth() {
        return $('#wb_width');
    }

    function resetPencilColor() {
        getWbColor().off("change.color");
        getWbColor().colorpicker({
            color: getPencilColor()
        });
        getWbColor().on("change.color", function (event, color) {
            if (color)
                setPencilColor(color);
        });
    }

    function resetTextColor() {
        getWbColor().off("change.color");
        getWbColor().colorpicker({
            color: getTextColor()
        });
        getWbColor().on("change.color", function (event, color) {
            if (color)
                setTextColor(color);
        });
    }
    var tool_marginleft = -180;
    function initToolBar() {
        var toolsnav = document.getElementById('whiteboard_nav_tools');
        toolsnav.style.top = '76px';
        toolsnav.style.left = '50%';
        toolsnav.style.marginLeft = tool_marginleft+'px';
    
        var drag_left = document.getElementById('whiteboard_drag_left');
        var drag_right = document.getElementById('whiteboard_drag_right');
        drag_tools(drag_left, toolsnav);
        drag_tools(drag_right, toolsnav);

        $("#whiteboard-tools li").each(function () {
            $(this).click(function () {
                toggleTool($(this));
            });
        })
    }
    function drag_tools(drag_bar, tools_bar) {
        drag_bar.onmousedown = function (ev) {
            var d = document; if (!ev) ev = window.event;
            var x = ev.layerX ? ev.layerX : ev.offsetX, y = ev.layerY ? ev.layerY : ev.offsetY;
            if (tools_bar.setCapture)
                tools_bar.setCapture();
            else if (window.captureEvents)
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);

            d.onmousemove = function (a) {
                if (!a) a = window.event;
                if (!a.pageX) a.pageX = a.clientX;
                if (!a.pageY) a.pageY = a.clientY;
                var tx = a.pageX - x, ty = a.pageY - y;
                tools_bar.style.left = (tx - tool_marginleft) + 'px';
                if (ty > 56)
                    tools_bar.style.top = (ty - 56) + 'px';
            };
            d.onmouseup = function () {
                if (tools_bar.releaseCapture)
                    tools_bar.releaseCapture();
                else if (window.captureEvents)
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                d.onmousemove = null;
                d.onmouseup = null;
            };

        }
    }
    function showSubNav() {
        $('#wb_nav_color').removeClass('hide');
        $('#wb_nav_width').removeClass('hide');
    }

    function hideSubNav() {
        $('#wb_nav_color').addClass('hide');
        $('#wb_nav_width').addClass('hide');
    }

    function resetCurser() {
        $('#temp-canvas').removeClass('eraser-cursor');
        $('#temp-canvas').removeClass('pen-cursor');
        $('#temp-canvas').removeClass('text-cursor');
        $('#temp-canvas').removeClass('hand-cursor');
    }

    function setEraserCurser(cursor) {
        $('#temp-canvas').addClass(cursor);
    }

    function toggleTool(cur) {
        $('.wb_tools_area li.active').removeClass('active');
        cur.addClass('active');
        resetCurser();
        gonetextinput();
        if (cur.attr('id') == 'wb_nav_pencil') {
            showSubNav();
            resetPencilColor();
            resetPencilWidth();
            is.set('Pencil');
            setEraserCurser('pen-cursor');
        }
        else if (cur.attr('id') == 'wb_nav_text') {
            showSubNav();
            resetTextColor();
            resetTextFontSize();
            is.set('Text');
            setEraserCurser('text-cursor');
        }
        else if (cur.attr('id') == 'wb_nav_erase') {
            hideSubNav();
            is.set('Eraser');
            setEraserCurser('eraser-cursor');
        }
        else if (cur.attr('id') == 'wb_nav_hand') {
            hideSubNav();
            is.set('Hand');
            setEraserCurser('hand-cursor');
        }
        else {
            hideSubNav();
        }
    }

    function resetPencilWidth() {
        document.getElementById("wb_width1").innerHTML = "<div style='height:2px;background-color:#444;'></div>";
        document.getElementById("wb_width2").innerHTML = "<div style='height:4px;background-color:#444;'></div>";
        document.getElementById("wb_width3").innerHTML = "<div style='height:6px;background-color:#444;'></div>";
        document.getElementById("wb_width1").setAttribute("value", "2");
        document.getElementById("wb_width2").setAttribute("value", "4");
        document.getElementById("wb_width3").setAttribute("value", "6");
        $('#wb_width1').addClass('pentype1');
        $('#wb_width2').addClass('pentype2');
        $('#wb_width3').addClass('pentype3');
        var width = getPencilWidth();
        switch (width) {
            case 2:
                document.getElementById("wb_width").innerHTML = "<div style='height: 2px; background-color: #444; width: 30px; float: left; margin-top: 8px;'></div><b class='caret'></b>";
                break;
            case 4:
                document.getElementById("wb_width").innerHTML = "<div style='height: 4px; background-color: #444; width: 30px; float: left; margin-top: 7px;'></div><b class='caret'></b>";
                break;
            case 6:
                document.getElementById("wb_width").innerHTML = "<div style='height: 6px; background-color: #444; width: 30px; float: left; margin-top: 6px;'></div><b class='caret'></b>";
                break;
            default:
                setPencilWidth(2);
                document.getElementById("wb_width").innerHTML = "<div style='height: 2px; background-color: #444; width: 30px; float: left; margin-top: 8px;'></div><b class='caret'></b>";
                break;
        }

    }

    function resetTextFontSize() {
        document.getElementById("wb_width1").innerHTML = "普通";
        document.getElementById("wb_width1").style.fontSize = '16px';
        document.getElementById("wb_width1").setAttribute("value", "16px");
        document.getElementById("wb_width2").innerHTML = "大";
        document.getElementById("wb_width2").style.fontSize = '24px';
        document.getElementById("wb_width2").setAttribute("value", "24px");
        document.getElementById("wb_width3").innerHTML = "特大";
        document.getElementById("wb_width3").style.fontSize = '36px';
        document.getElementById("wb_width3").setAttribute("value", "36px");
        $('#wb_width1').removeClass('pentype1');
        $('#wb_width2').removeClass('pentype2');
        $('#wb_width3').removeClass('pentype3');
        var text = '';
        var fontSize = getTextFontSize();
        switch (fontSize) {
            case '16px':
                text += '普通';
                break;
            case '24px':
                text += '大';
                break;
            case '36px':
                text += '特大';
                break;
            default:
                setTextFontSize('16px');
                text += '普通';
                break;
        }
        text += '<b class="caret"></b>';
        getWbWidth().html(text);
    }

    function initWbWidth() {
        $("#wb_width_opt li").each(function () {
            $(this).click(function () {
                var curToolId = $('.whiteboard-nav li.active').attr('id');
                if (curToolId == 'wb_nav_pencil') {
                    var a$ = $($(this).children()[0]);
                    var width = parseInt(a$.attr('value'));
                    if (width == 2) {
                        document.getElementById("wb_width").innerHTML = "<div style='height: 2px; background-color: #444; width: 30px; float: left; margin-top: 10px;'></div><b class='caret'></b>";
                    } else if (width == 4) {
                        document.getElementById("wb_width").innerHTML = "<div style='height: 4px; background-color: #444; width: 30px; float: left; margin-top: 9px;'></div><b class='caret'></b>";
                    } else if (width == 6) {
                        document.getElementById("wb_width").innerHTML = "<div style='height: 6px; background-color: #444; width: 30px; float: left; margin-top: 8px;'></div><b class='caret'></b>";
                    }
                    setPencilWidth(width);
                }
                else if (curToolId == 'wb_nav_text') {
                    var a$ = $($(this).children()[0]);
                    var fontSize = a$.attr('value');
                    var text = a$.text() + '<b class="caret"></b>';
                    $("#wb_width").html(text);
                    setTextFontSize(fontSize);
                }
            })
        })
    }
    //底部的分页
    function initbottomfiles() {
        var context = '';
        for (var i = 0; i < whiteboard_filespoint.length; i++) {
            var iframeheight = whiteboard_filespoint[i].height * whiteboard_filespoint[i].zoom;
            var iframewidth = 140;
            //onload = ""
            //var iframecontext = "<iframe frameBorder=0 scrolling=no" + " onload='webpagescal("+ whiteboard_filespoint[i].zoom + ")'"
            //    + "src='" + whiteboard_filespoint[i].src + "' style='height:" + iframeheight + "px;" + "width:" + iframewidth + "px;'" + "></iframe>";

            var pagetext = "<div style='height:" + iframeheight + "px;width: " + iframewidth + "px;position: absolute;background: #fff;line-height: " + iframeheight + "px;font-size: 15px;color: #999999;text-align: center;'><span>第" + (i + 1) + "页</span></div>";

            var onerror = "onerror =\"javascript: this.src = '" + "'\"";


            var pagecanvas = "<canvas  id = 'pagecanva_" + whiteboard_filespoint[i].PageNum + "' style='height:" + iframeheight + "px;width: " + iframewidth + "px;position: absolute;left:0px;'></canvas>";
            var divcontext = "<div frameBorder=0 scrolling=no width='100%'" + "style='height:" + iframeheight + "px;" + "width:" + iframewidth + "px;margin-top: 10px;margin-left: auto;margin-right: auto;position: relative;" + "'>" + pagetext + "<img src='"
                + whiteboard_filespoint[i].thumbnailurl + "'" + onerror + " style='height:" + iframeheight + "px;" + "width:" + iframewidth + "px;position: absolute;left:0px;'" + "onmousedown='return false;'>" + pagecanvas + "</div>";
            divcontext = divcontext + "<div style='text-align: center;'>" + (i + 1) + "</div>"
            var eachcontext;
            var listyle = " style ='cursor: pointer; padding: 0px;display:block;margin: 0;list-style: none;' ";
            if (i == 0) {
                eachcontext = "<li class='active'" + listyle + "id='whiteboardfileid_" + whiteboard_filespoint[i].PageNum + "'>" + divcontext + "</li>"
            } else {
                eachcontext = "<li " + listyle + "id='whiteboardfileid_" + whiteboard_filespoint[i].PageNum + "'>" + divcontext + "</li>"
            }
            context = context + eachcontext;
        }

        document.getElementById("whiteboard_eachfile").innerHTML = context;
        $("#whiteboard_eachfile li").each(function () {
            $(this).click(function () {
                if (mymemberId != powerId.speakerId)
                    return;

                var webpageid = $(this).attr('id');
                webpageid = webpageid.replace("whiteboardfileid_", "");
                if (curren_webpage.PageNum == webpageid) {
                    return;
                }
                for (var i = 0; i < whiteboard_filespoint.length; i++) {
                    if (whiteboard_filespoint[i].PageNum == webpageid) {
                        whiteboard_currpage.whiteboard_pagenum = whiteboard_filespoint[i].PageNum;
                        whiteboard_currpage.whiteboard_pageId = whiteboard_filespoint[i].pageId;
                        whiteboard_currpage.whiteboard_zoom = whiteboard_filespoint[i].zoom;

                        gotowebpage(whiteboard_filespoint[i]);

                        put_whiteboard(whiteboard_fileinfo.file_id, whiteboard_filespoint[i].pageId, token, function (error, data) {
                            var sendmsg = {
                                routetype: "whiteboard",
                                type: "pageturn",
                                channelId: channelId,
                                pageIndex: whiteboard_filespoint[i].PageNum,//页面
                                pageId: whiteboard_filespoint[i].pageId,
                                whiteboardID: whiteboard_fileinfo.file_id
                            }
                            send_pushMessage(sendmsg);
                        });
                       
                        break;
                    }
                }
            });
        });
    }
 
    //滑动
    function scrollwebpage(direction) {
        var files = $(".whiteboard_filespace")[0];
        var clientWidth = files.clientWidth;
        var scrollWidth = files.scrollWidth;
        var scrollLeft = files.scrollLeft;
        if (direction == 'left') {
            if (scrollLeft < 300) {
                files.scrollLeft = 0;
            } else {
                files.scrollLeft = scrollLeft - 300;
            }
        } else if (direction == 'right') {
            var clientwidth_left = clientWidth + scrollLeft;
            if ((clientwidth_left + 300) > scrollWidth) {
                files.scrollLeft = scrollLeft + scrollWidth - clientwidth_left;
            } else {
                files.scrollLeft = scrollLeft + 300;
            }
        }
    }
    //文件列表控制
    function switch_pagesshow() {
        if (flagshowfiles) {
            hideFiles();
        } else {
            showFiles();
        }
    }
    var flagshowfiles = false;
    function showFiles() {
        //updateToolBarClose();
        $("#whiteboard_filepages").removeClass("hide");
        $("#whiteboard_filepages").addClass("fadeInLeftBig");
        $("#switch_pagesshow").removeClass("hide");
        $("#switch_pagesshow").removeClass("pages_show_hide_packup");
        $("#switch_pagesshow").addClass("pages_show_hide_expansion");
        $("#switch_pagesshow").addClass("fadeInLeftBig");
        flagshowfiles = true;
    }
   
    function hideFiles() {
        $("#whiteboard_filepages").addClass("hide");
        $("#whiteboard_filepages").removeClass("fadeInLeftBig");
        $("#switch_pagesshow").removeClass("pages_show_hide_expansion");
        $("#switch_pagesshow").addClass("pages_show_hide_packup");
        $("#switch_pagesshow").removeClass("fadeInLeftBig");
        flagshowfiles = false;
    }
    this.closefile_pages = function (isaccord) {
        hideFiles();
        $("#switch_pagesshow").addClass("hide");
        if (isaccord) {
            var sendmsg = {
                routetype: "whiteboard",
                type: "finishwhiteboard",
                channelId: channelId,
                senderId: mymemberId,
                whiteboardID: whiteboard_fileinfo.file_id
            }
            send_pushMessage(sendmsg);
        }
    }
    //接收到共享文件详情
    function getfileinfo(fileinfo) {

        whiteboard_filespoint = fileinfo;
        //var filecontent = $('#filecontent');
        //filecontent.append(whiteboard_filespoint[0].iframe);
        whiteboard_currpage.whiteboard_pagenum = whiteboard_filespoint[0].PageNum;
        whiteboard_currpage.whiteboard_pageId = whiteboard_filespoint[0].pageId;
        whiteboard_currpage.whiteboard_zoom = whiteboard_filespoint[0].zoom;

        gotowebpage(whiteboard_filespoint[0]);
        initbottomfiles();
    }
    var curren_webpage;
    //接收翻页到指定页
    this.gotoconfirmpage = function (pageId) {
        if (whiteboard_currpage.whiteboard_pageId == pageId)
            return;
        for (var i = 0; i < whiteboard_filespoint.length; i++) {
            if (whiteboard_filespoint[i].pageId == pageId) {
                whiteboard_currpage.whiteboard_pagenum = pagenum;
                whiteboard_currpage.whiteboard_pageId = whiteboard_filespoint[i].pageId;
                whiteboard_currpage.whiteboard_zoom = whiteboard_filespoint[i].zoom;
                gotowebpage(whiteboard_filespoint[i]);
                break;
            }
        }
    }
    //点击翻页
    function gotowebpage(webpageinfo) {
        curren_webpage = webpageinfo;
        document.getElementById("filecontent").innerHTML = webpageinfo.iframe;
        wbinit(webpageinfo.width, webpageinfo.height);
        pointpaths = webpageinfo.pointpaths;
        showFiles();
        $('.whiteboard_fileurli li.active').removeClass('active');
        $('#whiteboardfileid_' + webpageinfo.PageNum).addClass('active');

        $('.whiteboard-nav li.active').removeClass('active');
        $('#wb_nav_pencil').addClass('active');
        resetCurser();
        gonetextinput();
        showSubNav();
        resetPencilColor();
        resetPencilWidth();
        is.set('Pencil');
        setEraserCurser('pen-cursor');
        drawHelper.repaint_init(true);
    }
    this.start_whiteboard = function (whiteboardId, channelIdd, tokend, isaccord) {
        channelId = channelIdd;
        token = tokend;
        initwhitedate();
        hideFiles();
        $("#switch_pagesshow").addClass("hide");
        document.getElementById("filecontent").innerHTML = '';
        if (whiteboardId) {//打开白板
            getallPages(whiteboardId, isaccord);
         
         } else {//创建白板
            var width = 2560;
            var height = 1440;
             wbinit(width, height);
             var data = {
                 width: width,
                 height: height
             }
             storeblank_whiteboard(data, channelId, token, isaccord);
        }
        $("#switch_pagesshow").off("click");
        $("#switch_pagesshow").on("click", function () {
            switch_pagesshow();
        });

    }

    var getallPages = function (whiteboardId, isaccord) {
        get_whiteboard(whiteboardId, token, function (error, data) {
            if (error)
                return;
            whiteboard_fileinfo.file_id = data.id;
            whiteboard_fileinfo.file_ownid = mymemberId;
            whiteboard_fileinfo.file_name = data.name;
            whiteboard_fileinfo.whiteboard_id = data.id;
            whiteboard_fileinfo.token = token;
            get_whiteboardpages(whiteboardId, token, function (error, data) {
                if (error)
                    return;
                $('#whiteboard-fileload').addClass('hide');
                var listpage = data.entries;
                for (var i = 0; i < listpage.length; i++) {
                    var file_info = {html:'',thumb:''};
                    try{
                        if (listpage[i].data.length > 0) {
                            file_info = JSON.parse(listpage[i].data);
                            file_info.html = file_info.html.replace('http:', 'https:');
                            file_info.thumb = file_info.thumb.replace('http:', 'https:');
                        }
                    }catch(e){}
                    listpage[i].height = listpage[i].height + 10;

                    var whiteboard_filepoint = {};
                    whiteboard_filepoint.pointpaths = [];
                    var iframe = "<iframe frameBorder=0 scrolling=no width='100%'" + "src='" + file_info.html + "' style='height:" + listpage[i].height + "px;" + "width:" + listpage[i].width + "px;'" + "></iframe>";
                    whiteboard_filepoint.iframe = iframe;
                    whiteboard_filepoint.width = listpage[i].width;
                    whiteboard_filepoint.height = listpage[i].height;
                    whiteboard_filepoint.thumbnailurl = file_info.thumb;
                    whiteboard_filepoint.PageNum = listpage[i].index;
                    whiteboard_filepoint.pageId = listpage[i].id;
                    whiteboard_filepoint.zoom = 140 / listpage[i].width;
                    whiteboard_filespoint[whiteboard_filespoint.length] = whiteboard_filepoint;
                }
                if (listpage[0].type == 'normal') {
                    whiteboard_currpage.whiteboard_pageId = whiteboard_filespoint[0].pageId;
                    whiteboard_currpage.whiteboard_pagenum = whiteboard_filespoint[0].PageNum;
                    whiteboard_currpage.whiteboard_zoom = whiteboard_filespoint[0].zoom;
                    wbinit(whiteboard_filespoint[0].width, whiteboard_filespoint[0].height);
                    drawHelper.redraw(true);
                } else {
                    getfileinfo(whiteboard_filespoint);
                    drawHelper.redraw(true);
                }
                if (isaccord) {//开始白板推送
                    put_whiteboard(whiteboard_fileinfo.file_id, whiteboard_filespoint[0].pageId, token, function (error, data) {
                        var sendmsg = {
                            routetype: "whiteboard",
                            type: "startwhiteboard",
                            channelId: channelId,
                            senderId: mymemberId,
                            whiteboardID: whiteboardId
                        }
                        send_pushMessage(sendmsg);
                    });
                }
            })

        });
    }
    var storeblank_whiteboard = function (width_height, channelId, token, isaccord) {
        $('#whiteboard-fileload').removeClass('hide');
        store_Whiteboard(channelId,myname, 'normal', token, null, function (error, data) {
            if (error)
                return
            whiteboard_fileinfo.file_id = data.id;
            whiteboard_fileinfo.file_ownid = mymemberId;
            whiteboard_fileinfo.file_name = data.name;
            whiteboard_fileinfo.whiteboard_id = data.id;
            whiteboard_fileinfo.token = token;
            whiteboard_info = data;
            var totalpage = 0;
            var whiteboard_filepoint = {};
            whiteboard_filepoint.pointpaths = [];
            whiteboard_filepoint.iframe = '';
            whiteboard_filepoint.width = width_height.width;
            whiteboard_filepoint.height = width_height.height;
            whiteboard_filepoint.thumbnailurl = '';
            whiteboard_filepoint.PageNum = 0;
            whiteboard_filepoint.zoom = 120 / width_height.height;
            whiteboard_filepoint.pageId = '';
            whiteboard_filespoint[whiteboard_filespoint.length] = whiteboard_filepoint;
            store_whiteboardpage(whiteboard_info.id, whiteboard_info.type, 0, width_height.width, width_height.height, null, token, function (error, data) {
                if (error)
                    return;
                for (var j = 0; j < whiteboard_filespoint.length; j++) {
                    if (whiteboard_filespoint[j].PageNum == data.index) {
                        whiteboard_filespoint[j].pageId = data.id;
                    }
                }
                totalpage++;
                if (totalpage == whiteboard_filespoint.length) {
                    whiteboard_currpage.whiteboard_pagenum = whiteboard_filespoint[0].PageNum;
                    whiteboard_currpage.whiteboard_pageId = whiteboard_filespoint[0].pageId;
                    whiteboard_currpage.whiteboard_zoom = whiteboard_filespoint[0].zoom;
                    $('#whiteboard-fileload').addClass('hide');
                }
                if (isaccord) {//开始白板推送
                    put_whiteboard(whiteboard_fileinfo.file_id, whiteboard_filespoint[0].pageId, token, function (error, data) {
                        var sendmsg = {
                            routetype: "whiteboard",
                            type: "startwhiteboard",
                            channelId: channelId,
                            senderId: mymemberId,
                            whiteboardID: whiteboard_fileinfo.file_id
                        }
                        send_pushMessage(sendmsg);
                    });
                }
            });
        });
    }

}
