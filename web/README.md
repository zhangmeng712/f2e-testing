# Test Monitor

## 功能

### appium 以及selenium server服务器的管理

Tabs：
- ios hub配置
- android hub配置
- chrome hub配置
- safari hub配置
- ie hub配置
- appium安装地址配置

相关脚本：

常用：
ps aux|grep selenium
netstat -anl |grep

selenium server：
- 启动selenium：selenium-standalone start -- -port 8009
- 关闭selenium: pkill -f selenium-standalone
- 检查状态：http://localhost:4444/wd/hub/status
{"status":0,"sessionId":null,"state":"success","value":{"build":{"version":"2.45.0","revision":"5017cb8","time":"2015-02-26 23:59:50"},"os":{"name":"Mac OS X","arch":"x86_64","version":"10.10.5"},"java":{"version":"1.7.0_79"}},"class":"org.openqa.selenium.remote.Response","hCode":12914162}
- sessions：http://localhost:4444/wd/hub/static/resource/hub.html 最多5个session

appium server

- android：
    - 到appium的源码环境：
    - 检测appium-for-android使用状态： bin/appium-doctor.js –android
    - 检测android设备连接情况： adb kill-server adb devices
    - 初始化android设备：./reset.sh –andorid –verbose
    - 启动服务器：node . -a 127.0.0.1 -p 8002 -U 4df752b06833bfd3 --browser-name Chrome --no-reset
    - 关闭服务器：找到对应node进程kill掉

- ios

### 监控测试进程



### 生成测试结果报表


## 框架设计

- react 构建管理页面
- express 后台服务
- socketio 用于实时传递命令和接收日志
- 命令行工具





