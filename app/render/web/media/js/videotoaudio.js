var Rtcchannel;//RTC管理器
var mymemberId = "";//用户ID
var myavatarUrl;//用户头像
var myname;//用户名字
var token="";//用户token
var channelId;//会议号
var members = [];//成员
var memberscreens = [];//成员共享屏幕
var mediamode,mediatype;
var currentmember;
var flagOpenVideo = false;
var flagOpenAudio = false;
var flagOpenShareScreen = false;
var openShareType = '';//能填的数值 sharescreen sharewhiteboard
var manager;
var mast_dialog;
var dataload_finish = false;
var powerId = {
    rulerId: '',
    speakerId:''
};
//初始化房间
function initroom() {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
        var str = url.substr(1);   
        var strs = str.split("&");   
        for(var i = 0; i < strs.length; i ++) {   
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
        }   
    }   
    var dataId = theRequest["channelSign"];
    manager = new Y2WRTCManager();
    manager.getQuickStart(dataId, function (error, data) {
        if (error) {
            if (error.status == 500) {
                if (error.message == '数据已过期')
                    if (window.confirm("链接已失效,请重新邀请")) {
                        window.opener = null;
                        window.open("", "_self");
                        window.close();
                        window.parent.close();
                    }
            }else{
                alert("加载失败，请刷新重试");
            }
            return;
        }
        var content = JSON.parse(data.content);
        joiny2wRtc(content.roomId, content.memberid, content.imToken);
    });
}
initroom();
var c = 0;
var t;
var offsetWidth, videos_marginWidth;

