/**
 * @fileOverView ios-safari-taobao-search测试用例
 * @author zhangmeng on 15/7/5
 */

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


