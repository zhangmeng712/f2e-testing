/**
 * @fileOverView init.js初始化
 * @author zhangmeng on 15/10/27
 */

var devices = {
    desktop: {
        browser: 'firefox',
        tags: 'desktop',
        deviceName: 'desktop firefox',
        getDriver: function () {
            //使用chromedriver的时候在take screenshot的时候会出现https://bugs.chromium.org/p/chromedriver/issues/detail?id=1083
            return createGridDriver('http://0.0.0.0:4444/wd/hub',{
                desiredCapabilities: {
                    browserName: 'firefox',
                    size: '1100x800'
                }
            })
        }
    }
    , mobile: {
        tags: 'mobile',
        deviceName: 'Android chrome',
        getDriver: function () {
            return createGridDriver('http://127.0.0.1:8002/wd/hub',{
                desiredCapabilities: {
                    platformName: 'Android',
                    platformVersion: '4.4.4', //sumsung SIII 360*640
                    deviceName: 'Sumsung'
                }
            })
        }
    }
    //有时appium在ios下会出现无法打开url的情况(考虑有可能跟异步有关系，无法次次复现)，safari的app id 无法正常初始化造成 暂无办法解决，wd.js不会出现这个问题
    //New page listing did not match the app id we are currently using, ignoring
    //https://github.com/appium/appium/issues/4865
    //等读完appium源码的时候解决
    ,tablet: {
        tags: 'tablet',
        deviceName: 'ipad Air safari',
        getDriver: function () {
            return createGridDriver('http://127.0.0.1:8001/wd/hub',{
                desiredCapabilities: {
                    browserName: 'Safari',
                    'platformVersion': '9.1',
                    'platformName': 'iOS',
                    'app': 'safari',
                     deviceName:"iPad Air",
                     size: '768x1024',
                     safariInitialUrl: 'about:blank'
                }
            })
        }
    }

};

var domain = "192.168.1.129";
//var domain = 'testapp.galenframework.com';
var openDriver = function (device, url) {
    var driver = device.getDriver();
    session.put("driver", driver);
    if (url != null) {
        if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
            url = "http://" + domain + url;
        }
        driver.get(url);
    }
    else {
        driver.get("http://" + domain);
    }
    return driver;
};


afterTest(function (test) {
    var driver = session.get("driver");
    if (driver != null) {
        //if (test.isFailed()) {
            session.report().info("Screenshot").withAttachment("Screenshot", takeScreenshot(driver));
        //}
        driver.quit();
    }
});

/**
 * 调用多种设备进行测试
 */
var testOnAllDevices = function(testNamePrefix, url, callback) {
    forAll(devices, function (device) {
       test(testNamePrefix + " on ${deviceName} device", function (device) {
           var driver = openDriver(device, url);
           callback.call(this,driver, device);
       });
    });
};

/**
 * 只调用单一设备
 */
var testOnDevice = function(device, testNamePrefix, url, callback) {
    forOnly(device, function(device) {
        test(testNamePrefix + " on ${deviceName} device", function (device) {
            var driver = openDriver(device, url);
            callback.call(this, driver, device);
        });
    });
};

(function (export) {
    export.devices = devices;
    export.openDriver = openDriver;
    export.testOnDevice = testOnDevice;
    export.testOnAllDevices = testOnAllDevices;
})(this);

