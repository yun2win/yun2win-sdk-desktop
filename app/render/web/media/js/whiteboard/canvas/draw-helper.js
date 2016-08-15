// -------------------------------------------------------------
var flag_update_strokedata = false;
var flag_has_strokedata = false;
var drawHelper = {

    // -------------------------------------------------------------

    redraw: function (skipSync) {      
       
        flag_has_strokedata = true;
        if (skipSync) {//判断是否要存储推送  true为不推送 
            this.update_strokedata();
        } 
    },
    //本地写的存储推送
    send_stroke:function(senstroke){
        flag_has_strokedata = true;
        syncPoints(senstroke, function () {
            drawHelper.update_strokedata();
        });
    },

  //获取最新画的笔画
    update_strokedata: function () {
        if (flag_update_strokedata) {//如果正在更新等待更新完成
            return;
        }
        flag_has_strokedata = false;
        flag_update_strokedata = true;
        var uptatetime;
        if (pointpaths.length > 0) {
            uptatetime =pointpaths[pointpaths.length - 1].updatetime;
        } else {
            uptatetime = "1970-01-01 00:00:00.0";
        }
        var updatestrokedata = {
            currenttime: uptatetime,
            pageSize: 50,
            pageId: whiteboard_currpage.whiteboard_pageId,
            whiteboardid:whiteboard_fileinfo.whiteboard_id
        };

        get_whiteboardstrokes(updatestrokedata.whiteboardid, updatestrokedata.pageId, 50, pointpaths.length,whiteboard_fileinfo.token, function (error, data) {
            flag_update_strokedata = false;
            if (error) {
                if (flag_has_strokedata)
                    drawHelper.update_strokedata();
                return;
            }
            if (whiteboard_currpage.whiteboard_pageId != updatestrokedata.pageId)
                return;

            drawHelper.update_ui(data.entries);
            if (data.entries.length < 50) {
                if (flag_has_strokedata)
                    drawHelper.update_strokedata();
            } else {
                drawHelper.update_strokedata();
            }
        });
    },
    update_ui:function(liststrokes){
        tempContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
        //context.clearRect(0, 0, innerWidth, innerHeight);
        if (liststrokes.length) {
            for (var i = 0; i < liststrokes.length; i++) {
                var strokedata = JSON.parse(liststrokes[i].data);

                var netpointpath = {
                    whiteboardId: strokedata.whiteboardId,
                    pageId: strokedata.pageId,
                    stokeId:liststrokes[i].id,
                    stroketype: strokedata.strokeType,
                    stroketext: strokedata.strokeText,
                    strokeattri: strokedata.stroke_attri,
                    stroketrack: strokedata.stroke_track,
                    updatetime: liststrokes[i].updatedAt
                };
              pointpaths[pointpaths.length] = netpointpath;

              var method = strokedata.strokeType;

              var pagecanvas = document.getElementById('pagecanva_' + whiteboard_currpage.whiteboard_pagenum);//小界面缩略图显示

                if (method == 'line') {
                    drawHelper.line(context, netpointpath, 1);
                    if (pagecanvas) {
                        var pagecanvas2d = pagecanvas.getContext('2d');
                        drawHelper.line(pagecanvas2d, netpointpath, whiteboard_currpage.whiteboard_zoom);
                    }
                } else if (method == 'pen') {
                    drawHelper.pen(context, netpointpath, 1);
                    if (pagecanvas) {
                        var pagecanvas2d = pagecanvas.getContext('2d');
                        drawHelper.pen(pagecanvas2d, netpointpath, whiteboard_currpage.whiteboard_zoom);
                    }
                } else if (method == 'text') {
                    drawHelper.text(context, netpointpath, 1);
                    if (pagecanvas) {
                        var pagecanvas2d = pagecanvas.getContext('2d');
                        drawHelper.text(pagecanvas2d, netpointpath, whiteboard_currpage.whiteboard_zoom);
                    }
                } else if (method == 'eraser') {
                    drawHelper.eraser(context, netpointpath, 1);
                    if (pagecanvas) {
                        var pagecanvas2d = pagecanvas.getContext('2d');
                        drawHelper.eraser(pagecanvas2d, netpointpath, whiteboard_currpage.whiteboard_zoom);
                    }
                }
            }
        }
    },
    repaint_init: function () {
        tempContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
        //context.clearRect(0, 0, innerWidth, innerHeight);
        if (pointpaths.length) {
            for (var i = 0; i < pointpaths.length;i++){
                var method = pointpaths[i].stroketype;
                if (method == 'line') {
                    this.line(context, pointpaths[i],1);
                } else if (method == 'pen') {
                    this.pen(context, pointpaths[i],1);
                } else if (method == 'text') {
                    this.text(context, pointpaths[i],1);
                } else if (method == 'eraser') {
                    this.eraser(context, pointpaths[i],1);
                }
            }
        }
    },

    // -------------------------------------------------------------

    getOptions: function () {
        return [lineWidth, strokeStyle, fillStyle, globalAlpha, globalCompositeOperation, lineCap, lineJoin, font, fonttype];
    },

    // -------------------------------------------------------------

    handleOptions: function (context, opt, isNoFillStroke) {
        opt = opt || this.getOptions();

        context.globalAlpha = opt[3];
        context.globalCompositeOperation = opt[4];

        context.lineCap = opt[5];
        context.lineJoin = opt[6];
        context.lineWidth = opt[0];

        context.strokeStyle = opt[1];
        context.fillStyle = opt[2];
        
        if (!isNoFillStroke) {
            context.stroke();
            context.fill();
        }
    },

    setcontext_attr: function (context, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        context.globalAlpha = 1;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = point.strokeattri.width * zoom;

        context.strokeStyle = "#" + point.strokeattri.color;
        context.fillStyle = 'transparent';
        context.stroke();
        context.fill();
    },
    // -------------------------------------------------------------

    line: function (context, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        var points = point.stroketrack;
        if (points.length) {
            for (var i = 1; i < points.length; i++) {
                this.drawline(context, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y,point,zoom);
            }
        }   
    },
    drawline: function (context, prevX, prevY, x, y, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        context.beginPath();
        if (zoom == 1) {
            context.moveTo(prevX * zoom, prevY * zoom);
            context.lineTo(x * zoom, y * zoom);
        } else {
            context.moveTo(prevX * 0.28, prevY * zoom * 1.4);
            context.lineTo(x * 0.28, y * zoom * 1.4);
        }
        context.globalCompositeOperation = "source-over";
        this.setcontext_attr(context, point, zoom);
    },
    pen: function (context, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        var points = point.stroketrack;
        if (points.length) {
            for (var i = 1; i < points.length; i++) {
                this.drawpen(context, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y, point, zoom);
            }
        }
    },

    drawpen: function (context, prevX, prevY, x, y, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        try {
            context.beginPath();
            if(zoom==1){
            context.moveTo(prevX * zoom, prevY * zoom);
            context.lineTo(x * zoom, y * zoom);
            } else {
                context.moveTo(prevX * 0.28, prevY * zoom * 1.4);
                context.lineTo(x * 0.28, y * zoom * 1.4);
            }
            context.globalCompositeOperation = "source-over";
            this.setcontext_attr(context, point, zoom);
        } catch (e) {
            console.log(e);
        }
    },
    // -------------------------------------------------------------

    text: function (context, point, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        try {
        var oldFillStyle = fillStyle;
        context.fillStyle = "#" + point.strokeattri.color;//fillStyle === 'transparent' || fillStyle === 'White' ? 'Black' : fillStyle;
        context.font = point.strokeattri.fontsize * zoom + 'px ' + point.strokeattri.fonttype;//'15px Verdana';
 
        var points = point.stroketrack;
        if (points.length) {
            context.globalCompositeOperation = "source-over";
             if(zoom==1){
                 context.fillText(point.stroketext, points[0].x * zoom, (points[0].y + point.strokeattri.fontsize) * zoom);
             } else {
                 context.fillText(point.stroketext, points[0].x * 0.28, (points[0].y + point.strokeattri.fontsize) * zoom * 1.4);
             }
            fillStyle = oldFillStyle;
            this.setcontext_attr(context, point, zoom);
        }
        } catch (e) {
            console.log(e);
        }
    },

    //// -------------------------------------------------------------

    //arc: function (context, point, options) {
    //    context.beginPath();
    //    context.arc(point[0], point[1], point[2], point[3], 0, point[4]);

    //    this.handleOptions(context, options);
    //},

    //// -------------------------------------------------------------

    //rect: function (context, point, options) {
    //    this.handleOptions(context, options, true);

    //    context.strokeRect(point[0], point[1], point[2], point[3]);
    //    context.fillRect(point[0], point[1], point[2], point[3]);
    //},

    //// -------------------------------------------------------------

    //quadratic: function (context, point, options) {
    //    context.beginPath();
    //    context.moveTo(point[0], point[1]);
    //    context.quadraticCurveTo(point[2], point[3], point[4], point[5]);

    //    this.handleOptions(context, options);
    //},

    //// -------------------------------------------------------------

    //bezier: function (context, point, options) {
    //    context.beginPath();
    //    context.moveTo(point[0], point[1]);
    //    context.bezierCurveTo(point[2], point[3], point[4], point[5], point[6], point[7]);

    //    this.handleOptions(context, options);
    //},

    save: function (context, width, height) {
        context.tempData = context.getImageData(0, 0, width, height);
    },

    clear: function (context, width, height, zoom) {
        if (!zoom) {
            zoom = 1;
        }
        context.clearRect(0, 0, width * zoom, height * zoom);
    },

    eraser: function (context, point, zoom) {
        var points = point.stroketrack;
        if (points.length) {
            for (var i = 1; i < points.length; i++) {
                this.draweraser(context, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y, point, zoom);
            }
        }
    },
    draweraser: function (context, prevX, prevY, x, y, point, zoom) {
        //context.clearRect(x, y, width, height);
        if (!zoom) {
            zoom = 1;
        }
        try{
        context.beginPath();
            if(zoom==1){
                context.moveTo(prevX * zoom, prevY * zoom);
                context.lineTo(x * zoom, y * zoom);
            } else {
                context.moveTo(prevX * 0.28, prevY * zoom*1.4);
                context.lineTo(x * 0.28, y * zoom * 1.4);
            }
        context.globalCompositeOperation = "destination-out";
        this.setcontext_attr(context, point, zoom);
         } catch (e) {
            console.log(e);
         }
    },
    load: function (context) {
        context.putImageData(imageData, 0, 0);
    }



    // -------------------------------------------------------------
};
// -------------------------------------------------------------