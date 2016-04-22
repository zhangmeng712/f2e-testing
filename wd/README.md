# wd.js

## 简介
前面提到了<a href="https://code.google.com/p/selenium/wiki/JsonWireProtocol" target="_blank">jsonWireProtcal</a>协议，主要用于客户端的Testcase中定义对浏览器的操作，实现了这个协议的框架和语言有很多，这个大家自行选择。协议形如

GET /session/:sessionId/screenshot
Take a screenshot of the current page.

个人比较欣赏<a href="https://www.npmjs.com/package/wd" target="_blank">wd.js</a>这个框架，它是一个webdriver/selenium 2的node端实现，各种异步promise支持，自定义方法非常方便，同时支持mocha和chai的无缝嵌入。

## 简单用法

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

## chain和promise的写法

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


## Asserter用法和自定义Asseter

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



## 自定义操作方法

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

## 插入js代码

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

## 结合mocha和chai

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