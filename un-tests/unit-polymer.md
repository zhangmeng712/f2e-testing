# 前端自动化测试之单元测试（一）—— polymer组件的测试工具

## 单元测试的工具们
- 单元测试框架
    - Qunit - jquery的单测工具
    - jasmine - 早期的测试框架
    - mocha - 常用框架 支持BDD和TDD
    - Cucumber - 语义化更好的测试工具
- 断言
   - chai
- 集成
    - Karma
    - jenkins
    - travis-ci
- mock
    - sinon
    - supertest

- 组件测试框架
   - polymer的单测工具：web-component-tester
   - react的单测工具：Jest

之前的博客对比较基础的测试工具都有所介绍，参考前端自动化测试基础篇，在这篇blog中，我们首先了解一下polymer组件的单元测试工具。
- <a href="http://dj1211.com/?p=581" target="_blank">mocha</a>
- <a href="http://dj1211.com/?p=613" target="_blank">chai</a>
- <a href="http://dj1211.com/?p=640" target="_blank">sinon</a>

## why web-component-tester
<a href="https://github.com/Polymer/web-component-tester" target="_blank">web-component-tester</a>是polymer组件用于单元测试的框架,主要是用作对于html文件的测试
- 它内部集成了mocha、sinon、sinon-chai、chai，方便使用
- 使用lodash作为工具函数
- async用作异步函数的测试
- test-fixture作为<template>模板的测试
- accessibility-developer-tools将测试结果输出到命令行中。
- 在server端wct内置selenium-standalone，在客户端使用wd.js操作服务器进行测试

## API方法
### 基本API

- WCT.loadSuites可以将
- suite类似describe将测试进行归类
- test类似it进行具体的测试
- assert用于进行断言，断言同chai的assert的断言规则

```javascript
suite('AwesomeLib', function() {
  test('is awesome', function() {
    assert.isTrue(AwesomeLib.awesome);//TDD模式
  });
});
```

### 特殊的方法
- text-fixture 用来在测试过程中操作template中的dom元素，用法是在<template>外部用<test-fixture>包裹起来。然后就可以通过
fixture获取元素，按照dom进行操作。

```javascript
<test-fixture id="simple">
  <template>
    <div></div>
  </template>
</test-fixture>
<script>
  suite('classList', function() {
    var div;
    setup(function() {
      div = fixture('simple');
    })
    test('foo', function() {
      div.classList.add('foo');
      assertSomethingOrOther(div);
    });
  });
</script>
```


### 关于template binding异步的测试
异步测试在javascript的世界中可谓最常见，对于polymer组件来说，数据驱动模板刷新很重要，
模板数据的刷新会调用Polymer.dom.flush, 它是个异步的过程，对此 web-components-tester 专门提供
flush函数处理此类异步。

```javascript
suite('with two selected items', function() {
  // Clean up after ourselves.
  teardown(function(done) {
    s.clearSelection();
    s.multi = false;
    // Wait for observers to resolve before moving on to more tests.
    flush(done);
  });

  test('multi selects by index', function(done) {
    s.multi = true;
    //数据变化
    s.selected = [0, 2];
    flush(function() {
      //模板刷新
      assert.equal(s.selectedIndex, [0, 2]);
      assert(s.children[0].classList.contains('core-selected'));
      assert(!s.children[1].classList.contains('core-selected'));
      assert(s.children[2].classList.contains('core-selected'));
      done();
    });
  });

});
```

## google map component测试实例
- 1、安装 web-components-tester： npm install -g web-component-tester
- 2 建立test文件夹（默认地址）
    - 2.1 index.html
    - 2.2 google-map-marker.html
    - 2.3 marker.js

```javascript

suite('markers default', function () {
    var map;
    setup(function () {
        map = document.querySelector('#map');
    });

    test('markers are initialized', function () {
        var markerEl = Polymer.dom(map).querySelector('google-map-marker');
        assert.isUndefined(markerEl.marker);
        assert.isUndefined(markerEl.map);
        assert.isNull(markerEl.info);
        assert.equal(markerEl.latitude, 37.779);
        assert.equal(markerEl.longitude, -122.3892);
    });

    test('markers are added to map', function () {
        map.addEventListener('google-map-ready', function () {
            var mapMarkerEl = Polymer.dom(map).querySelector('google-map-marker');
            var firstMarker = map.markers[0];
            expect(firstMarker).to.deep.equal(mapMarkerEl);
            assert.equal(map.markers.length, 3);
        });
    });

    test('markers position can be updated', function (done) {
        map.addEventListener('google-map-ready', function (e) {
            var markerEl = Polymer.dom(map).querySelector('google-map-marker');
            markerEl.latitude = 37.79493;
            markerEl.longitude = -122.41942;
            markerEl.zIndex = 1;
            assert.equal(markerEl.map, map.map, "marker's map is not the google-map's");
            //重新渲染 异步过程
            Polymer.dom.flush();
            async.nextTick(function () {
                var marker = markerEl.marker;
                assert.equal(marker.getPosition().lat(), markerEl.latitude);
                assert.equal(marker.getPosition().lng(), markerEl.longitude);
                assert.equal(marker.getZIndex(), markerEl.zIndex);
                done();
            });
        });
    });
});
```
- 3 运行测试脚本 wct 即可。
<img src="https://img.alicdn.com/tps/TB1lCyvLpXXXXcwXpXXXXXXXXXX-1335-558.jpg">
<img src="https://img.alicdn.com/tps/TB1iSqbLpXXXXa0aXXXXXXXXXXX-991-247.jpg">

## wct运行机制
代码：<a href="https://github.com/Polymer/web-component-tester/tree/master/runner" target="_blank">runner</a>
- 建立webserver，模板参见<a href="https://github.com/Polymer/web-component-tester/blob/master/data/index.html" target="_blank">index.html</a>
- 读取wct.conf.json配置
- 内置selenium server 通过wd.js建立连接打开浏览器进行测试
- 并将结果通过socketIO返回显示在命令行
- 测试框架核心：browser.js， <a href="https://github.com/Polymer/web-component-tester/tree/master/browser" target="_blank">源码</a>内置chai mocha sinon socket等以及polymer测试的辅助函数

## 辅助工具

在测试中少不了点击事件的模拟，wct这个工具不具有这个功能，但是可以使用polymer的工具组件<a href="https://github.com/PolymerElements/iron-test-helpers">iron-test-helpers</a>
它内置了MockInteraction可以实现各个事件的模拟，只需import iron-test-helpers.html 即可。使用方法如下：

```javascript
test('can be triggered with space', function(done) {
  button.addEventListener('keydown', function() {
    done();
  });
  MockInteractions.pressSpace(button);
});

test('can be clicked', function(done) {
  button.addEventListener('click', function() {
    done();
  });
  MockInteractions.tap(button);
});
```



