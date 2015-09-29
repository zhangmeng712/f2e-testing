/**
 * @fileOverView wd-asserter.js
 * @author zhangmeng on 15/9/25
 */


var wd = require("wd");
var fs = require('fs');

var browser = wd.promiseChainRemote({
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
});

var jsFileToString = function (filePath) {
    var file = fs.readFileSync(filePath, "utf8");
    return file;
};

//读取本地的代码
var codeUrl = '/opt/local/share/nginx/html/my-git/f2e-testing/ui-wd-tests/scripts/dom.js';
//加载jquery等类库
var loadUrl = '/opt/local/share/nginx/html/my-git/f2e-testing/ui-wd-tests/scripts/load.js';

var executeStr = jsFileToString(codeUrl);
var loadScriptStr = jsFileToString(loadUrl);

browser
      .init({browserName:'safari'})
      .get('http://localhost:63342/my-git/f2e-testing/ui-wd-tests/test.html')
      .sleep(1000)
      .execute(loadScriptStr)
      .sleep(2000)
      .execute(executeStr)
      .execute('Fn.appendChild', [1000])
      .sleep(2000)
      .execute('Fn.removeChildren()')
      .sleep(2000)
      .fin(function() { return browser.quit(); })
      .done();

