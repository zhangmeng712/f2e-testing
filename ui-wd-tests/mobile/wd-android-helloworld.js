/**
 * @fileOverView wd
 * @author zhangmeng on 15/10/17
 */
/**
 * @fileOverView wd-helloword wd入门程序
 * 运行时请保证selenium-standalone服务器启动(safari服务器配置好)
 * @author zhangmeng on 15/9/24
 */
var wd = require("wd");

var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 4723
});

driver
    .init({
        browserName: 'Chrome',//Chrome or Browser
        platformName: 'Android',
        platformVersion: '4.4.4',
        deviceName: 'Android Emulator'
        //,
       // app: '/opt/local/share/nginx/html/my-git/appium/sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk'
      //  app: '/Users/zhangmeng/Downloads/com.taobao.taobao-5.3.1-121.apk'
    })
    .get('http://www.baidu.com')
    .sleep(5000)
    .title().then(function (title){
        console.log('this is the website title', title)
    })
    .quit()
    .done();