//加载完毕初始化数据
window.onload = function () {
    document.getElementById('y2wrtc_sound').addEventListener('click', function () {
        if (!dataload_finish)
            return;
        document.getElementById('y2wrtc_sound').disabled = true;
        if (flagOpenAudio) {
            muteAudio(true);
        } else {
            muteAudio(false);
        }
    });
    document.getElementById('y2wrtc_close').onclick = function () {
        if (window.confirm("是否退出？"))
        {  
            window.opener = null;
            window.open("", "_self");
            window.close();
            window.parent.close();
        }
    };
    document.getElementById('y2wrtc_camera').addEventListener('click', function () {
        if (!dataload_finish)
            return;
        document.getElementById('y2wrtc_camera').disabled = true;
        if (flagOpenVideo) {
            closevideo();
        } else {
            openvideo();
        }
    });
    document.getElementById('y2wrtc_sharecontent').addEventListener('click', function () {
        if (!dataload_finish)
            return;
        if (mymemberId != powerId.speakerId) {
            alert('非主讲人没有权限操作!');
            return;
        }
        
        if (flagOpenShareScreen) {
            close_share();
            return;
        }

        $('#channel_mask').removeClass('hide');
        mast_dialog = $('#dialog_sharetype');
        $('#dialog_sharetype').removeClass('hide');
        $("#bt_sharescreen").off("click");
        $("#bt_sharewhiteboard").off("click");
        $("#bt_sharewhitefile").off("click");
        $("#bt_sharescreen").on("click", function () {
            $('#channel_mask').addClass('hide');
            $('#dialog_sharetype').addClass('hide');
                openscreen();
        });
        $("#bt_sharewhiteboard").on("click", function () {
            $('#channel_mask').addClass('hide');
            $('#dialog_sharetype').addClass('hide');
            openwhiteboard(null, 'sharewhiteboard', true);
        });
        $("#bt_sharewhitefile").on("click", function () {
            $('#channel_mask').addClass('hide');
            $('#dialog_sharetype').addClass('hide');
            // openwhiteboard('15', 'sharewhiteboard');
            showsharefiles_dialog(true);
        });

    });

    document.getElementById('channel_mask').addEventListener('click', function () {
        $('#channel_mask').addClass('hide');
        if (mast_dialog)
            mast_dialog.addClass('hide');
    });
   
    document.getElementById('y2wrtc_channelfile').addEventListener('click', function () {
        if (!dataload_finish)
            return;
        showsharefiles_dialog(false);
       
    });
    document.getElementById('fileuploadBt').addEventListener('click', function () {
        $('#input-uploadFile').click();
    });
    $('#input-uploadFile').on('change', function () {
        //获取文件保存
        var fileInput = $('#input-uploadFile').get(0);
        //var imageData = $('#input-uploadFile').cropit('export');
        var file = fileInput.files[0];
        if (file == null)
            return;
        if (file.size == 0) {
            alert("不能传空文件");
            return;
        }
        if (file.type.match('pdf') || file.type.match('powerpoint') || file.type.match('excel') || file.type.match('document')) {
            store_Whiteboard(channelId,myname, 'document', token, file, function (error, data) {
                if (error)
                    return;
                if (channelfiles.length<=0){
                $('#channelcontextinfo').addClass('hide');
                $('#channelfilesgroup').removeClass('hide');
                }
                channelfiles.splice(0, 0, data);
                  showshareFiles(isselect_sharefile);
            });
 
        }
        else {
            alert("不支持此格式类型文件上传");
            return;
        }
    });
    t = setTimeout("timedCount()", 1000);
    offsetWidth = document.body.offsetWidth;
    if (offsetWidth >= 1550) {
        videos_marginWidth = (offsetWidth - (256 * 5 + 20 * 4)) / 2;
    } else {
        videos_marginWidth = (offsetWidth - (256 * 4 + 20 * 3)) / 2;
    }
    document.getElementById("group_video_magin").style.marginLeft = (videos_marginWidth - 20) + 'px';
    document.getElementById("group_video_magin").style.marginRight = videos_marginWidth + 'px';
}
//关闭共享
function close_share() {
        if (openShareType == 'sharescreen') {
            closescreen();
        } else if (openShareType == 'sharewhiteboard') {
            closewhiteboard(true);
        }
        flagOpenShareScreen = false;
        $("#y2wrtc_sharecontent")[0].src = "img/rtc/y2w_openshare.png";
        $("#y2wrtc_sharecontent")[0].title = '开启共享';
}
//显示共享文件dialog
var isselect_sharefile = false;
function showsharefiles_dialog(isselect) {
    isselect_sharefile = isselect;
    $('#channel_mask').removeClass('hide');
    mast_dialog = $('#dialog_channelFiles');
    mast_dialog.removeClass('hide');
    $("#channel_files_close").off("click");
    $("#channel_files_close").on("click", function () {
        $('#channel_mask').addClass('hide');
        $('#dialog_channelFiles').addClass('hide');
    });
    channelfiles = [];
    $('#channelcontextinfo').removeClass('hide');
    var channel_info = document.getElementById("channelcontextinfo");
    channel_info.innerText = "正在加载中....";
    document.getElementById("channelfilesgroup").innerHTML = '';
    $('#channelfilesgroup').addClass('hide');
    get_Whiteboards(channelId, token, 1000, 0, function (error, data) {
        if (error) {
            document.getElementById("channelcontextinfo").innerText = "加载失败，请重试";
            return;
        }
        channelfiles = data.entries;
        if (channelfiles == null || channelfiles.length <= 0) {
            document.getElementById("channelcontextinfo").innerText = "没有任何文件";
        } else {
            $('#channelcontextinfo').addClass('hide');
            $('#channelfilesgroup').removeClass('hide');
            channelfiles = channelfiles.reverse();
            showshareFiles(isselect_sharefile);
        }
    });

}
//显示共享文件列表
var channelfiles = [];
function showshareFiles(isselect) {
    var texthtml = '';
    for (var i = 0; i < channelfiles.length; i++) {
        var date = new Date(channelfiles[i].createdAt);
        var displaytime = (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        channelfiles[i].name = channelfiles[i].name == '' ? '未命名白板' : channelfiles[i].name;
        channelfiles[i].master = channelfiles[i].master == '' ? '未知姓名' : channelfiles[i].master;
        var filelist_bgcolor;
        if (i % 2 == 0) {
            filelist_bgcolor = "filelist_bgcolor1";
        } else {
            filelist_bgcolor = "filelist_bgcolor2";
        }
        var ispoint = '';
        if (isselect) {
            ispoint = 'filelist_cursor';
        }
        var img_icon = 'img/wb/wb_icon_pure.png';
        if (channelfiles[i].type == 'document') {
            img_icon = 'img/wb/wb_icon_file.png';
        }

        var onehtml = "<div class='filelist_body " + ispoint + " " + filelist_bgcolor + "' id='wbfile_" + channelfiles[i].id + "'><img class='filelist_img' src='" + img_icon + "'><div class='filelist_filename'>" + channelfiles[i].name + "</div><div class='filelist_byname'>by:" + channelfiles[i].master +
        "</div><div class='filelist_bytime'>" + displaytime + "</div><div class='filelist_bysize'> </div></div>";
        texthtml = texthtml + onehtml;
    }
    document.getElementById("channelfilesgroup").innerHTML = texthtml;
    if (isselect) {
        // openwhiteboard('15', 'sharewhiteboard');


        $("#channelfilesgroup .filelist_body").each(function () {
            $(this).click(function () {
                var wbfile_id = $(this).attr('id');
                wbfile_id = wbfile_id.replace("wbfile_", "");
                openwhiteboard(wbfile_id, 'sharewhiteboard', true);
                $('#channel_mask').addClass('hide');
                $('#dialog_channelFiles').addClass('hide');
            });
        });


    }
}

//显示大屏的个人
function showmaxMyInfo() {
    document.getElementById("y2w_detailimg").src = myavatarUrl;
    document.getElementById("y2w_detailtext").innerText = myname;
    if (myname.length > 0) {
        document.getElementById("y2w_lastname").innerText = myname.substring(myname.length - 1, myname.length);
    } else {
        document.getElementById("y2w_lastname").innerText = myname;
    }
}
//显示多人视频两边滑块 并添加点击事件
function scoll_group_videos() {
    var scollleftText = "<img src='img/rtc/group_video_left.png' id='videos_scollleft' class='pull-left videos_scoll' style='margin-left:" + (videos_marginWidth - 80) + "px;'>";
    var scollrightText = "<img src='img/rtc/group_video_right.png' id='videos_scollright' class='pull-right videos_scoll' style='margin-right:" + (videos_marginWidth - 80) + "px;'>";
    document.getElementById("group_video_scroll").innerHTML = scollleftText + scollrightText;

    document.getElementById('videos_scollleft').addEventListener('click', function () {
        scroll_to_videos('left');
    });
    document.getElementById('videos_scollright').addEventListener('click', function () {
        scroll_to_videos('right');
    });
}
//滑动滑动事件
function scroll_to_videos(direction) {
    var videos = $(".videos_scoll_space")[0];
    var clientWidth = videos.clientWidth;
    var scrollWidth = videos.scrollWidth;
    var scrollLeft = videos.scrollLeft;
    if (direction == 'left') {
        if (scrollLeft < 340) {
            videos.scrollLeft = 0;
        } else {
            videos.scrollLeft = scrollLeft - 340;
        }
    } else if (direction == 'right') {
        var clientwidth_left = clientWidth + scrollLeft;
        if ((clientwidth_left + 340) > scrollWidth) {
            videos.scrollLeft = scrollLeft + scrollWidth - clientwidth_left;
        } else {
            videos.scrollLeft = scrollLeft + 340;
        }
    }
}
//时间显示
function timedCount() {
    var rtctime;
    if (c < 60) {
        if(c<10){
            rtctime = "00:0" + c;
        }else{
            rtctime = "00:" + c;
        }
    } else if(c<3600){
        if (c / 60 < 10) {
            if(c%60<10){
                rtctime = "0" + parseInt(c / 60) + ":0" + c%60;
            }else{
                rtctime = "0" + parseInt(c / 60) + ":" + c % 60;
            }
        } else {
            if (c % 60 < 10) {
                rtctime = parseInt(c / 60) + ":0" + c % 60;
            } else {
                rtctime = parseInt(c / 60) + ":" + c % 60;
            }
        }
    } else {
        rtctime = parseInt(c / 3600);
        var mu = parseInt(c % 3600 / 60);
        var se = c % 3600 % 60;
        if (mu < 10) {
            if (se < 10) {
                rtctime = rtctime + ":0" + mu + ":0" + se;
            } else {
                rtctime = rtctime + ":0" + mu + ":" + se;
            }
        } else {
            if (se < 10) {
                rtctime = rtctime + ":" + mu + ":0" + se;
            } else {
                rtctime = rtctime + ":" + mu + ":" + se;
            }
        }
            
    }
    document.getElementById('y2wrtc_time').innerText = rtctime;
    c = c + 1;
    t = setTimeout("timedCount()", 1000);
}
//加入会议获取音视频
function joiny2wRtc(roomId, memberId, Imtoken) {
    
    manager.getRoomInfo(roomId, Imtoken, function (error,data) {
        if (error) {
            if (error.status == 500) {
                if(error.message=='数据已过期')
                    if (window.confirm("链接已失效,请重新邀请")) {
                        window.opener = null;
                        window.open("", "_self");
                        window.close();
                        window.parent.close();
                    }
            }else{
                alert("加载失败，请刷新重试");
            }
            return;
        }
        channelId = data.channelId;
        mediamode = data.mode;
        mediatype = data.type;
        var iddelete = data.isDelete;
        //mediamode = "AVSW";//测试，最后删除
        if (mediamode.indexOf('S') > -1 || mediamode.indexOf('W') > -1) {
            document.getElementById("titile_tools").style.width = '350px';
            $('#y2wrtc_sharecontent').removeClass('hide');
            if (mediamode.indexOf('W') > -1) {
                $('#bt_sharescreen').removeClass('hide');
                if (mediamode.indexOf('S') > -1) {
                    $('#y2wrtc_channelfile').removeClass('hide');
                    $('#bt_sharewhiteboard').removeClass('hide');
                    $('#bt_sharewhitefile').removeClass('hide');
                } else {
                    $('#y2wrtc_channelfile').addClass('hide');
                    $('#bt_sharewhiteboard').addClass('hide');
                    $('#bt_sharewhitefile').addClass('hide');
                }
            } else {
                $('#bt_sharescreen').addClass('hide');
                if (mediamode.indexOf('S') > -1) {
                    $('#y2wrtc_channelfile').removeClass('hide');
                    $('#bt_sharewhiteboard').removeClass('hide');
                    $('#bt_sharewhitefile').removeClass('hide');
                }
            }
        } else {
            document.getElementById("titile_tools").style.width = '210px';
            $('#y2wrtc_sharecontent').addClass('hide');
            $('#y2wrtc_channelfile').addClass('hide');
        }

        manager.getMemberInfo(roomId, memberId,Imtoken, function (error, data) {
            if (error) {
                return
            }
            mymemberId = data.uid;
            myname = data.name;
            myavatarUrl = data.avatar;
            token = Imtoken;
            var isdelete = data.isDelete;
            showmaxMyInfo();
            manager.join(mymemberId, myname, myavatarUrl, token, channelId, function (error, channel) {
                if (error) {
                    if (error.errorcode == 500) {//房间结束关闭
                        if (window.confirm("聊天已结束，请重新开启")) {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                            window.parent.close();
                        }
                    }
                    return;
                }
                dataload_finish = true;
                Rtcchannel = channel;
                getmymember();
                listenevent();
                if (mediamode.indexOf('V') > -1 && mediamode.indexOf('A') > -1) {
                    openvideo();
                }
                openaudio();
            });
        });

    });
}
//权限变化
function power_update() {
    for (var i = 0; i < members.length; i++) {
        var userid = members[i].uid;
        if (userid == powerId.rulerId) {
            $('#imgruler_' + userid).removeClass('hide');
        } else {
            $('#imgruler_' + userid).addClass('hide');
        }
        if (userid == powerId.speakerId) {
            $('#imgspeaker_' + userid)[0].src = 'img/rtc/cam_speaker.png';
        } else {
            $('#imgspeaker_' + userid)[0].src = 'img/rtc/cam_nospeaker.png';
        } 

        if (mymemberId == powerId.rulerId || mymemberId == powerId.speakerId) {
            if (userid == powerId.speakerId) {
                $('#imgspeakerset_' + userid).addClass('hide');
            }else{
            $('#imgspeakerset_' + userid).removeClass('hide');
            $('#imgspeakerset_' + userid).off("click");
            $('#imgspeakerset_' + userid).on("click", function () {
                var choose_userid = $(this).attr('id');
                choose_userid = choose_userid.replace("imgspeakerset_", "");
                //判断是否正在共享，如果共享，关闭共享
                if (flagOpenShareScreen) {
                    if (window.confirm("正在共享，是否关闭并转让？")) {
                        close_share();
                        Rtcchannel.sendpower_speaker(choose_userid);
                    }             
                }else{
                    Rtcchannel.sendpower_speaker(choose_userid);
                }
            });
            }
        } else {
            $('#imgspeakerset_' + userid).addClass('hide');
        }
    }
}
//添加一成员显示
function addelement(member,type) {
    var insertText;
    if (type == 'video') {
    member.videotag = "groupchat_" + member.uid;
    members[members.length] = member;
        //var imgerror = "onerror = \"javascript: this.poster = ''\"";
    var lastname = '';
    if (member.name.length>0){
         lastname = member.name.substring(member.name.length - 1, member.name.length);
    }
    var videonamediv = "<div class='group_videos_text'><strong>" + lastname + "</strong></div>";
    var setspeakerdiv = "<div class='setspeaker_bg'><img class='hide' src='img/rtc/cam_ruler.png' id='imgruler_" + member.uid + "' style='margin: 8px 0px 8px 8px;'><span style='color: #fff;font-size: 15px;width: 200px;margin-left: 5px;'>" + member.name + "</span>" +
       "<img src='img/rtc/cam_nospeaker.png' style='float: right;margin: 5px 8px;'id='imgspeaker_" + member.uid + "'><i class='setspeaker_set hide' src='img/rtc/cam_speakset.png' id='imgspeakerset_" + member.uid + "' title='转为主讲人'></div>";

    if (member.uid == mymemberId) {
        insertText = "<li id='video_" + member.uid + "'>" + videonamediv + "<video id='" + member.videotag + "' autoplay poster='" + member.avatarUrl + "'" + " class='videos_border_active'></video>" + setspeakerdiv + "</li>";
        currentmember = member;
    } else {
        insertText = "<li id='video_" + member.uid + "'>" + videonamediv + "<video id='" + member.videotag + "' autoplay poster='" + member.avatarUrl + "'" + " class='videos_border_trans'></video>" + setspeakerdiv + "</li>";
    }
    document.getElementById("addgroup_videos").innerHTML = document.getElementById("addgroup_videos").innerHTML + insertText;
    } else if (type == 'screen') {
        member.screentag = "groupscreen_" + member.uid;
        memberscreens[memberscreens.length] = member;
        //var imgerror = "onerror = \"javascript: this.poster = ''\"";
        var lastname = '';
        if (member.name.length>0){
            lastname = member.name.substring(member.name.length - 1, member.name.length);
        }
        var videonamediv = "<div class='group_videos_text'><strong>" + lastname + "</strong></div>";

        if (member.uid == mymemberId) {
          
        } else {
            insertText = "<li id='screen_" + member.uid + "'>" + videonamediv + "<video id='" + member.screentag + "' autoplay poster='" + member.avatarUrl + "'" + " class='videos_border_trans'></video></li>";
        }
        document.getElementById("addgroup_videos").innerHTML =insertText+ document.getElementById("addgroup_videos").innerHTML;
    }
    
    if (offsetWidth >= 1550) {
        if ((members.length + memberscreens.length)> 5) {
            if(document.getElementById("group_video_scroll").innerHTML != "")
              scoll_group_videos();
        }
    } else {
        if ((members.length + memberscreens.length) > 4) {
            if (document.getElementById("group_video_scroll").innerHTML != "")
              scoll_group_videos();
        }
    }
    setTimeout(function () {

        $("#addgroup_videos li video").each(function () {
            $(this).off("click");
            $(this).on("click", function () {
                var groupchatid = $(this).attr('id');
                if (groupchatid.indexOf("groupchat_") > -1) {
                    groupchatid = groupchatid.replace("groupchat_", "");
                    if (currentmember.uid == groupchatid && maxvideoType == 'video')
                        return;
                    click_groud_video(groupchatid);
                }else if(groupchatid.indexOf("groupscreen_")>-1){
                    groupchatid = groupchatid.replace("groupscreen_", "");
                    if (currentmember.uid == groupchatid && maxvideoType == 'screen')
                        return;
                    click_groud_screen(groupchatid);
                }
               
            });
        });
        //document.getElementById('groupchat_' + member.uid).addEventListener('click', function () {
        //    var groupchatid = $(this).attr('id');
        //    groupchatid = groupchatid.replace("groupchat_", "");
        //    if (currentmember.uid == groupchatid)
        //        return;
        //    click_groud_video(groupchatid);
        //});
    }, 2000); 
}
//点击成员切换到最大化

var maxvideoType = 'video';//最大化默认显示时视频 video screen
function click_groud_video(groupchatid) {
    var oldelement = $('#' + currentmember.videotag);
    oldelement.removeClass('videos_border_active');
    oldelement.addClass('videos_border_trans');
    var newelement = $('#groupchat_' + groupchatid);
    newelement.removeClass('videos_border_trans');
    newelement.addClass('videos_border_active');
    maxvideoType = 'video';
    for (var i = 0; i < members.length; i++) {
        if (members[i].uid == groupchatid) {
            currentmember = members[i];
            document.getElementById("y2w_detailimg").src = currentmember.avatarUrl;
            document.getElementById("y2w_detailtext").innerText = currentmember.name;
            if (currentmember.name.length > 0) {
                document.getElementById("y2w_lastname").innerText = currentmember.name.substring(currentmember.name.length - 1, currentmember.name.length);
            } else {
                document.getElementById("y2w_lastname").innerText = currentmember.name;
            }
            
            if (Rtcchannel)
                Rtcchannel.maxScreenDisplay(currentmember.uid, currentmember.videourl);
            break;
        }
    }
}
//点击共享桌面切换到最大化
function click_groud_screen(groupchatid) {
    var oldelement = $('#' + currentmember.screentag);
    oldelement.removeClass('videos_border_active');
    oldelement.addClass('videos_border_trans');
    var newelement = $('#groupscreen_' + groupchatid);
    newelement.removeClass('videos_border_trans');
    newelement.addClass('videos_border_active');
    maxvideoType = 'screen';
    for (var i = 0; i < members.length; i++) {
        if (members[i].uid == groupchatid) {
            currentmember = members[i];
            document.getElementById("y2w_detailimg").src = currentmember.avatarUrl;
            document.getElementById("y2w_detailtext").innerText = currentmember.name;
            if (currentmember.name.length > 0) {
                document.getElementById("y2w_lastname").innerText = currentmember.name.substring(currentmember.name.length - 1, currentmember.name.length);
            } else {
                document.getElementById("y2w_lastname").innerText = currentmember.name;
            }
          
            if (Rtcchannel)
                Rtcchannel.maxScreenDisplay(currentmember.uid, currentmember.screenurl);
            break;
        }
    }
}
//删除一个成员
function removeelement(userid,type) {
    if(type =='video'){
        document.getElementById("addgroup_videos").removeChild(document.getElementById("video_" + userid));
    } else if (type == 'screen') {
        document.getElementById("addgroup_videos").removeChild(document.getElementById("screen_" + userid));
    }
    if (currentmember.uid == userid && maxvideoType == type) {
        click_groud_video(mymemberId);
    }
    if (offsetWidth >= 1550) {
        if ((members.length + memberscreens.length) <= 5) {
            document.getElementById("group_video_scroll").innerHTML = "";
        }
    } else {
        if ((members.length + memberscreens.length)  <= 4) {
            document.getElementById("group_video_scroll").innerHTML = "";
        }
    }
   
}
//打开音频
function openaudio() {
    if (Rtcchannel)
        Rtcchannel.openAudio();
}
//是否静音
function muteAudio(ismute) {
    if (!Rtcchannel)
        return;
    Rtcchannel.muteAudio(ismute);
}
//打开视频
function openvideo() {
    if (Rtcchannel)
        Rtcchannel.openVideo();
}
//关闭视频
function closevideo() {
    if (Rtcchannel)
        Rtcchannel.closeVideo();
}
//打开共享桌面
function openscreen() {
    if (Rtcchannel)
        Rtcchannel.openScreen(function (userid, error) {
            if (error) {//失败
                return;
            }
            //成功
            flagOpenShareScreen = true;
            openShareType = 'sharescreen';
            $("#y2wrtc_sharecontent")[0].src = "img/rtc/y2w_closeshare.png";
            $("#y2wrtc_sharecontent")[0].title = '关闭共享';
        });
}
//关闭共享桌面
function closescreen() {
    if (Rtcchannel)
        Rtcchannel.closeScreen();
}
//打开白板
var whiteboard_instance;
function openwhiteboard(whiteboardId, sharetype, isaccord) {//isaccord是否是分享  true表示分享  false表示打开
    flagOpenShareScreen = true;
    openShareType = sharetype;
    $("#y2wrtc_sharecontent")[0].src = "img/rtc/y2w_closeshare.png";
    $("#y2wrtc_sharecontent")[0].title = '关闭共享';
    $('#whiteboard_area').removeClass('hide');
    whiteboard_instance = new whiteboardManager();
    whiteboard_instance.start_whiteboard(whiteboardId, channelId, token, isaccord);
}
//关闭白板
function closewhiteboard(isaccord) {//isaccord是否是分享方关闭 true表示是 
    $('#whiteboard_area').addClass('hide');
    whiteboard_instance.closefile_pages(isaccord);
}
//白板翻页
function turnpage_whiteboard(pageId) {
    whiteboard_instance.gotoconfirmpage(pageId);
}
//获取自己的信息
function getmymember(){
    var member =  Rtcchannel.getmymember();
    member.videotag= "groupchat_"+member.uid;
    addelement(member,'video');
}
var flagvideosshow = true;
function switch_videosshow() {
    if (flagvideosshow) {
        flagvideosshow = false;
        $(".group_videos").addClass("hide");
        $(".group_videos").removeClass("fadeInUpBig");
        $(".videos_show_hide").removeClass("videos_show_hide_expansion");
        $(".videos_show_hide").addClass("videos_show_hide_packup");
        $(".videos_show_hide").removeClass("fadeInUpBig");
    } else {
        flagvideosshow = true;
        $(".group_videos").removeClass("hide");
        $(".group_videos").addClass("fadeInUpBig");
        $(".videos_show_hide").removeClass("hide");
        $(".videos_show_hide").removeClass("videos_show_hide_packup");
        $(".videos_show_hide").addClass("videos_show_hide_expansion");
        $(".videos_show_hide").addClass("fadeInUpBig");
    }
}
//事件监听
function listenevent(){
    Rtcchannel.listenOnJoin(function (member) {
        var find = false;
        for(var i = 0;i<members.length;i++){
            if(members[i].uid==member.uid){
                find = true;
                break;
            }
        }
        if(!find){
            addelement(member, 'video');
        }
    });
    Rtcchannel.listenOnLeave(function (member) {
        for(var i = 0;i<members.length;i++){
            if (members[i].uid == member.uid) {
                members.splice(i, 1);
                removeelement(member.uid,'video');
                break;
            }
        }
        for (var i = 0; i < memberscreens.length; i++) {
            if (memberscreens[i].uid == member.uid) {
                memberscreens.splice(i, 1);
                removeelement(member.uid, 'screen');
                break;
            }
        }
    });
    Rtcchannel.listenOnOpenedAudio(function (member) {

    });
    Rtcchannel.listenOnClosedAudio(function (member) {

    });
    Rtcchannel.listenOnErrorInAudio(function (error) {

    });
    Rtcchannel.listenOnOpenedVideo(function (member) {

    });
    Rtcchannel.listenOnOpenedScreen(function (memberid) {

        for (var i = 0; i < members.length; i++) {
            if (members[i].uid == memberid) {
                var find = false;
                for (var j = 0; j < memberscreens.length; j++) {
                    if (memberscreens.uid == memberid) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    addelement(members[i], 'screen');
                }
                break;
            }
        }
    });
    Rtcchannel.listenOnClosedVideo(function (member) {

    });
    Rtcchannel.listenOnClosedScreen(function (memberid) {
        for (var i = 0; i < memberscreens.length; i++) {
            if (memberscreens[i].uid == memberid) {
                memberscreens.splice(i, 1);
                removeelement(memberid, 'screen');
                break;
            }
        }
    });
    Rtcchannel.listenOnErrorInVideo(function (error) {

    });
    Rtcchannel.listenOnPowerUpdate(function (rulerId, speakerId) {
        if (rulerId != null)
            powerId.rulerId = rulerId;
        powerId.speakerId = speakerId;
        power_update();
    });
}
