# 响应式设计的自动化测试

## 响应式设计介绍

响应式设计（RWD）从2010年开始就逐渐进入人们的视线，虽然由于网速和网络的制约，目前国内都是采用针对pc和移动分别开发站点的策略，例如淘宝网的首页在pc端<a href="https://www.taobao.com/" target="_blank">网页</a> ，在移动端的网页为<a href="https://m.taobao.com/" target="_blank">网页</a>，使用的是基于REM的布局设计。但是没人能否认响应式设计的重要性和简便性。响应式设计其实简单来说就是利用media query针对不同的设备和分辨率采用不同的css样式，用以达到网站在各个设备上的兼容性，再结合“移动优先”的策略，使得响应式设计更加的具有优势。如下图所示，就是一个简单的购物网站在不同设备上的响应式设计。

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2015/03/04-initial-sketch-opt-small.jpg)

## 响应式设计的实现
下面就举一个简单的响应式网站的<a href="http://testapp.galenframework.com/" target="_blank">例子</a>。
代码见<a href="https://github.com/zhangmeng712/f2e-testing/tree/master/ui-galen-tests/src" target="_blank">f2e-testing</a>

- 首页welcome页面
- 登陆页面
- notes列表页面
- 新建note页面


### 公共头尾和菜单的响应式


### welcome页面


### 





	
## galenframework
### 介绍


### 安装

- 下载<a href="https://github.com/galenframework/galen/releases/download/galen-2.1.2/galen-bin-2.1.2.zip" target="_blank">二进制代码</a>
- 执行 ./install.sh
- galen -v 显示如下标明安装成功

```shell
Galen Framework
Version: 2.1.2
JavaScript executor: Rhino 1.7 release 5 2015 01 29
```

### 测试环境建立

- 执行 galen config：生成config文件用于配置初始化文件，具体参数配置 详情<a href="http://galenframework.com/docs/getting-started-configuration/" target="_blank">参见</a>
- 文件结构
    - tests文件夹：用于装载测试脚本
        - login.page.test.js（默认是以.test.js后缀作为测试文件，如果有特殊要求可以在config文件中配置）
        - init.js: 用于配置测试的设备和尺寸
        - pages文件夹： ui自动化测试的Page Object页面
    - specs文件夹: 用于装载响应式设计的规则
        - loginPge.spec
    - config文件：配置文件
    - reports目录：用于生成自动化测试的html结果



### 构建测试服务

```shell
# server端

node . -a 127.0.0.1 -p 8002 -U 4df752b06833bfd3 --browser-name Chrome --no-reset
node . -a 127.0.0.1 -p 8001 --command-timeout 50000  --no-reset
selenium-standalone start
# 客户端
galen test tests/ --htmlreport reports
/usr/bin/open -a "/Applications/Google Chrome.app" 'http://localhost:63342/my-git/f2e-testing/ui-galen-tests/reports/report.html'
```

### GalenFramework javascript API

#### createGridDriver建立对服务器的链接

```javascript
var driver = createGridDriver('http://127.0.0.1:8001/wd/hub',{
                             desiredCapabilities: {
                                 browserName: 'Safari',
                                 'platformVersion': '9.1',
                                 'platformName': 'iOS',
                                 'app': 'safari',
                                  deviceName:"iPad Air",
                                  size: '600x800',
                                  safariInitialUrl: 'about:blank'
                             }
                         })；
```

#### checkLayout连接spec文件和test.js测试文件
检查spec文件是否符合预期

```javascript
checkLayout(driver, "specs/welcomePage.spec", 'desktop');
```


## 总结和构想















