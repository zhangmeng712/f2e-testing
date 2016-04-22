# Appium

##简介	

mobile端的开发越来越火热，为了保证开发质量，也有很多针对移动端的测试工具应运而生。<a href="http://appium.io" target="_blank">Appium</a>就是其中很活跃的开源框架。本质上它包括两部分内容：

- 基于express的server用于发送/接收client端的协议命令
- 作为bootstrap客户端用于将命令传递给对应的UIAutomator/UIAutomation/Google’s Instrumentation

Appium最大的特色就是<strong>支持ios/android/firefoxos多种平台的测试，native、h5、hybrid都支持，以及所有支持jsonWireProtocal协议的脚本语言：python，java，nodejs ruby都可以用来书写用例</strong>。

## architecture

ios
<img src="http://www.3pillarglobal.com/sites/default/files/appium1.png">

android
<img src="http://www.3pillarglobal.com/sites/default/files/appium2.png">

## 安装

### android真机

因为android虚拟器跑起来非常慢，如果不是专业的android的开发，安装跑andorid studio环境也没有必要
有对应的apk和sdk使用真机就能跑我们的测试脚本了。

#### 准备工作：
- 安装java jdk 配置JAVA_HOME
- 安装android jdk，可以在线安装（国内速度超慢），所以快捷的方式是下载adt-bundle，解压后直接可用，<a href="https://dl.google.com/android/adt/adt-bundle-mac-x86_64-20140702.zip" target="_blank">下载地址</a>
- 配置ANDROID_HOME
- 环境变量的配置代码见下方:
- 执行环境检测 bin/appium-doctor.js --android 出现如下结果证明android环境配置成功

```shell
# ~/.bash_profile的配置内容
# 修改完之后source ~/.bash_profile生效

export ANDROID_HOME=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk
export PATH=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk/platform-tools:$PATH
export PATH=/Users/zhangmeng/Documents/adt-bundle-mac-x86_64-20131030/sdk/tools:$PATH
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_79.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

![](http://gtms04.alicdn.com/tps/i4/TB1d.8kKXXXXXXFaXXXHH2ZNpXX-822-195.jpg)

#### 配置手机

- 开启开发者选项，设置-{}开发者选项，如果没有找到，<a href="http://android.d.cn/news/83907.html" target="_blank">参考</a>
- 打开USB调试（如下图）
- 部分手机需要在 连接USB的时候选用 MTP媒体模式才会生效
- 在命令行执行如下指令，能够列出后（如果不行, 重新插拔一下usb，还可以尝试<a href="https://nishantverma.gitbooks.io/appium-for-android/content/executing_test_on_real_devices/index.html">方法</a>）

<img src="http://gtms02.alicdn.com/tps/i2/TB1Fb0vKXXXXXXeXVXXeOeo8FXX-750-1000.jpg" width="300px" height="500px">

```shell
adb kill-server
adb devices
```

其中list出来的就是手机的udid，用于后面的测试使用，如下图
![](http://gtms03.alicdn.com/tps/i3/TB1diXtKXXXXXXMXVXXct.03pXX-675-79.jpg)

#### 执行初始化脚本

按照上面的步骤执行完成之后，运行命令<strong>./reset.sh --andorid --verbose</strong>即可。
在没有读这个reset.sh脚本的时候真的是被各种的环境搞的头晕脑胀，各种报错，包括：
基本都是有命令运行不通造成的，所以在这里大概介绍一下在appium reset android中的到底做了些什么，帮助大家理解这个启动脚本，以便配合自己的应用解决编译的问题，这个也是源码编译的好处之一，可以及时的解决更新服务。

- android API 不匹配
- Device chrome not configured yet
- uninstall io.appium.android.ime卡住不再运行

<img src="http://gtms03.alicdn.com/tps/i3/TB1WaXHKXXXXXb6XpXXeOeo8FXX-750-1000.jpg" width="300px" height="500px">

#### reset.sh分析

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


#### 运行测试用例

- <strong>node . -U  4df752b06833bfd3</strong>（显示下面的提示证明Appium Server能够正常启动）
- 详细的运行参数<a href="https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/server-args.md" target="_blank">参考</a>
- 运行测试用例 : mocha wd-android-helloworld.js （<a href="https://github.com/admc/wd" target="_blank">wd.js</a>）
- 其中支持原生的browser、chrome、还有apk的测试

![](http://gtms04.alicdn.com/tps/i4/TB11TKIKXXXXXbaXXXX_k.yPXXX-795-103.jpg)


### ios虚拟器

 配置IOS环境:xcode安装好,执行如下命令:
```shell
$ git clone https://github.com/appium/appium.git
$ cd appium
$ ./reset.sh --ios --verbose
$ sudo ./bin/authorize-ios.js # for ios only 修改权限
$ node .
```

### 启动参数
有时需要配置一些特殊的启动参数,例如想启动safari进行H5页面的测试,那样就可以使用 node . --safari 启动参数实现,
如果需要详细的server启动配置，请参考<a href="https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/server-args.md" target="_blank">Appium server arguments</a>，例如 只想实现针对safari进行h5页面的自动化测试，配置参数为：


## 测试脚本

node . 启动完appium后, 可以通过支持jsonWireProtocal的客户端连接服务器进行测试,具体的测试程序 <a href="https://github.com/zhangmeng712/f2e-testing/tree/master/ui-wd-tests/mobile">参考</a>

```javascript
require('../helpers/setup');
var wd = require("wd");
var serverConfig = require('../helpers/server').appium;
var desired = require('../helpers/caps').ios90s;
var begin_page_url = 'http://s.m.taobao.com/h5?search-btn=&event_submit_do_new_search_auction=1&_input_charset=utf-8&topSearch=1&atype=b&searchfrom=1&action=home%3Aredirect_app_action&from=1';

describe('test page of taobao search', function () {
    this.timeout(300000);
    var driver;
    before(function () {
    //配置appium需要的配置
        driver = wd.promiseChainRemote({
            host: 'localhost',
            port: 4723
        });
        require("../helpers/logger").configure(driver);//显示日志
        return driver.init({
            'appiumVersion': '1.4.11',
            'deviceName': 'iPhone 6',
            'device-orientation': 'portrait',
            'platformVersion': '9.1',
            'platformName': 'iOS',
            'app': 'safari'
        });
    });

    after(function () {
        return driver.quit();
    });

    //1打开淘宝搜索页面
    //2点击搜索框
    //3进入到搜索结果页面
    it("should open iphone+6s search page", function () {
        var inputValue = 'iphone 6s';
        return driver
              .get(begin_page_url)
              .sleep(1000)
              .waitForElementByName('q', 2000)
              .sendKeys(inputValue)
              .waitForElementByName('search')
              .tap()
              .sleep(5000)
              .eval('window.location.href')
              .should.eventually.include('q=iphone+6s')
    });

});

```

结果如下图

![](http://gtms01.alicdn.com/tps/i1/TB16UnuJFXXXXXbXFXXMWa1RFXX-376-688.jpg)

![](http://gtms02.alicdn.com/tps/i2/TB1lbDlJFXXXXXBXVXXXiF3VFXX-1379-584.jpg)