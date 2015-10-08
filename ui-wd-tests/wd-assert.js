var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var asserters = wd.asserters;
var Asserter = wd.Asserter; // asserter base class

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var browser = wd.promiseChainRemote({
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
});

// tagging chai assertion errors for retry
var tagChaiAssertionError = function(err) {
    // throw error and tag as retriable to poll again
    err.retriable = err instanceof chai.AssertionError;
    throw err;
};

/**
 * 自定义Asserter当某元素的text不为0的时候执行
 */
var customTextNonEmpty = new Asserter(
    function(target) { // browser or el
        return target
            .text().then(function(text) {
                // condition implemented with chai within a then
                text.should.have.length.above(0);
                return text; // this will be returned by waitFor
                             // and ignored by waitForElement.
            })
            .catch(tagChaiAssertionError); // tag errors for retry in catch.
    }
);

/**
 * 实用方法
 * 自定义Asserter当ajax回调完成渲染完了table
 */
var tableHasBeenLoaded = new Asserter(
    function(browser, cb) {
        var jsConditionExpr = '($("#tbody tr").length > 0) ? true: false';
        var _eval = browser.eval;//防止某些浏览器吞掉异常，使用browser.safeEval
        _eval.apply( browser , [jsConditionExpr, function(err, res) {
            if(err) {return cb(err);}
            cb(null, res, res);
        }]);
    }
);

/**
 * 自定义方法
 */
wd.PromiseChainWebdriver.prototype.waitForAjaxLoaded = function (timeout) {
    return this.waitFor(tableHasBeenLoaded, timeout)
}

browser
    .init({browserName: 'chrome'})
    .setAsyncScriptTimeout(30000)
    .get('http://localhost:63342/my-git/f2e-testing/ui-wd-tests/test-html/test-assert.html')

    //------------- case1:customTextNonEmpty --------------
    //.execute('setTimeout(function() {$("#i_am_an_id").html("hello")},500)')
    //.waitForElementByCss("#i_am_an_id") //will console空
    //.waitForElementByCss("#i_am_an_id", customTextNonEmpty)//will console hello
    //.text().then(function (text) {
    //    console.log(text)
    //})


    //------------- case2 jsCondition  waitForConditionInBrowser new Asserter waitForAjaxLoaded -----
    .elementByCss('#getBtn')
    .click() //click to trigger ajaxloading

    //method1：
    //.waitFor(asserters.jsCondition('($("#tbody tr").length > 0) ? true: false'),3000)
    //method2：
    //.waitFor(tableHasBeenLoaded, 4000)
    //method3：
    //.waitForConditionInBrowser('$("#tbody tr").length > 0', 3000)
    //method4：
    .waitForAjaxLoaded(4000)

    .execute('alert("ajax finished")')
    .sleep(2000)
    .fin(function () {
        return browser.quit();
    })
    .done();
