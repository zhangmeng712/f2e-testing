# F2e-Testing

F2e Testing Technology Collection

## BDD & TDD

- <a href="https://en.wikipedia.org/wiki/Behavior-driven_development" target="_blank">BDD(Behavior-driven development)</a>
- <a href="https://en.wikipedia.org/wiki/Test-driven_development" target="_blank">TDD(Test-driven development)</a>
- <a href="http://gaboesquivel.com/blog/2014/differences-between-tdd-atdd-and-bdd/" target="_blank">Difference</a>: 一言蔽之 BDD比TDD更加的语义化人性化(difference is language and word)，例如
```javascript

//BDD style
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

//TDD style
 assert.areEqual([1, 2, 3], [1, 2, 3])

```

## Basic Testing Framework Demo

### <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/mocha-demo.md">mocha用法分析</a>
### sinon
### <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/chai-demo.md">chai & chai plugins</a>


## Testing Tools
### Karma
### Protractor(for Angular Testing)
### Jest (for React Testing)
### Web-component-tester (for Polymer testing)

## UI Testing Strategy

### strategy

UI测试目前主要有方式：

- record-and-replay: 主要是指利用录制工具去记录用户的行为，并且把这种“行为“存储到脚本中，以便将来用于检测程序或应用是否能够产出预期的效果。常用的record-and-replay工具有：微软的RPF以及google早期出品的<a href="http://googletesting.blogspot.jp/2011/10/take-bite-out-of-bugs-and-redundant.html" target="_blank">abite</a>。
- e2e测试(end-to-end testing)：这种测试方式不光可以测试UI层，还可以将整个系统的功能进行测试。通常这种测试会使用第三方的测试工具作为测试doubles层以提升测试效率。

### structures

没人可以否认<strong>UI测试是耗时且昂贵的</strong>，所以在写测试的时候一定要慎重的选择使用UI测试的case，下图就是一种比较“聪明”的UI测试架构。我们可以将UI层进行拆分：<strong>视图层</strong>还有<strong>UI逻辑层</strong>。如果大家知道  MVX 这种架构，就会知道，UI逻辑层更像是 MVX 中的Controller层和Model层，视图层是比较难以测试和描述的，因此不建议将对视图层的内容作为UI测试的重点，当然我们也可以使用简单的spec来描述视图层的内容，或是对于视图的样式等使用 <strong><a href="http://galenframework.com/" target="_blank">galenframework</a></strong>类似的框架进行测试 (后面的blog会专门介绍这个框架，它脱离了<a href="https://github.com/Huddle/PhantomCSS" target="_blank">phantomCss</a>的检测方式，使用特殊的spec方式来描述case，对于前端来说，非常值得学习)。因此我们更多的测试会围绕UI逻辑层进行。UI逻辑层主要的用途如下，因此我们的case就围绕着对这两部分功能的测试进行编写。

- 用户和浏览器的交互(操作和更新html)
- 监听html的事件并且将信息通过request传递给后台

<img src="http://gtms01.alicdn.com/tps/i1/TB1EoZ_JpXXXXaSXVXXfGCCQVXX-512-362.jpg" width="500px" height="340px">

