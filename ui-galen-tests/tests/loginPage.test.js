/**
 * @fileOverView loginPage.test.js测试登陆页面
 * @author zhangmeng on 15/11/19
 */

load("init.js");
load("pages/WelcomePage.js");
load('pages/LoginPage.js');
var welcomePageUrl= '/my-git/f2e-testing/ui-galen-tests/src/index.html';
testOnAllDevices("Login page", welcomePageUrl, function (driver, device) {

    var loginPage = null;

    logged("Basic layout check", function () {
        var welcomePage = new WelcomePage(driver).waitForIt();
        welcomePage.loginButton.click();
        loginPage = new LoginPage(driver).waitForIt();

        checkLayout(driver, "specs/loginPage.spec", device.tags);
    });

    logged("Checking error box", function () {
        loginPage.username.typeText("qweqwe");
        loginPage.loginButton.click();
        //Takes one string argument representing a timeout (default is “10s”). Waits with specified timeout until element appears on page and becomes visible.
        loginPage.errorMessage.waitToBeShown();
        checkLayout(driver, "specs/loginPage-withErrorMessage.spec", device.tags);
    });

});