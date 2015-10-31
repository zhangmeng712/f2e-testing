# React UI自动化测试

前面的blog介绍了<a href="http://dj1211.com/?p=571" target="_blank">《前端UI自动化测试》</a>，有关UI测试的方方面面，这篇文章主要是通过实践的方式，使用里面提到的技术来进行对React组件的测试。


## 一个React程序

假设有这样一个“订单“的react程序，我们在这里使用的是<a href="http://book.douban.com/subject/26630610/">《Learning Behavior-driven Development with JavaScript》</a>中的例子，主要由这几个React Class构成：

![](http://gtms01.alicdn.com/tps/i1/TB1EQQjJVXXXXaZXpXXe3WcTFXX-698-179.jpg)

- order-view: 入口文件，用于调度应用，提供onAddBeverage和update
	- order: form和orderItem的承载页面
    	- form 订单提交组件
    		- input 订单提交的input单元组件（text和submit）
    	- orderItem 显示订单列表组件

```javascript
'use strict';
var React = require('react'),
    OrderView = require('./components/order.jsx');

function NOOP() {
}

module.exports = function (containerSelector, controller) {
  var onAddBeverage = NOOP;
  if (controller)
    onAddBeverage = controller.addBeverage.bind(controller);

  var view = React.render(
      <OrderView onAddBeverage={onAddBeverage}/>,
      document.querySelector(containerSelector)
  );

  return {
    update: view.setProps.bind(view)
  };
};
```

## 使用express构建服务

我们知道react的一大特点就是客户端和服务端的“同构”。因此要进行测试的话，需要首先将页面构建出来，这里采用 express作为server端构建应用，使用browsify编译react的模板。具体的代码:

```javascript
var express = require('express'),
    port = process.env.PORT || 3000,
    server,
    app = express(),
    browserify = require('browserify'),
    reactify = require('reactify'),
    bundles = {};

var wd = require('wd');
var Q = wd.Q;
function registerBundle(name, cb) {
    return function (err, buf) {
        if (err)
            return cb(err);
        bundles[name] = buf.toString();
        if (cb) cb();
    };
}
/**
	编译react
*/
function bundleReact (cb) {
    var reactFileName = require.resolve('react/dist/react.js');
    browserify({
        noParse: [reactFileName]
    })
        .require(reactFileName, {expose: 'react'})
        .bundle(registerBundle('react', cb));
}

function bundleOrderView(cb) {
    var viewFileName = require.resolve(__dirname + '/src/order-view.jsx');
    browserify()
        .transform(reactify)
        .require(viewFileName, {expose: 'order-view'})
        .add(viewFileName)
        .exclude('react')
        .bundle(registerBundle('order-view', cb));
}

Q.all([
    bundleReact(),
    bundleOrderView()
]).then(function () {
    app.use(express.static(__dirname + '/test/..'));
    app.get('/dist/:bundleName.js', function (req, res) {
        var bundle = bundles[req.param('bundleName')];
        if (!bundle)
            return res.sendStatus(404);
        res.set('Content-Type', 'application/json');
        res.send(bundle);
    });
    app.listen(port, function () {
        server = this;
        console.log('server started')
    });
    
```



## 测试用例的设计

UI测试是耗时的所以只对，这里主要有两个测试要点：
- 表单的提交是否正确
- 是否能够正常的显示


## wdjs实现


## pageObject改写用例




