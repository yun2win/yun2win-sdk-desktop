# yun2win-sdk-desktop
Yun2win为企业和开发者提供最安全的即时通讯(IM)云服务和基于Web RTC下的融合通讯云服务，通过yun2win的SDK及API，快速拥有IM(instant messaging)、实时音视频（Audio and video Communication）、屏幕共享（Screen sharing）、电子白板（whiteboard）通讯能力。


    NSURL *appURL = [[NSBundle mainBundle] URLForResource:@"Y2WIMQuick" withExtension:@"app"];
    [[NSWorkspace sharedWorkspace] openURL:appURL options:NSWorkspaceLaunchDefault configuration:@{NSWorkspaceLaunchConfigurationArguments: @[@"username=111@qq.com",@"password=111111"]} error:nil];
    
System.Diagnostics.Process.Start("\\\\psf\\Home\\Documents\\Y2WIMQuickStart-Electron\\dist\\win-unpacked\\Y2WRTCQuick.exe", "username=111@qq.com password=111111"); 
