// -------------------------------------------------------------

var eraserHandler = {

    // -------------------------------------------------------------

    ismousedown: false,
    prevX: 0,
    prevY: 0,

    // -------------------------------------------------------------

    mousedown: function(e) {
        var x = e.pageX - canvas.offsetLeft + getScrollLeft() - getMeetingOffsetLeft() + eraser_width/2,
            y = e.pageY - canvas.offsetTop + getScrollTop() - getMeetingOffsetTop() + eraser_width/2;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        initmousepoint();
        mouseLocus = [];
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
        mousepoint.stokeId = uuid;
        mousepoint.stroketype = "eraser";
        mousepoint.strokeattri.width = eraser_width;
        mousepoint.strokeattri.color = strokeStyle.substring(1, strokeStyle.length);
        mousepoint.strokeattri.joinstyle = lineCap;
        mousepoint.strokeattri.capstyle = lineJoin;
        mouseLocus[mouseLocus.length] = { x: x, y: y };
        mousepoint.minwidth = x;
        mousepoint.maxwidth = x;
        mousepoint.minheight = y;
        mousepoint.maxheight = y;

        context.lineCap = 'round';
        drawHelper.draweraser(context, t.prevX, t.prevY, x, y, mousepoint);

        // points[points.length] = ['erase', [x, y, 14, 22]];

    },

    // -------------------------------------------------------------

    mouseup: function (e) {
        if (!this.ismousedown)
            return;
        this.ismousedown = false;
        if (mousepoint) {
            mousepoint.stroketrack = mouseLocus;
            drawHelper.send_stroke(mousepoint);
            mousepoint.stroketext = '';
            //pointpaths[pointpaths.length] = mousepoint;
            initmousepoint();
            mouseLocus = [];
        }
    },

    // -------------------------------------------------------------

    mousemove: function(e) {
        var x = e.pageX - canvas.offsetLeft + getScrollLeft() - getMeetingOffsetLeft() + eraser_width/2,
            y = e.pageY - canvas.offsetTop + getScrollTop() - getMeetingOffsetTop() + eraser_width/2;

        var t = this;

        if (t.ismousedown) {
            mouseLocus[mouseLocus.length] = { x: x, y: y };
            if (x < mousepoint.minwidth)
                mousepoint.minwidth = x;
            if (x > mousepoint.maxwidth)
                mousepoint.maxwidth = x;
            if (y < mousepoint.minheight)
                mousepoint.minheight = y;
            if (y > mousepoint.maxheight)
                mousepoint.maxheight = y;

           // points[points.length] = ['erase', [x, y, 14, 22]];//[t.prevX, t.prevY, x, y], drawHelper.getOptions()];
            context.lineCap = 'round';
            drawHelper.draweraser(context, t.prevX, t.prevY, x, y, mousepoint);


            t.prevX = x;
            t.prevY = y;
        }
    }

    // -------------------------------------------------------------

};

// -------------------------------------------------------------