UI测试框架主要由两部分构成：客户端的Test环境和测试服务，测试框架的基本原理很简单，本着经济有效的原则，设计了这款使用开源技术的UI测试框架，跨平台、支持多语言、且支持PC端和mobile端的测试方案，本人是前端，所以下例都是基于Nodejs/javascript书写。
![](http://gtms01.alicdn.com/tps/i1/TB14RaGJFXXXXcVXpXXYZLw5FXX-556-445.jpeg)

## UI Testing Server

 对于UI测试的服务端平台来说，非常欣赏<a href="https://www.browserstack.com/" target="_blank">BrowserStack</a>这个测试平台。实时的、Web-based、多语言，多浏览器、多机型支持，API和接口全面丰富的基于云端的测试平台，除了价格比较贵（$39/month），绝对是最完的测试利器。
   对于UI测试来说，浏览器宿主环境是非常重要的，而服务端的Hub架构就是通过代理服务器的方式帮你操纵各种类型的浏览器进行自动化测试。在此我们选择了selenium-standalone来实现pc端的server(内置Jetty服务器)；appium这个node服务器作为mobile端的server hub。


### appium

####简介	
mobile端的开发越来越火热，为了保证开发质量，也有很多针对移动端的测试工具应运而生。<a href="http://appium.io" target="_blank">Appium</a>就是其中很活跃的开源框架。本质上它包括两部分内容：

- 基于express的server用于发送/接收client端的协议命令
- 作为bootstrap客户端用于将命令传递给对应的UIAutomator/UIAutomation/Google’s Instrumentation

Appium最大的特色就是<strong>支持ios/android/firefoxos多种平台的测试，native、h5、hybrid都支持，以及所有支持jsonWireProtocal协议的脚本语言：python，java，nodejs ruby都可以用来书写用例</strong>。

####安装

因为Appium的社区发展的很快，建议使用源码编译使用，而不是使用AppiumGUI(它本身是由第三方社区维护，并不属于appium的核心产品 所以很多bug更新的并不及时，例如测试h5页面的时候页面会出现)，此外还可以根据自己的要求修改源码和调试，下面就简要介绍一下源码安装的方法, 安装详细方法 请见 <a href="https://github.com/appium/appium/blob/master/docs/en/contributing-to-appium/appium-from-source.md" target="_blank">Running Appium from Source</a>：

- 配置IOS环境
	- xcode安装好
- 配置Andorid环境
	- java jdk 配置好并设置好JAVA_HOME
	- android sdk安装并配置好ANDROID_HOME
	- 建议在真机下进行测试（模拟器启动速度慢），参见<a href="https://nishantverma.gitbooks.io/appium-for-android/content/executing_test_on_real_devices/index.html" target="_blank">executing_test_on_real_devices</a>
- 运行下方代码
- 以IOS为例：编译安装并启动的结果如下：

```shell
	 git clone https://github.com/appium/appium.git
     cd appium
     ./reset.sh --verbose #感谢g*f*w 安装过程痛苦而漫长，使用--verbose显示日志吧，至少知道在哪里卡住
     sudo ./bin/authorize-ios.js # for ios only modify /etc/authorization
     node .
```

![](http://gtms04.alicdn.com/tps/i4/TB1KqblJFXXXXcwXXXX2UFe5FXX-648-102.jpg)

如果需要详细的server启动配置，请参考<a href="https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/server-args.md" target="_blank">Appium server arguments</a>，例如 只想实现针对safari进行h5页面的自动化测试，配置参数为：

```shell
	node . --safari
```

详细的Appium的配置和源码分析见 <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/mobile/appium.md" target="_blank">appium.md</a>

### selenium-standalone


   [selenium-standalone](https://www.npmjs.com/package/selenium-standalone)支持node安装方式,通过下列脚本可以安装执行，同时可以配置对应的hub信息。
   
```shell
	npm install selenium-standalone@latest -g
	selenium-standalone start -- -role node -hub http://localhost:4444/grid/register -port 5556
``` 
   
  - selenium默认支持的浏览器为Firefox和phantom，如果要使用它操纵其他的浏览器参考如下方式安装对应驱动：
  - chrome:selenium-standalone install --drivers.chrome.version=2.15 --drivers.chrome.baseURL=http://chromedriver.storage.googleapis.com
  - safari：下载，并在safari中安装<a href="http://selenium-release.storage.googleapis.com/index.html" target="_blank">SafariDriver.safariextz</a>插件
  - ie：selenium-standalone install --drivers.chrome.version=2.15 --drivers.chrome.baseURL=http://chromedriver.storage.googleapis.com


## UI testing Client

###Wd.js

前面提到了<a href="https://code.google.com/p/selenium/wiki/JsonWireProtocol" target="_blank">jsonWireProtcal</a>协议，主要用于客户端的Testcase中定义对浏览器的操作，实现了这个协议的框架和语言有很多，这个大家自行选择。协议形如

GET /session/:sessionId/screenshot
Take a screenshot of the current page.

个人比较欣赏<a href="https://www.npmjs.com/package/wd" target="_blank">wd.js</a>这个框架，它是一个webdriver/selenium 2的node端实现，各种异步promise支持，自定义方法非常方便，同时支持mocha和chai的无缝嵌入。

#### 简单用法

- 安装依赖
- 配置desirecapabilities,<a href="https://code.google.com/p/selenium/wiki/DesiredCapabilities" target="_blank">详细参数</a>
- 操纵浏览器，API参加 <a href="https://github.com/admc/wd/blob/master/doc/api.md" >API列表</a>
- 详细代码参见<a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/wd-helloword.js" target="_blank">github</a>

```javascript
var wd = require("wd");
var driver = wd.promiseChainRemote({
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
});

driver
    .init({browserName: 'safari'})
    .get('http://www.baidu.com')
    .sleep(5000)
    .title().then(function (title){
        console.log('this is the website title', title)
    })
    .quit();
```

#### chain和promise的写法

将异步转化为Q chain的链式调用方式，内置<a href="http://documentup.com/kriskowal/q/" target="_blank">Q</a>
支持自定义的promise,代码如下所示，详细代码见<a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/wd-promise.js" target="_blank">github</a>

```javascript
/**
 * @fileOverView wd-promise wd 链式调用实例
 * @author zhangmeng on 15/10/4
 */

var wd = require("wd");
//内置Q chain
var Q = wd.Q;
var browser = wd.promiseChainRemote({
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
});

/**
 * 自定义链式调用用于实现drag 和 drop的操作
 * @param fromElm cssSelector
 * @param toElm cssSelector
 * @returns {Function} browser
 */
var dragNdrop = function (fromElm, toElm) {
    return function () {
        return Q.all([
            browser.elementByCssSelector(fromElm),
            browser.elementByCssSelector(toElm)
        ]).then(function (els) {
            console.log(els);
            return browser
                    .moveTo(els[0])
                    .buttonDown()
                    .moveTo(els[1])
                    .buttonUp();
        });
    }
};

browser
    .init({browserName:'chrome'})
    .get('http://localhost:63342/my-git/f2e-testing/ui-wd-tests/test-html/test-dragNdrop.html')
    //chain link
    .then(dragNdrop('.dragable','.dropable'))
    .sleep(1000)
    .fin(function() { return browser.quit(); })
    .done();

```


#### Asserter用法和自定义Asseter

wd.js内置了基本的Asserter，同时支持自定义的断言。多数结合waitfor“句式“使用。这个在实际中经常应用，例如当页面中某个元素出现特定状态的时候去做某事，或者是判断某异步的加载完成的时候执行某操作等。

内置的判断包括
- nonEmptyText
- isDisplayed
- isNotDisplayed
- textInclude
- jsCondition
- isVisible
- isHidden
- jsCondition(常用)

waitfor包括：

- waitFor
- waitForElementByCss(elem, asserter, timeout, pollFreq, callback)（常用,判定当某元素存在，且满足某asserter的时候调用回调）
- waitForConditionInBrowser(jsExpression) 需要设置异步超时时间，setAsyncScriptTimeout

如果上述都不满足还可以自定义Asserter，下面是对应的例子，使用多种方法判断ajax加载完成后进行测试内容，详情见<a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/wd-assert.js" target="_blank">wd-asserter.js</a>

```javascript
//自定义方法
var tableHasBeenLoaded = new Asserter(
    function(browser, cb) {
        var jsConditionExpr = '($("#tbody tr").length > 0) ? true: false';
        var _eval = browser.eval;
        _eval.apply( browser , [jsConditionExpr, function(err, res) {
            if(err) {return cb(err);}
            cb(null, res, res);
        }]);
    }
);
browser
    .init({browserName: 'chrome'})
    .setAsyncScriptTimeout(30000)
    .get('http://localhost:63342/my-git/f2e-testing/ui-wd-tests/test-html/test-assert.html')
    //------------- case2 jsCondition  waitForConditionInBrowser new Asserter waitForAjaxLoaded -----
    .elementByCss('#getBtn')
    .click() //click to trigger ajaxloading
    //.waitFor(tableHasBeenLoaded, 4000)
    .execute('alert("ajax finished")')
    .sleep(2000)
    .fin(function () {
        return browser.quit();
    })
    .done();

```



#### 自定义操作方法

使用wd.PromiseChainWebdriver.prototype可以将自定义的方法chain到链式调用中去，同时还可以使用promise来实现，例如上面dragNdrop的例子


```javascript
//method1 of self-defined method
wd.PromiseChainWebdriver.prototype.waitForAjaxLoaded = function (timeout) {
	//this为browser内容
    return this.waitFor(tableHasBeenLoaded, timeout)
}
//method2

function selfDefinedFunction() {
	return browser.xxxxx
}

browser.init().get().selfDefinedFunction().xx

```

#### 插入js代码

在测试的实际应用中，经常需要引入需要的类库或者辅助代码来实现测试的目的，那么应该怎么操作呢，wd.js按照jsonWireProtocal是支持执行js代码的，一般通过下面两个方法。最常见的是要测的代码中是没有对应的类库的 如果要使用，例如jquery kissy，那么需要预先inject对应的代码，类似js bookmark书签，或者chrome的插件中的content_script代码。具体代码参见<a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/wd-jsInject.js" target="_blank">wd-jsinject.js</a>
- execute()：执行同步代码
- executeAsync()：执行的内容中含有异步的内容

```javascript
//load.js 用于load javascript类库
var loadScript = function (scriptUrl, callback) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    var done = false;
    script.onload = script.onreadystatechange = (function() {
        if (!done && (!this.readyState || this.readyState == 'loaded'
            || this.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
            callback();
        }
    });
    script.src = scriptUrl;
    head.appendChild(script);
};
loadScript = loadScript(arguments[0], arguments[arguments.length - 1]);
//loadScript('//cdn.bootcss.com/jquery/2.1.4/jquery.js');

//dom.js 判断类库是否正确引入，设置
Fn = {};
var appendChild = setTimeout(function() {
    $("#i_am_an_id").append('<div class="child">I am the child</div>')
}, arguments[0]);

var removeChildren = function () {
    $("#i_am_an_id").empty();
};

Fn = {
    appendChild: appendChild,
    removeChildren: removeChildren
};

//定义object方便链式操作中调用
window.Fn = Fn;

//wd-jsInject.js

var jsFileToString = function (filePath) {
    var file = fs.readFileSync(filePath, "utf8");
    return file;
};
//读取本地的代码
var codeUrl = '/opt/local/share/nginx/html/my-git/f2e-testing/ui-wd-tests/scripts/dom.js';
//加载jquery等类库
var loadUrl = '/opt/local/share/nginx/html/my-git/f2e-testing/ui-wd-tests/scripts/load.js';

//读取js代码（自动转化为jsExpression）
var executeStr = jsFileToString(codeUrl);
var loadScriptStr = jsFileToString(loadUrl);

browser
      .init({browserName:'chrome'})
      .get('http://localhost:63342/my-git/f2e-testing/ui-wd-tests/test-html/test-injectjs.html')
      //inject jquery
      .setAsyncScriptTimeout(30000)
      .executeAsync(loadScriptStr, ["//cdn.bootcss.com/jquery/2.1.4/jquery.js"])
      .execute(executeStr)
      //测试jquery是否正常引入
      .execute('Fn.appendChild', [1000])
      .execute('Fn.removeChildren()')
      .sleep(2000)
      .fin(function() { return browser.quit(); })
      .done();

```

#### 结合mocha和chai

<a href="https://mochajs.org/" target="_blank">mocha</a>是用于测试的框架，chai用于辅助断言，wd.js支持两者的无缝接入，可以使ui测试变得像单元测试一样简单。参考下面的demo，就是把三者结合在一起，通过wd对appium访问ios虚拟机，对手机淘宝搜索结果页进行UI测试的例子，代码详见<a href="https://github.com/zhangmeng712/f2e-testing/blob/master/ui-wd-tests/mobile/safari-wd-search-test.js" target="_blank">Github F2E-testing UI test</a>

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
        driver = wd.promiseChainRemote(serverConfig);
        require("../helpers/logger").configure(driver);//显示日志
        return driver.init(desired);
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

![](http://gtms01.alicdn.com/tps/i1/TB16UnuJFXXXXXbXFXXMWa1RFXX-376-688.jpg)

![](http://gtms02.alicdn.com/tps/i2/TB1lbDlJFXXXXXBXVXXXiF3VFXX-1379-584.jpg)


## ReactTesting Demo
- <a href="react/test/" target="_blank">UI tesing by wd.js</a>
- Page Object Pattern
- react-test-tree


## Galen Framework Demo
- <a href="ui-galen-tests/responsive-automate.md">RWD Testing</a>
- ADs Style Testing


## Mobile UI Testing Demo
- <a href="ui-wd-tests/mobile/safari-wd-search-test.js">wd.js safari test demo</a>
- <a>wd.js webview test demo</a>
- <a>wd.js gestures support</a>
- IOS App login Page testing
- Mobile Ads testing











