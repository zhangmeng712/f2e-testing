# e2e 自动化测试 - protractor

<a href="http://angular.github.io/protractor/#/" target="_blank">protractor</a>用于前端UI自动化测试,特别为angular程序定制

## 特点
- 端对端(e2e)测试
- 采用jasmine作为测试框架
- 基于WebDriverJS,(selenium-webdriver)
- 针对angular应用增加定位器,更加方便实用
- 实现自动等待,告别sleep wait,变异步为同步
- 支持测试代码的调试
- 支持多浏览器的并行UI测试

## 使用方法

### 准备工作

- 1 安装protractor: npm install -g protractor
- 2 安装selenium-standlone: webdriver-manager update
- 3 启动selenium服务器: webdriver-manager start


### spec书写

spec.js是用于书写测试用例的文件, protractor默认使用jasmine作为测试框架,举最简单的例子来说,一个spec文件可以这样写,使用describe作为
测试程序"块", it定义一个用例,expect作为断言,其中browser这个全局的变量,用于操作浏览器.
```javascript
describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://juliemr.github.io/protractor-demo/');
        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});
```

### 运行

- 配置conf.json
在测试之前,我们需要建立一个conf.json的文件,在这个文件中,可以配置测试的相关内容,例如:
    - multiCapabilities:使用哪些浏览器测试
    - chromeOptions:chrome浏览器的运行参数(使用哪些插件等)
    - framework:使用哪种测试框架: cucumber macha 还是jasmine
    - specs:测试哪些文件
详细的配置信息请<a href="https://github.com/angular/protractor/blob/master/docs/referenceConf.js" target="_blank">参考</a>

```javascript
exports.config = {
   // directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    //capabilities: {
    //    'browserName': 'chrome'
    //},
    multiCapabilities: [ {
        'browserName': 'chrome',
        //'chromeOptions': {
        //    'args': ['--load-extension=/opt/local/share/nginx/html/radar/tanxtag'],
        //}
    }],
    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['basic/demo_spec.js','basic/angular_spec.js'],

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
```

- 运行测试程序

```shell
protractor conf.json
```


### grunt运行测试

有时我们需要使用grunt来配置测试任务,下面就是使用<a href="https://www.npmjs.com/package/grunt-concurrent" target="_blank">grunt-concurrent</a> 模块实现并行运行多浏览器(也可通过conf.json中配置multiCapabilities解决)测试程序的代码:
```javascript
module.exports = grunt => {
    //This module will read the dependencies/devDependencies/peerDependencies/optionalDependencies in your package.json
    // and load grunt tasks that match the provided patterns.
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        concurrent: {
            protractor_test: ['protractor-chrome', 'protractor-firefox', 'protractor-safari']
        },
        protractor: {
            options: {
                keepAlive: true,
                singleRun: false,
                configFile: "conf.js"
            },
            run_chrome: {
                options: {
                    args: {
                        browser: "chrome"
                    }
                }
            },
            run_firefox: {
                options: {
                    args: {
                        browser: "firefox"
                    }
                }
            },
            run_safari: {
                options: {
                    args: {
                        browser: "safari"
                    }
                }
            }
        }
    });

    grunt.registerTask('protractor-chrome', ['protractor:run_chrome']);
    grunt.registerTask('protractor-firefox', ['protractor:run_firefox']);
    grunt.registerTask('protractor-safari', ['protractor:run_safari']);
    grunt.registerTask('protractor-e2e', ['concurrent:protractor_test']);
};
```

### 调试测试程序

除了非常方便的运行机制,protractor还提供便捷的调试方式, 使用selenium-webdriver操纵浏览器的时候,调试是非常困难的,在这里protractor就提供调试方式
在代码中加入 browser.pause(); 并且在终端输入 "repl" 就可以使用WebDriver commands来调试程序了:

```shell
wd-debug> repl
> element
function (locator) {
    return new ElementArrayFinder(ptor).all(locator).toElementFinder_();
  }
> 
```
### 测试非angular的应用

