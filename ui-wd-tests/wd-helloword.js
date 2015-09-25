/**
 * @fileOverView wd-helloword wd入门程序
 * 运行时请保证selenium-standalone服务器启动(safari服务器配置好)
 * @author zhangmeng on 15/9/24
 */
var wd = require("wd");

var driver = wd.promiseChainRemote({
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
});

driver
    .init({browserName: 'safari'})
    .get('http://www.baidu.com')
    .sleep(5000)
    .title().then(function (title){
        console.log('this is the website title', title)
    })
    .quit();




