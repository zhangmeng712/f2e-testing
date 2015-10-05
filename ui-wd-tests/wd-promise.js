/**
 * @fileOverView wd-promise wd 链式调用实例
 * @author zhangmeng on 15/10/4
 */

var wd = require("wd");
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




