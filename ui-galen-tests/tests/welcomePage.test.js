load("init.js");
load("pages/WelcomePage.js");
var welcomePageUrl= '/my-git/f2e-testing/ui-galen-tests/src/index.html';

testOnAllDevices("Welcome page", welcomePageUrl, function (driver, device) {
    new WelcomePage(driver).waitForIt();
    checkLayout(driver, "specs/welcomePage.spec", device.tags);
    //生成spec文件描述图
    //dumpPage({
    //    driver: driver,
    //    name: "Home page",
    //    spec: "specs/welcomePage.spec",
    //    exportPath: "dumps/homepage",
    //    maxWidth: 200,
    //    maxHeight: 200,
    //    onlyImages: false,
    //    excludedObjects: ["header", "footer"]
    //});
});



testOnDevice(devices.desktop, "Menu Highlight", welcomePageUrl, function (driver, device) {
    var welcomePage = new WelcomePage(driver).waitForIt();
        logged("Checking color for menu item", function () {
            checkLayout(driver, "specs/menuHighlight.spec", ["usual"]);
        })
        logged("Checking color for highlighted menu item", function () {
            welcomePage.hoverFirstMenuItem();
            checkLayout(driver, "specs/menuHighlight.spec", ["hovered"]);
        });

});
