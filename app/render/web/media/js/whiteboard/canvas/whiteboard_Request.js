//var whiteboard_url = "https://192.168.0.187:8081/v1/"
var whiteboard_url = "https://121.40.215.56:443/v1/"

//获取所有白板
function get_Whiteboards(channelId, token, limit, offset,cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards',
        type: 'GET',
        data: { channelId: channelId, limit: limit, offset: offset },
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });
}
//存储白板 type document normal
function store_Whiteboard(channelId,master, type,token,fileObj,cb) {
    var fileMD5;
    var wb_name = new Date().toLocaleString()+'白板';
    var sendjson = {
        channelId: channelId,
        type: type,
        name: wb_name,
        master: master
    };
    if (fileObj) {
        var form = new FormData();
        form.append("channelId", channelId);
        form.append("type", type);
        form.append("file", fileObj);
        form.append("name", fileObj.name);
        form.append("master", master);
        
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                chunkSize = 2097152, // read in chunks of 2MB
        chunks = Math.ceil(fileObj.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        frOnload = function(e){
            spark.append(e.target.result); 
            // append array buffer
            currentChunk++;
            if (currentChunk < chunks)
                loadNext();
            else {
                fileMD5 = spark.end();

                var FileController = whiteboard_url + 'whiteboards'; // 接收上传文件的后台地址 
                // XMLHttpRequest 对象
                var xhr = new XMLHttpRequest();
                xhr.open("post", FileController, true);
                xhr.onload = function () {
                    document.getElementById('fileuploadBt').disabled = false;
                    document.getElementById('fileuploadBt').innerHTML = "上传文件";
                    var content = this.responseText;
                    var dataJson = JSON.parse(content);
                    cb(null, dataJson);
                };
                xhr.onerror = function () {
                    alert("上传失败,请重新上传!");
                    document.getElementById('fileuploadBt').disabled = false;
                    document.getElementById('fileuploadBt').innerHTML = "上传文件";
                };

                xhr.upload.addEventListener("progress", function (evt) {
                    
                    var progressmax = evt.total;
                    var progressvalue = evt.loaded;
                    var percent_point = Math.round(evt.loaded / evt.total * 100);
                    document.getElementById('fileuploadBt').innerHTML = "上传" +percent_point + "%";
                    if (percent_point == 100) {
                        document.getElementById('fileuploadBt').innerHTML = "正在转档";
                    }
                }, false);
                if (token)
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                if (fileMD5)
                    xhr.setRequestHeader('Content-MD5', fileMD5);
                xhr.send(form);
                document.getElementById('fileuploadBt').disabled = true;
            }  
        },
        frOnerror = function () {
            $.ajax({
                url: whiteboard_url + 'whiteboards',
                type: "POST",
                data: sendjson,
                beforeSend: function (req) {
                    if (token)
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    if (fileMD5)
                        req.setRequestHeader('Content-MD5', fileMD5);
                },
                success: function (data) {
                    cb(null, data);
                },
                error: function (data) {
                    var error = JSON.parse(e.responseText);
                    cb(error, null);
                }
            });
        };
        function loadNext() {
            var fileReader = new FileReader();
            fileReader.onload = frOnload;
            fileReader.onerror = frOnerror;
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= fileObj.size) ? fileObj.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(fileObj, start, end));
        };
		loadNext();
    } else {
        $.ajax({
            url: whiteboard_url + 'whiteboards',
            type: "POST",
            data: sendjson,
            beforeSend: function (req) {
                if (token)
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                if (fileMD5)
                    req.setRequestHeader('Content-MD5', fileMD5);
            },
            success: function (data) {
                cb(null, data);
            },
            error: function (data) {
                var error = JSON.parse(e.responseText);
                cb(error, null);
            }
        });
    } 
}
//获取白板信息
function get_whiteboard(whiteboardId,token,cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId,
        type: 'GET',
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });
}
//更新白板
function put_whiteboard(whiteboardId,recentPage,token, cb) {

    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId,
        type: 'PUT',
        dataType: 'json',
        data: { recentPage:recentPage},
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });
}
//存储白板一页数据
function store_whiteboardpage(whiteboardId, type, index, width, height,data,token,cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId + '/pages',
        type: 'POST',
        data: { whiteboardId: whiteboardId, type: type, index: index, width: width, height: height ,data:data},
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });

}
//获取一个白板所有页面信息
function get_whiteboardpages(whiteboardId, token, cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId + '/pages',
        type: 'GET',
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });
}
//存储白板笔画 type  "pen" , "eraser" , "text" ]
function store_whiteboardstrokes(whiteboardId,pageId,text, type, data, token, cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId + '/pages/' +pageId+ '/strokes',
        type: 'POST',
        data: { pageId: pageId, type: type,text:text, data: data },
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });

}
//获取白板笔画
function get_whiteboardstrokes(whiteboardId, pageId, limit, offset,token, cb) {
    $.ajax({
        url: whiteboard_url + 'whiteboards/' + whiteboardId + '/pages/'+pageId+"/strokes",
        type: 'GET',
        data: { whiteboardId: whiteboardId, pageId: pageId, limit: limit, offset: offset },
        dataType: 'json',
        beforeSend: function (req) {
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            cb(null, data);
        },
        error: function (e) {
            var error = JSON.parse(e.responseText);
            cb(error, null);
        }
    });
}