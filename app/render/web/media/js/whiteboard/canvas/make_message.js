function send_pushMessage(message) {//调用发送推送消息
    if (Rtcchannel)
    Rtcchannel.call_sendMessage(message);
}
function receive_pushMessage(message) {
    if (message.channelId == channelId) {
        switch (message.type) {
            case 'startwhiteboard':
                openwhiteboard(message.whiteboardID, 'sharewhiteboard', false);
                break;
            case 'finishwhiteboard':
                if (message.whiteboardID == whiteboard_fileinfo.whiteboard_id)
                    closewhiteboard(false);
                break;
            case 'pageturn':
                if (message.whiteboardID == whiteboard_fileinfo.whiteboard_id)
                    turnpage_whiteboard(message.pageId);
                break;
            case 'drawing':
                if (message.whiteboardID == whiteboard_fileinfo.whiteboard_id && message.pageID == whiteboard_currpage.whiteboard_pageId)
                    drawHelper.redraw(true);
                break;
            case 'inWhiteboard':
                openwhiteboard(message.whiteboardID, 'sharewhiteboard', false);
                break;
            default:
                console.error('Unrecognized message', message);
        }
    }
}