/**
 * @fileOverView caps appium-support-desire-capabilities
 * @author zhangmeng on 15/6/26
 */

exports.chrome = {
    browserName:'chrome'
};
exports.safari = {
    browserName: 'safari'
};
exports.firefox = {
    browserName: 'firefox'
};
//ios9safari
exports.ios90s = {
    'browserName': 'Safari',
    'appiumVersion': '1.4.11',
    'deviceName': 'iPhone 6',
    'device-orientation': 'portrait',
    'platformVersion': '9.0',
    'platformName': 'iOS',
    'app': 'safari',
     noReset: true//不重建session提升速度
};
//TO SETUP other platformVersion in new place
