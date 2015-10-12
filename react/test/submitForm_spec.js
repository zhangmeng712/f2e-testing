/**
 * 测试order-view能够正确的提交填写的参数
 */
var Setup = require('../helper/setup');
var Logger = require('../helper/logger');
var wd = require("wd");

var desired = Setup.desired;
var serverConfig = Setup.serverConfig || {};
var should = Setup.should;
var driver;

describe('order-view can ends ans "add beverage" request to the controller', function () {
    before(function () {
        driver = wd.promiseChainRemote(serverConfig);
       // Logger.configure(driver);//显示wd日志
        return driver.init(desired)
    });

    beforeEach(function() {
        return driver.get("http://localhost:3000/test/order.html");
    });

    after(function() {
        return driver.quit();
    });

    it('the server is correctly set up', function () {
        return driver.title().should.become("A test bed page for our Order Passive view");
    });



})