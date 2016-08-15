// -------------------------------------------------------------
(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);

    window.params = params;
})();

function setSelection(element, prop) {
    endLastPath();
    hideContainers();

    is.set(prop);

    var selected = document.getElementsByClassName('selected-shape')[0];
    if (selected) selected.className = selected.className.replace(/selected-shape/g, '');

    element.className += ' selected-shape';
}

//画笔配置
var pencilConf = {
    color: '#000000',
    width: '2'
}

function setPencilColor(color) {
    pencilConf.color = color;
    strokeStyle = color;
}

function getPencilColor(){
    return pencilConf.color;
}

function setPencilWidth(width){
    pencilConf.width = width;
    lineWidth = width;
}

function getPencilWidth(){
    return pencilConf.width;
}

//文字配置
var textConf = {
    color: '#000000',
    fontSize: '16px'
}
function setTextColor(color) {
    textConf.color = color;
    fillStyle = color;
}

function getTextColor(){
    return textConf.color;
}

function setTextFontSize(fontSize){
    textConf.fontSize = fontSize;
}

function getTextFontSize(){
    return textConf.fontSize;
}

// -------------------------------------------------------------



// -------------------------------------------------------------

function hideContainers() {
    var additionalContainer = find('additional-container'),
        colorsContainer = find('colors-container'),
        lineWidthContainer = find('line-width-container');

    additionalContainer.style.display = colorsContainer.style.display = lineWidthContainer.style.display = 'none';
}

// -------------------------------------------------------------

function initDecorator() {
    (function () {

        var cache = {};

        var lineCapSelect = find('lineCap-select');
        var lineJoinSelect = find('lineJoin-select');

        // -------------------------------------------------------------

        function getContext(id) {
            var context = find(id).getContext('2d');
            context.lineWidth = 2;
            context.strokeStyle = '#6c96c8';
            return context;
        }

        // -------------------------------------------------------------

        function bindEvent(context, shape) {
            if (shape === 'Pencil') {
                lineCap = lineJoin = 'round';
            }

            /* Default: setting default selected shape!! */
            if (params.selectedIcon) {
                params.selectedIcon = params.selectedIcon.split('')[0].toUpperCase() + params.selectedIcon.replace(params.selectedIcon.split('').shift(1), '');
                if (params.selectedIcon === shape) {
                    is.set(params.selectedIcon);
                }
            }
            else is.set('Pencil');

            addEvent(context.canvas, 'click', function () {

                dragHelper.global.startingIndex = 0;

                setSelection(this, shape);

                if (this.id === 'wb_pencil' || this.id === 'wb_eraser') {
                    cache.lineCap = lineCap;
                    cache.lineJoin = lineJoin;

                    lineCap = lineJoin = 'round';
                } else if (cache.lineCap && cache.lineJoin) {
                    lineCap = cache.lineCap;
                    lineJoin = cache.lineJoin;
                }

                if (this.id === 'wb_eraser') {
                    cache.strokeStyle = strokeStyle;
                    cache.fillStyle = fillStyle;
                    cache.lineWidth = lineWidth;

                    strokeStyle = 'White';
                    fillStyle = 'White';
                    lineWidth = 10;
                } else if (cache.strokeStyle && cache.fillStyle && typeof cache.lineWidth !== 'undefined') {
                    strokeStyle = cache.strokeStyle;
                    fillStyle = cache.fillStyle;
                    lineWidth = cache.lineWidth;
                }
            });
        }

        // -------------------------------------------------------------

        function decoratePencil() {
            var context = getContext('wb_pencil');

            context.lineWidth = 5;
            context.lineCap = 'round';
            context.moveTo(35, 20);
            context.lineTo(5, 35);
            context.stroke();

            context.fillStyle = 'Gray';
            context.font = '9px Verdana';
            context.fillText('Pencil', 6, 12);

            bindEvent(context, 'Pencil');
        }

        decoratePencil();

        // -------------------------------------------------------------

        function decorateEraser() {
            var context = getContext('wb_eraser');

            context.lineWidth = 9;
            context.lineCap = 'round';
            context.moveTo(35, 20);
            context.lineTo(5, 25);
            context.stroke();

            context.fillStyle = 'Gray';
            context.font = '9px Verdana';
            context.fillText('Eraser', 6, 12);

            bindEvent(context, 'Eraser');
        }

        decorateEraser();

        // -------------------------------------------------------------

        function decorateText() {
            var context = getContext('wb_text');

            context.font = '16px Verdana';
            context.strokeText('T', 15, 30);

            bindEvent(context, 'Text');
        }

        decorateText();

        // -------------------------------------------------------------

        var designPreview = find('design-preview'),
            codePreview = find('code-preview');

        // -------------------------------------------------------------

        // todo: use this function in share-drawings.js
        // to sync buttons' states
        window.selectBtn = function (btn, isSkipWebRTCMessage) {
            codePreview.className = designPreview.className = '';

            if (btn == designPreview) designPreview.className = 'preview-selected';
            else codePreview.className = 'preview-selected';

            if (!isSkipWebRTCMessage && window.connection && connection.numberOfConnectedUsers >= 1) {
                connection.send({
                    btnSelected: btn.id
                });
            } else {
                // to sync buttons' UI-states
                if (btn == designPreview) btnDesignerPreviewClicked();
                else btnCodePreviewClicked();
            }
        };

        // -------------------------------------------------------------

        //addEvent(designPreview, 'click', function() {
        //    selectBtn(designPreview);
        //    btnDesignerPreviewClicked();
        //});

        function btnDesignerPreviewClicked() {
            codeText.parentNode.style.display = 'none';
            optionsContainer.style.display = 'none';

            hideContainers();
            endLastPath();
        }

        // -------------------------------------------------------------

        //addEvent(codePreview, 'click', function() {
        //    selectBtn(codePreview);
        //    btnCodePreviewClicked();
        //});

        function btnCodePreviewClicked() {
            codeText.parentNode.style.display = 'block';
            optionsContainer.style.display = 'block';

            codeText.focus();
            common.updateTextArea();

            setHeightForCodeAndOptionsContainer();

            hideContainers();
            endLastPath();
        }

        // -------------------------------------------------------------

        var codeText = find('code-text'),
            optionsContainer = find('options-container');

        // -------------------------------------------------------------

        function setHeightForCodeAndOptionsContainer() {
            codeText.style.width = (innerWidth - optionsContainer.clientWidth - 30) + 'px';
            codeText.style.height = (innerHeight - 40) + 'px';

            codeText.style.marginLeft = (optionsContainer.clientWidth) + 'px';
            optionsContainer.style.height = (innerHeight) + 'px';
        }

        // -------------------------------------------------------------

        var isAbsolute = find('is-absolute-points'),
            isShorten = find('is-shorten-code');

        addEvent(isShorten, 'change', common.updateTextArea);
        addEvent(isAbsolute, 'change', common.updateTextArea);

        // -------------------------------------------------------------

    })();
}
