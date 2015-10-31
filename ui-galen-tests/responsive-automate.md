# 响应式设计的自动化测试

## 响应式设计介绍
## galenframework

### 安装

- 下载<a href="" target="_blank">二进制代码</a>
- 执行 ./install.sh
- galen -v 显示如下标明安装成功

```shell
Galen Framework
Version: 2.1.2
JavaScript executor: Rhino 1.7 release 5 2015 01 29
```

### 测试环境建立

- 执行 galen config：生成config文件用于配置初始化文件，具体参数配置 详情<a href="" target="_blank">参见</a>
- 文件结构
    - tests文件夹：用于装载测试脚本
        - login.page.test.js（默认是以.test.js后缀作为测试文件，如果有特殊要求可以在config文件中配置）
        - init.js: 用于
    - specs文件夹: 用于装载响应式设计的规则
        - loginPge.spec
    - config文件：配置文件
    - reports目录



### 构建测试服务

```shell
# server端
node . -a 127.0.0.1 -p 8002 -U 4df752b06833bfd3 --browser-name Chrome --no-reset
node . -a 127.0.0.1 -p 8001 --command-timeout 50000  --no-reset
selenium-standalone start
# 客户端
galen test tests/ --htmlreport reports

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













