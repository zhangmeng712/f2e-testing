/**
 * @fileOverView myNotes.test.js 测试登陆完成后的notes列表页
 * 1 访问welcome页面
 * 2 登陆
 * 3 登陆成功的myNote页面checkLayout
 * @author zhangmeng on 15/11/21
 */

load('init.js');
load('pages/MyNotesPage.js');
load('pages/WelcomePage.js');
load('pages/LoginPage.js');

var TEST_USER = {
    username: 'testuser@example.com',
    password: 'test123'
};
function loginToMyNotePage (driver) {
    var welcomePage = new WelcomePage(driver).waitForIt();
    welcomePage.loginButton.click();
    var loginPage = new LoginPage(driver).waitForIt();
    loginPage.loginAs(TEST_USER);
    return new MyNotesPage(driver).waitForIt();

}
var welcomePageUrl= '/my-git/f2e-testing/ui-galen-tests/src/index.html';
testOnAllDevices("MyNotes page", welcomePageUrl, function (driver, device) {
    //登陆
    loginToMyNotePage(driver);
    checkLayout(driver, "specs/myNotesPage.spec", device.tags);
});
