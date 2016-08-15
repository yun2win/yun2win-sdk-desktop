// -------------------------------------------------------------
var textInput;

function fillText() {
    if (!textHandler.isTextPending) return;
    textHandler.isTextPending = false;

    //var oldFillStyle = fillStyle;
    //var oldFont = font;
    if (textInput.value.length == 0)
        return;

    fillStyle = getTextColor();//fillStyle;
    font = getTextFontSize();
    fonttype = 'Verdana';
    //points[points.length] = ['text', ['"' + textInput.value + '"', textHandler.x, textHandler.y], drawHelper.getOptions()];

    initmousepoint();
    mouseLocus = [];

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
    });
    mousepoint.stokeId = uuid;
    mousepoint.stroketype = "text";
    mousepoint.strokeattri.width = 2;
    mousepoint.stroketext = textInput.value;
    var fontcolor = getTextColor();
    mousepoint.strokeattri.color = fontcolor.substring(1, fontcolor.length);
    mousepoint.strokeattri.fonttype = fonttype;
    var fontSize = parseInt(getTextFontSize().replace('px', ''));
    mousepoint.strokeattri.fontsize = fontSize;
    mousepoint.strokeattri.joinstyle = lineCap;
    mousepoint.strokeattri.capstyle = lineJoin;

    
    textHandler.y = textHandler.y -fontSize;
    mouseLocus[mouseLocus.length] = { x: textHandler.x, y: textHandler.y };
    mousepoint.minwidth = textHandler.x;
    mousepoint.maxwidth = textHandler.x + fontSize * 1.5 * textInput.value.length;
    mousepoint.minheight = textHandler.y - textInput.clientHeight;
    mousepoint.maxheight = textHandler.y;
    
    if (mousepoint != null) {
        mousepoint.stroketrack = mouseLocus;
        //pointpaths[pointpaths.length] = mousepoint;

        drawHelper.text(tempContext, mousepoint);
        drawHelper.send_stroke(mousepoint);
        initmousepoint();
        mouseLocus = [];
    }

    //fillStyle = oldFillStyle;
    //font = oldFont;

    gonetextinput();
}

function gonetextinput() {
    textInput.style.top = '-100000px';
    textInput.style.left = '-100000px';
    textInput.value = '';
}
var adjustY = function(){
    var fontSize = getTextFontSize();
    if(fontSize == '16px')
        return 2;
    else if(fontSize == '24px')
        return 11;
    else if(fontSize == '36px')
        return 24;
    else
        return 1;
}

var textHandler = {
    isTextPending: false,
    mousedown: function(e) {
        if (textHandler.isTextPending) fillText();
        textHandler.isTextPending = true;

        textHandler.pageX = e.pageX + getScrollLeft();
        textHandler.pageY = e.pageY + getScrollTop();

        textHandler.x = e.pageX - canvas.offsetLeft + getScrollLeft() - getMeetingOffsetLeft();
        textHandler.y = e.pageY - canvas.offsetTop + getScrollTop() - getMeetingOffsetTop();
        var fontSize = parseInt(getTextFontSize().replace('px', ''));
        textInput.style.top = (e.pageY + getScrollTop() - getMeetingOffsetTop() - fontSize) + 'px';
        textInput.style.left = (e.pageX + getScrollLeft() - getMeetingOffsetLeft()) + 'px';
        textInput.style.color = getTextColor();// fillStyle == 'transparent' ? 'Black' : fillStyle;
        textInput.style.fontSize = getTextFontSize();
        textInput.style.height = 'auto';
        setTimeout(function() {
            textInput.focus();
        }, 200);
    },
    mouseup: function(e) {},
    mousemove: function(e) {}
};
// -------------------------------------------------------------

function initTextHandler() {
    textInput = document.getElementById('text-input');

    textInput.onkeyup = function (e) {
        if (e.keyCode != 13) return;

        // ENTER key goes to new line
        fillText();

        textHandler.isTextPending = true;

        var fontSize = parseInt(getTextFontSize().replace('px', ''));
        textHandler.y += fontSize * 1.5;
        textHandler.pageY += fontSize * 1.5;

        textInput.style.top = (textHandler.pageY - 10 - getMeetingOffsetTop()) + 'px';
        textInput.style.left = (textHandler.pageX - getMeetingOffsetLeft()) + 'px';
        textInput.style.color = fillStyle == 'transparent' ? 'Black' : fillStyle;

        setTimeout(function () {
            textInput.focus();
        }, 200);
    };

    textInput.onblur = function (e) {
        if (textInput.value.length) {
            fillText();
            return;
        }
        //textInput.style.top = '-100000px';
        //textInput.style.left = '-100000px';
        //textHandler.isTextPending = false;
    };
}
