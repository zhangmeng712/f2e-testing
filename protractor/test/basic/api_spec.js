/**
 * @fileOverView api_spec.js
 * test api
 * @author zhangmeng on 16/3/7
 */

var chai = require('chai');
var expect = chai.expect;
describe('API test', function() {
    var _driver = browser.driver;
    _driver.ignoreSynchronization = true;
    it ('test login error', function () {
        this.timeout(500000);
        _driver.get('http://subway.simba.taobao.com/#!/login');
        _driver.wait(protractor.until.elementLocated(by.css('.login-ifr')),1000).then(function (elem) {
            _driver.switchTo().frame(elem);
            _driver.findElement(by.name('TPL_username')).sendKeys('zhangmeng1986712');
            _driver.findElement(by.name('TPL_password')).sendKeys('xxxxx');
            _driver.findElement(by.id('J_SubmitStatic')).click();
            _driver.sleep(1000);
            browser.driver.findElement(by.css('.error')).then(function (elem) {
                return elem.getInnerHtml().then(function(text) {
                    expect(text).to.have.string('密码和账户名不匹配');
                });
            });
        });
    });


    it("Should open do my asynchronous bidding", function (done) {
        this.timeout(500000);
        _driver.get('http://subway.simba.taobao.com/#!/login');
        _driver.executeAsyncScript(
            function (secondValue) {
                var cb = arguments[ arguments.length - 1 ];
                setTimeout(function () {
                    cb({
                        firstValue: 1,
                        secondValue: secondValue
                    });
                }, 3000);

            }, 'My Second Value').then(function (obj) {
            expect(obj.firstValue).to.equal(1);
            expect(obj.secondValue).to.equal('My Second Value');
            done();
        });

    });
});
