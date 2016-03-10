/**
 * @fileOverView conf.js of protractor
 * @author zhangmeng on 16/2/12
 */

//framework
//seleniumAddress
//specs
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
exports.config = {
   // directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    //capabilities: {
    //    'browserName': 'chrome'
    //},
    multiCapabilities: [ {
        'browserName': 'chrome',
        //'chromeOptions': {
        //    'args': ['--load-extension=/opt/local/share/nginx/html/radar/tanxtag'],
        //}
    }],
    // Framework to use. Jasmine is recommended.
    framework: 'mocha',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['basic/api_spec.js'],

    troubleshoot: true,
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 100000,
        showColors: true
    },
    onPrepare: function() {
        // Override the timeout for webdriver.
        // browser.manage().timeouts().setScriptTimeout(60000);
    }
};