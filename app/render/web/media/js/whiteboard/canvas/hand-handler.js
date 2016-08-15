// -------------------------------------------------------------

var handHandler = {

    // -------------------------------------------------------------

    ismousedown: false,
    prevX: 0,
    prevY: 0,

    // -------------------------------------------------------------

    mousedown: function(e) {
        var x = e.pageX,
            y = e.pageY;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;
    },

    // -------------------------------------------------------------

    mouseup: function(e) {
        this.ismousedown = false;
    },

    // -------------------------------------------------------------

    mousemove: function(e) {
        var t = this;
        if(t.ismousedown && e.pageX && e.pageY) {
            var x = e.pageX,
                y = e.pageY;

          //  setScroll(t.prevX - x, t.prevY - y);
            var gox = x - t.prevX,
                 goy = y - t.prevY;
             t.prevX = x;
             t.prevY = y;
             if (canvaspositon.canvax <= 0) {
                 canvaspositon.canvax = canvaspositon.canvax + gox;
                 if (canvaspositon.canvax > 0)
                     canvaspositon.canvax = 0;
                 var sectionWidth = document.getElementById("section-canvas").clientWidth;
                 if ((sectionWidth - canvaspositon.canvax) > getCanvasSize().width) {
                     canvaspositon.canvax = sectionWidth - getCanvasSize().width;
                 }
                 document.getElementById("temp-canvas").style.left = canvaspositon.canvax + 'px';
                 document.getElementById("main-canvas").style.left = canvaspositon.canvax + 'px';
                 document.getElementById("filecontent").style.left = canvaspositon.canvax + 'px';
             }
             if (canvaspositon.canvay <= 0) {
           
                    canvaspositon.canvay = canvaspositon.canvay + goy;
                    if (canvaspositon.canvay > 0)
                        canvaspositon.canvay = 0;
                    var sectionHeight = document.getElementById("section-canvas").clientHeight;
                    if ((sectionHeight - canvaspositon.canvay) > getCanvasSize().height) {
                        canvaspositon.canvay = sectionHeight - getCanvasSize().height;
                    }
                    document.getElementById("temp-canvas").style.top = canvaspositon.canvay + 'px';
                    document.getElementById("main-canvas").style.top = canvaspositon.canvay + 'px';
                    document.getElementById("filecontent").style.top = canvaspositon.canvay + 'px';
             }
           

            //canvT.setAttribute('width', getCanvasSize().width);
            //canvT.setAttribute('height', getCanvasSize().height);
        }
    }

    // -------------------------------------------------------------

};

// -------------------------------------------------------------
