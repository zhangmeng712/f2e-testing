/**
 * @fileOverView install selenium programmaticly
 * @author zhangmeng on 15/10/31
 */
var selenium = require('selenium-standalone');
var cb = function () {
    console.log('install success')
}
selenium.install({
    // check for more recent versions of selenium here:
    // http://selenium-release.storage.googleapis.com/index.html
    version: '2.47.1',
    baseURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
        chrome: {
            // check for more recent versions of chrome driver here:
            // http://chromedriver.storage.googleapis.com/index.html
            version: '2.18',
            arch: process.arch,
            baseURL: 'http://chromedriver.storage.googleapis.com'
        }
    },
    logger: function(message) {
            console.log('logger:', message)
    },
    progressCb: function(totalLength, progressLength, chunkLength) {

    }
}, cb);
