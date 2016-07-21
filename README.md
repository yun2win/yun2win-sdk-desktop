[![LOGO](http://8225117.s21i-8.faiusr.com/4/ABUIABAEGAAg5o3ztwUoivKDrgQwuAE4Mg.png)](http://www.yun2win.com)
# yun2win-sdk-desktop V_0.0.2
Yun2win为企业和开发者提供最安全的即时通讯(IM)云服务和基于Web RTC下的融合通讯云服务，通过yun2win的SDK及API，快速拥有即时通讯(instant messaging)、实时音视频（Audio and video Communication）、屏幕共享（Screen sharing）、电子白板（whiteboard）通讯能力。

-
### 目录结构

```
┌── app
│   ├── assets :静态资源
│   │   ├── osx :mac相关资源
│   │   └── win :windows相关资源
│   ├── inject :内容注入脚本
│   │   ├── css :注入样式文件
│   │   └── js :注入脚本文件
│   ├── main :主进程代码
│   ├── node_modules :依赖模块
│   ├── render :渲染进程代码
│   │   ├── web :yun2win-sdk-web代码
├── dist :打包目录
└── node_modules :编译依赖模块
```
-
### 快速集成

##### 1.现有应用添加IM功能 :
	把编译好的可执行文件作为静态文件加入应用工程内，需要时以独立应用身份运行。
    调用方法:
```
Objective-C:

NSURL *appURL = [[NSBundle mainBundle] URLForResource:@"Y2WIMQuick" withExtension:@"app"];
[[NSWorkspace sharedWorkspace] openURL:appURL options:NSWorkspaceLaunchDefault configuration:@{NSWorkspaceLaunchConfigurationArguments: @[@"username=111@qq.com",@"password=111111"]} error:nil];
```

```
C#

System.Diagnostics.Process.Start("\\\\psf\\Home\\Documents\\Y2WIMQuickStart-Electron\\dist\\win-unpacked\\Y2WRTCQuick.exe", "username=111@qq.com password=111111");
```
    
##### 2.开始一个新的应用
    在此源码基础上修改进行二次开发，并修改icon、签名等信息后自行编译。


-
### 链接
官方网站 : http://www.yun2win.com<br>
安卓 : https://github.com/yun2win/yun2win-sdk-android<br>
iOS : https://github.com/yun2win/yun2win-sdk-iOS<br>
Web : https://github.com/yun2win/yun2win-sdk-web<br>
Server : https://github.com/yun2win/yun2win-sdk-server<br>

-
### License
liyueyun-SDK-iOS is available under the MIT license. See the [LICENSE](https://github.com/yun2win/yun2win-sdk-iOS/blob/master/LICENSE) file for more info.
