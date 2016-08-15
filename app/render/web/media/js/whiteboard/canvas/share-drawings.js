// -------------------------------------------------------------
// scripts on this page directly touches DOM-elements
// removing or altering anything may cause failures in the UI event handlers
// it is used only to bring collaboration for canvas-surface
// -------------------------------------------------------------
var lastPoint = [];
var selfId = (Math.random() * 10000).toString().replace('.', '');
var whiteboard_currpage ={
    whiteboard_pagenum:0,
    whiteboard_pageId: '',
    whiteboard_zoom:1
};
var init_whiteBoard_config = {
    id: '',
    conferenceId: '',
    file_ownid: '',
    file_id: ''
}
var init_whiteBoard_data;

window.addEventListener('message', function(event) {
    if (!event.data || !event.data.canvasDesignerSyncData) return;

    if (event.data.sender && event.data.sender == selfId) return;

    // drawing is shared here (array of points)
    points = event.data.canvasDesignerSyncData;

    // to support two-way sharing
    if (!lastPoint.length) {
        lastPoint = points.join('');
    }
    
    // redraw the <canvas> surfaces
    drawHelper.redraw(true);
}, false);
//·¢ËÍ
function syncPoints(senstroke,backcall) {
    if (senstroke.stokeId){
            if (senstroke.stokeId.length)
              syncData(senstroke,backcall);
    }
    //if (!lastPoint.length) {
    //    lastPoint = points.join('');
    //}
    
    //if (points.join('') != lastPoint) {
    //    syncData(points || []);
    //    lastPoint = points.join('');
    //}
}

function syncData(data,backcall) {
    console.log('·¢ËÍ');
    var strokedata ={
        strokeId:data.stokeId,
        pageId:whiteboard_currpage.whiteboard_pageId,
        pagenum:whiteboard_currpage.whiteboard_pagenum,
        whiteboardid:whiteboard_fileinfo.whiteboard_id,
        strokeType: data.stroketype,
        stroke_attri: data.strokeattri,
        stroke_track:data.stroketrack,
        strokeText: data.stroketext,
        minWidth:data.minwidth,
        maxWidth:data.maxwidth,
        minHeight:data.minheight,
        maxHeight:data.maxheight
    };
    var sendstroke = {
        pageId: strokedata.pageId, whiteboardId: strokedata.whiteboardid, strokeType: strokedata.strokeType,
                stroke_attri:strokedata.stroke_attri, stroke_track:strokedata.stroke_track, strokeText:strokedata.strokeText, 
               minWidth:strokedata.minWidth,maxWidth:strokedata.maxWidth,minHeight:strokedata.minHeight,maxHeight:strokedata.maxHeight
    };
    store_whiteboardstrokes(strokedata.whiteboardid, strokedata.pageId, strokedata.strokeText, strokedata.strokeType, JSON.stringify(sendstroke), whiteboard_fileinfo.token, function (error, data) {
        if (error)
            return;
        pushStroke_data();
        backcall();
    });

    //$.ajax({
    //    type: "POST",
    //    url: "../WhiteBoard/StoreWhiteboardStroke",
    //    data: {
    //        strokeId: strokedata.strokeId, pageId: strokedata.pageId, whiteboardId: strokedata.whiteboardid, strokeType: strokedata.strokeType,
    //        stroke_attri:strokedata.stroke_attri, stroke_track:strokedata.stroke_track, strokeText:strokedata.strokeText, 
    //        minWidth:strokedata.minWidth,maxWidth:strokedata.maxWidth,minHeight:strokedata.minHeight,maxHeight:strokedata.maxHeight
    //    },
    //    datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".      
    //    success: function (data) {
    //        if (data.rtnval == 'success') {
    //            pushStroke_data();
    //            backcall();
    //        } 
    //    },
    //    error: function (e) {
    //        console.log(e);
    //    }
    //});
}

function pushStroke_data() {
    var sendmsg = {
        routetype: "whiteboard",
        type: "drawing",
        channelId: channelId,
        pageID: whiteboard_currpage.whiteboard_pageId,
        whiteboardID: whiteboard_fileinfo.whiteboard_id
    }
    send_pushMessage(sendmsg);
}