protractor内置方法测试angular的程序,例如它会自动检测angular页面加载完毕才会执行测试程序,当测试非angular程序的时候需要:
    - 1 使用 browser.driver 代替 driver
    - 2 添加 browser.driver.ignoreSynchronization = true 
<a href="https://github.com/sakshisingla/Protractor-Non-Angular-Tests/wiki/Creating-test-scripts-using-Protractor-for-non-angular-application" target="_blank">参考</a>



## protractor的详细使用

在protractor中,有几大类用于测试代码,详情请见<a href="https://angular.github.io/protractor/#/api" target="_blank">protractorAPI</a>
- browser: 浏览器的操作
- element & by: 定位获取页面元素
- ExpectedConditions:用于页面操作的逻辑函数,一般同wait连用
- webdriver: selenium 原生的语法函数
- promise:selenium内置的promise方法

### 浏览器的操作-browser

常用操作代码如下:

- browser.get:
- browser.findElement
- browser.switchTo().frame()
- browser.executeScript:
- browser.executeAsyncScript
- browser.wait:
- browser.sleep:

### 选择器- by & element

支持多源选择器
- by.css()
- by.id()
- by.xpath()
- by.name()
- by.tagName()
- by.model():angular专用
- by.binding():angular专用
- by.repeater():angular专用

通过element获取:element(by.id('frameId'))或者element.all(by.css('some-css'));
在非angular应用中使用browser.driver.findElement(by.id('frameId'))



### ExpectedConditions
预定义了wait的条件,常用的有
- elementToBeClickable: 按钮可以点击
- presenceOf: 元素出现在dom中
- titleContains: title含有某个字符串
- visibilityOf: 某个元素显示

```javascript
    var EC = protractor.ExpectedConditions;
    var button = $('#xyz');
    var isClickable = EC.elementToBeClickable(button);
    
    browser.get(URL);
    browser.wait(isClickable, 5000); //wait for an element to become clickable
    button.click();
```

### 综合实例

```javascript

 it ('test login error', function () {
        _driver.get('http://subway.simba.taobao.com/#!/login');
        _driver.wait(protractor.until.elementLocated(by.css('.login-ifr')),1000).then(function (elem) {
            _driver.switchTo().frame(elem);
            _driver.findElement(by.name('TPL_username')).sendKeys('zhangmeng1986712');
            _driver.findElement(by.name('TPL_password')).sendKeys('xxxxx');
            _driver.findElement(by.id('J_SubmitStatic')).click();
            _driver.sleep(1000);
            browser.driver.findElement(by.css('.error')).then(function (elem) {
                return elem.getInnerHtml().then(function(text) {
                    expect(text).toMatch('密码和账户名不匹配');
                });
            });
        });
    });
    
```


## page object pattern

page object的模式大家一定不陌生,通过合理的配置可以使测试代码更容易维护,举例来说可以这样:

```javasript
//书写一个input操作类
var AngularHomepage = function() {
  var nameInput = element(by.model('yourName'));
  var greeting = element(by.binding('yourName'));

  this.get = function() {
    browser.get('http://www.angularjs.org');
  };

  this.setName = function(name) {
    nameInput.sendKeys(name);
  };

  this.getGreeting = function() {
    return greeting.getText();
  };
};
//测试代码
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    var angularHomepage = new AngularHomepage();
    angularHomepage.get();
    angularHomepage.setName('Julie');
    expect(angularHomepage.getGreeting()).toEqual('Hello Julie!');
  });
});

```


## mobile端的测试
详情<a href="https://angular.github.io/protractor/#/mobile-setup" target="_blank">参考</a>
这个例子是使用Appium作为server端进行测试的,由于selenium-webdriver不能直接联Appium, 所以需要使用wd-bridge进行折衷.

## e2e测试程序设计准则
<a href="https://angular.github.io/protractor/#/style-guide" target="_blank">参考</a>

## 参考代码

本文的参考代码见 <a href="https://github.com/zhangmeng712/f2e-testing/tree/master/protractor" target="_blank">Github</a>


 

