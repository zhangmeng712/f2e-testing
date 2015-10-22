# Appium的源码编译安装（mac 平台）

Appium是现在比较活跃的开源自动化测试平台，因为更新速度很快，建议编译安装，了解其更多有意思的功能。
Appium支持ios android selendroid的自动化测试。在mac下配置ios环境还是相对简单的，但是android真机的配置就不是那么简单了，在此详细记录基于源码的编译安装。


## 准备工作 node
- git clone https://github.com/appium/appium.git
- 安装好node环境（brew安装最好）
- 安装 mocha 和grunt-cli

```shell
npm install -g mocha
npm install -g grunt-cli
```


## android真机配置

因为android虚拟器跑起来非常慢，如果不是专业的android的开发，安装跑andorid studio环境也没有必要
有对应的apk和sdk使用真机就能跑我们的测试脚本了。

### 准备工作：
- 安装java jdk 配置JAVA_HOME
- 安装android jdk，可以在线安装（国内速度超慢），所以快捷的方式是下载adt-bundle，解压后直接可用，<a href="https://dl.google.com/android/adt/adt-bundle-mac-x86_64-20140702.zip" target="_blank">下载地址</a>
- 配置ANDROID_HOME
- 环境变量的配置代码见下方:
- 执行环境检测 bin/appium-doctor.js --android 出现如下结果证明android环境配置成功

```shell
# ~/.bash_profile的配置内容
# 修改完之后source ~/.bash_profile生效
```
export ANDROID_HOME=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk
export PATH=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk/platform-tools:$PATH
export PATH=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk/tools:$PATH
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_79.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

```
![](http://gtms04.alicdn.com/tps/i4/TB1d.8kKXXXXXXFaXXXHH2ZNpXX-822-195.jpg)

### 配置手机

- 开启开发者选项，设置-{}开发者选项，如果没有找到，<a href="http://android.d.cn/news/83907.html" target="_blank">参考</a>
- 打开USB调试（如下图）
- 部分手机需要在 连接USB的时候选用 MTP媒体模式才会生效
- 在命令行执行如下指令，能够列出后（如果不行, 重新插拔一下usb，还可以尝试<a href="https://nishantverma.gitbooks.io/appium-for-android/content/executing_test_on_real_devices/index.html">方法</a>）

![](http://gtms02.alicdn.com/tps/i2/TB1Fb0vKXXXXXXeXVXXeOeo8FXX-750-1000.jpg)

```shell
adb kill-server
adb devices
```

其中list出来的就是手机的udid，用于后面的测试使用，如下图
![](http://gtms03.alicdn.com/tps/i3/TB1diXtKXXXXXXMXVXXct.03pXX-675-79.jpg)

### 执行初始化脚本

按照上面的步骤执行完成之后，运行命令./reset.sh --andorid --verbose即可。
在没有读这个reset.sh脚本的时候真的是被各种的环境搞的头晕脑胀，各种报错，包括：
基本都是有命令运行不通造成的，所以在这里大概介绍一下在appium reset android中的到底做了些什么，帮助大家理解这个启动脚本，以便配合自己的应用解决编译的问题，
这个也是源码编译的好处之一，可以及时的解决更新服务。

- android API 不匹配
- Device chrome not configured yet
- uninstall io.appium.android.ime卡住不再运行

![](http://gtms03.alicdn.com/tps/i3/TB1WaXHKXXXXXb6XpXXeOeo8FXX-750-1000.jpg)

### reset.sh分析

```shell

reset_android() {
    echo "RESETTING ANDROID"
    require_java
    echo "* Configuring Android bootstrap"
    run_cmd rm -rf build/android_bootstrap
    run_cmd "$grunt" configAndroidBootstrap
    echo "* Building Android bootstrap"
    run_cmd "$grunt" buildAndroidBootstrap
    reset_unlock_apk
    reset_unicode_ime
    reset_settings_apk
    if $include_dev ; then
        reset_apidemos
        reset_toggle_test
        if $npmlink ; then
            link_appium_adb
        fi
    fi
    echo "* Setting Android config to Appium's version"
    run_cmd "$grunt" setConfigVer:android
    reset_chromedriver
}

```

- 配置Android bootstrap
    - 删除下build/android_bootstrap目录
    - 执行grunt configAndroidBootstrap：配置UiAutomation需要的编译文件 appium/lib/devices/android/bootstrap/build.xml project.properties local.properties
        - 生成AppiumBootstrap的编译文件：用于运行 android create uitest-project -n AppiumBootstrap -t android-19 -p xx/appium/lib/devices/android/bootstrap/
- 编译 Android bootstrap
    - grunt buildAndroidBootstrap：使用ant编译AppiumBootstrap.jar，放置到appium/build/android_bootstrap/下
- 编译apk文件（build目录下）
    - 编译 unlock apk: 唤醒和解锁andorid手机或是虚拟器<a href="https://github.com/appium/unlock_apk" target="_blank">详情</a>
    - 编译 unicode ime apk: android对ASCII码的支持不好，所以会安装这个utf7的输入法，将sendKeys中的输入转为unicode识别的编码，<a href="https://github.com/appium/io.appium.android.ime" target="_blank">详情</a>
    - 编译 appium-settings apk:用于控制android系统 <a href="https://github.com/appium/io.appium.settings">详情</a>
- 如果开启了测试模式 --dev参数
    - 编译sample-code下的app：ToggleTest apiDemos
- 更新 appium-adb模块：运行./bin/npmlink.sh -l appium-adb
- 更新appium的版本号
- reset_chromedriver 详情<a href="https://github.com/appium/appium-chromedriver">参考</a>

### 运行测试用例

- node . -U  4df752b06833bfd3 （显示下面的提示证明Appium Server能够正常启动）
- 详细的运行参数<a href="https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/server-args.md" target="_blank">参考</a>
- 运行测试用例 : mocha wd-android-helloworld.js （<a href="https://github.com/admc/wd" target="_blank">wd.js</a>）
- 其中支持原生的browser、chrome、还有apk的测试

![](http://gtms04.alicdn.com/tps/i4/TB11TKIKXXXXXbaXXXX_k.yPXXX-795-103.jpg)

```javascript
var wd = require("wd");
var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 4723
});

driver
    .init({
        browserName: 'Chrome',//Chrome or Browser(原生，默认主页是google建议最好翻墙不然卡住)
        platformName: 'Android',
        platformVersion: '4.4.4',
        deviceName: 'Android Emulator'
      //,app: '/Users/zhangmeng/Downloads/com.taobao.taobao-5.3.1-121.apk' //如果选择测试app的内容 browserName设置为'';
      //执行app后会把对应的apk安装到真机中
    })
    .get('http://www.baidu.com')
    .sleep(5000)
    .title().then(function (title){
        console.log('this is the website title', title)
    })
    .quit()
    .done();

```

## ios 虚拟器配置

### 配置和启动服务

```shell
$ git clone https://github.com/appium/appium.git
$ cd appium
$ ./reset.sh --ios --verbose
$ sudo ./bin/authorize-ios.js # for ios only 修改权限
$ node .
```

### 测试脚本

参见 <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/mobile/safari-wd-search-test.js" target="_blank">safari-wd-search-test.js</a>

## 参考

- https://github.com/appium/appium/blob/master/docs/en/contributing-to-appium/appium-from-source.md
- https://github.com/appium/appium/blob/master/docs/en/contributing-to-appium/grunt.md
- http://university.utest.com/android-ui-testing-uiautomatorviewer-and-uiautomator/
- http://developer.android.com/tools/help/shell.html
