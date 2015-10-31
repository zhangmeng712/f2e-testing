/**
 * @fileOverView server.js
 * @author zhangmeng on 15/6/26
 */

//默认app-chrome&firefox
//also as the default config for wd.js
module.exports.default = {
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
};

//Appium server
//module.exports.appium = {
//    host: 'localhost',
//    port: 4723
//};

module.exports.appium = {
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 8001,
    path: '/wd/hub'
}

//need other windows platform to install ie driver
module.exports.ie = {

};