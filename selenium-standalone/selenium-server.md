# selenium-standalone

## 介绍
<img src="http://inetfuture.com/2015/03/18/selenium-terms-explained/grid-architecture.png">
## 安装
[selenium-standalone](https://www.npmjs.com/package/selenium-standalone)支持node安装方式,通过下列脚本可以安装执行，同时可以配置对应的hub信息。
启动后访问http://localhost:4444/wd/hub即可看到创建的hub信息
   
```shell
	npm install selenium-standalone@latest -g
	selenium-standalone start -- -role node -hub http://localhost:4444/grid/register -port 5556
``` 
  - selenium默认支持的浏览器为Firefox和phantom，如果要使用它操纵其他的浏览器参考如下方式安装对应驱动：
  - chrome:selenium-standalone install --drivers.chrome.version=2.15 --drivers.chrome.baseURL=http://chromedriver.storage.googleapis.com
  - safari：下载，并在safari中安装<a href="http://selenium-release.storage.googleapis.com/index.html" target="_blank">SafariDriver.safariextz</a>插件(safari9以上不需要)
  - ie：selenium-standalone install --drivers.chrome.version=2.15 --drivers.chrome.baseURL=http://chromedriver.storage.googleapis.com

由于jar"墙"无法下载chromedriver以及selenium.jar,所以npm install selenium-standalone@latest -g 安装完成后,建立文件夹.selenium,并拷贝下面两个文件夹到目录下即可
  
   - chromedirver http://pan.baidu.com/s/1dEeLDrr
   - seleniumjar http://pan.baidu.com/s/1dEssRWP


## program启动

### node

```javascript
var selenium = require('selenium-standalone');
selenium.start({
    seleniumArgs:['-port', '5555']
},function(err, child) {
    if (err) {
        console.log(err);
        return;
    }
    child.stderr.on('data', function(data){
        console.log(data.toString());
    });
});
```

### selenium-webdriver

可以使用selenium-webdriver的remote模块,参考protractor中的代码

```javascript
//serverConf: { args: [ '-Dwebdriver.chrome.driver=/usr/local/lib/node_modules/protractor/selenium/chromedriver' ],port: 'xxx' }
this.server_ = new remote.SeleniumServer(this.config_.seleniumServerJar, serverConf);
  //start local server, grab hosted address, and resolve promise
  this.server_.start().then(function(url) {
    log.puts('Selenium standalone server started at ' + url);
    self.server_.address().then(function(address) {
      self.config_.seleniumAddress = address;
      deferred.resolve();
    });
  });
```
