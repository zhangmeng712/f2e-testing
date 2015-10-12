/**
 *
 */
var Setup = require('../helper/setup');
var Logger = require('../helper/logger');
var wd = require("wd");

var desired = Setup.desired;
var serverConfig = Setup.serverConfig || {};
var should = Setup.should;
var driver;

describe('An order-view updates the DOM', function () {
    before(function () {
        driver = wd.promiseChainRemote(serverConfig);
      //  Logger.configure(driver);//显示wd日志
        return driver.init(desired)
    });

    beforeEach(function() {
        return driver.get("http://localhost:3000/test/order.html");
    });

    after(function() {
        return driver.quit();
    });



})