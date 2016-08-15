// -------------------------------------------------------------

var pencilHandler = {

    // -------------------------------------------------------------

    ismousedown: false,
    prevX: 0,
    prevY: 0,

    // -------------------------------------------------------------

    mousedown: function(e) {
        initmousepoint();
        mouseLocus=[];

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
        mousepoint.stokeId = uuid;
        mousepoint.stroketype = "pen";
        mousepoint.strokeattri.width = lineWidth;
        mousepoint.strokeattri.color = strokeStyle.substring(1, strokeStyle.length);
        mousepoint.strokeattri.joinstyle = lineCap;
        mousepoint.strokeattri.capstyle = lineJoin;

        var x = e.pageX - canvas.offsetLeft + getScrollLeft() - getMeetingOffsetLeft(),
            y = e.pageY - canvas.offsetTop + getScrollTop() - getMeetingOffsetTop();
        mousepoint.minwidth = x;
        mousepoint.maxwidth = x;
        mousepoint.minheight = y;
        mousepoint.maxheight = y;
        mouseLocus[mouseLocus.length] = {x:x,y:y};
        var t = this;

        t.prevX = x;
        t.prevY = y;
        
        t.ismousedown = true;

        // make sure that pencil is drawing shapes even 
        // if mouse is down but mouse isn't moving
        tempContext.lineCap = 'round';
        drawHelper.drawpen(tempContext, t.prevX, t.prevY, x, y, mousepoint);

        //points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

        t.prevX = x;
        t.prevY = y;
    },

    // -------------------------------------------------------------

    mouseup: function (e) {
        if (!this.ismousedown)
            return;
        this.ismousedown = false;
        if (mousepoint) {
            mousepoint.stroketrack = mouseLocus;
            //pointpaths[pointpaths.length] = mousepoint;
            mousepoint.stroketext = '';
            drawHelper.send_stroke(mousepoint);
            initmousepoint();
            mouseLocus=[];
        }
    },

    // -------------------------------------------------------------

    mousemove: function(e) {
        var x = e.pageX - canvas.offsetLeft + getScrollLeft() - getMeetingOffsetLeft(),
            y = e.pageY - canvas.offsetTop + getScrollTop() - getMeetingOffsetTop();

        var t = this;

        if (t.ismousedown) {
            if (x < mousepoint.minwidth)
                mousepoint.minwidth = x;
            if (x > mousepoint.maxwidth)
                mousepoint.maxwidth = x;
            if (y < mousepoint.minheight)
                mousepoint.minheight = y;
            if (y > mousepoint.maxheight)
                mousepoint.maxheight = y;

            mouseLocus[mouseLocus.length] = { x: x, y: y };
            tempContext.lineCap = 'round';
            drawHelper.drawpen(tempContext, t.prevX, t.prevY, x, y, mousepoint);
            
            //points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];
            t.prevX = x;
            t.prevY = y;
        }

        e.preventDefault();
    }

    // -------------------------------------------------------------

};

// -------------------------------------------------------------
