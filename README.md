# F2e-Testing

本仓库用于前端自动化测试手段的详解

## BDD & TDD

- <a href="https://en.wikipedia.org/wiki/Behavior-driven_development" target="_blank">BDD(Behavior-driven development)</a>
- <a href="https://en.wikipedia.org/wiki/Test-driven_development" target="_blank">TDD(Test-driven development)</a>
- <a href="http://gaboesquivel.com/blog/2014/differences-between-tdd-atdd-and-bdd/" target="_blank">Difference</a>: 一言蔽之 BDD比TDD更加的语义化人性化(difference is language and word)，例如

```javascript

    //BDD style
    describe("A suite", function() {
      it("contains spec with an expectation", function() {
        expect(true).toBe(true);
      });
    });
    
    //TDD style
     assert.areEqual([1, 2, 3], [1, 2, 3])

```

## 前端自动化测试基础篇

要进行前端代码的测试,有三个框架是最基础的

- 断言的框架: 主要有 chai should expect等
- 测试框架: jasmine cucumber以及mocha
- 数据模拟框架: sinon 

本repo主要讨论这几个框架

- <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/mocha-demo.md">mocha用法分析</a>
- <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/sinon-demo.md">sinon</a>
- <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/chai-demo.md">chai & chai plugins</a>


## 主流测试框架

不同的前端类库会使用不同的测试工具,例如jquery使用的是uit,express使用的是Mocha 现在比较流行的复杂性前端类库React Polymer以及Angular也开发出了自己的测试框架,
下面就分别看下这几个类库应运而生的测试框架是如何使用的:

- Protractor(for Angular Testing)  <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/protractor/e2e-protractor.md">protractor e2e测试使用实践</a>
- Jest (for React Testing) <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/un-tests/unit-react.md">jest单元测试使用实践</a>
- Web-component-tester (for Polymer testing) <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/un-tests/unit-polymer.md">wct单元测试使用实践</a>

## 前端自动化测试

前端自动化测试主要包括下面两部分内容,Unit测试高效,UI测试也是不可或缺,所以针对现在复杂的前端应用,应该使用这两种方式结合的自动化测试方式

### Unit单元测试

   - node单元测试
       - 接口和路由: 使用<a href="https://github.com/visionmedia/supertest" target="_blank">supertest</a>进行测试
       - 数据库
       - node模块测试: Jest
   - 前端单元测试
       - <a href="https://github.com/chenglou/react-motion/blob/master/karma.conf.js" target="_blank">使用karma和jasmine对react组件测试</a>
      
### UI测试

#### 手段
   - record-and-replay: 主要是指利用录制工具去记录用户的行为，并且把这种“行为“存储到脚本中，以便将来用于检测程序或应用是否能够产出预期的效果。常用的record-and-replay工具有：微软的RPF以及google早期出品的<a href="http://googletesting.blogspot.jp/2011/10/take-bite-out-of-bugs-and-redundant.html" target="_blank">abite</a>。
   - e2e测试(end-to-end testing)：这种测试方式不光可以测试UI层，还可以将整个系统的功能进行测试。通常这种测试会使用第三方的测试工具作为测试doubles层以提升测试效率。
   
#### 方案和框架
    
没人可以否认<strong>UI测试是耗时且昂贵的</strong>，所以在写测试的时候一定要慎重的选择使用UI测试的case，下图就是一种比较“聪明”的UI测试架构。我们可以将UI层进行拆分：<strong>视图层</strong>还有<strong>UI逻辑层</strong>。如果大家知道  MVX 这种架构，就会知道，UI逻辑层更像是 MVX 中的Controller层和Model层，视图层是比较难以测试和描述的，因此不建议将对视图层的内容作为UI测试的重点，当然我们也可以使用简单的spec来描述视图层的内容，或是对于视图的样式等使用 <strong><a href="http://galenframework.com/" target="_blank">galenframework</a></strong>类似的框架进行测试 (后面的blog会专门介绍这个框架，它脱离了<a href="https://github.com/Huddle/PhantomCSS" target="_blank">phantomCss</a>的检测方式，使用特殊的spec方式来描述case，对于前端来说，非常值得学习)。因此我们更多的测试会围绕UI逻辑层进行。UI逻辑层主要的用途如下，因此我们的case就围绕着对这两部分功能的测试进行编写。
   - 用户和浏览器的交互(操作和更新html)
   - 监听html的事件并且将信息通过request传递给后台
   
<img src="http://gtms01.alicdn.com/tps/i1/TB1EoZ_JpXXXXaSXVXXfGCCQVXX-512-362.jpg" width="500px" height="340px">
   
UI测试框架主要由两部分构成：客户端的Test环境和测试服务，测试框架的基本原理很简单，本着经济有效的原则，设计了这款使用开源技术的UI测试框架，跨平台、支持多语言、且支持PC端和mobile端的测试方案，本人是前端，所以下例都是基于Nodejs/javascript书写。
    
   ![](http://gtms01.alicdn.com/tps/i1/TB14RaGJFXXXXcVXpXXYZLw5FXX-556-445.jpeg)

   - UI测试服务器
       - <a href="selenium-standalone/selenium-server.md">selenium-standalone详解</a>
       - mobile端:<a href="appium/README.md">Appium详解</a>
   - UI测试脚本框架
       - wd.js详解
       - selenium-webdriver和protractor

    
#### UI测试实例
 - <a href="ui-wd-tests/mobile/safari-wd-search-test.js">wd.js和appium实现手机淘宝H5页面的简单测试</a>
 - <a href="react/test/">使用wd.js实现React的自动化测试</>
 - <a href="https://github.com/appium/sample-code/blob/master/sample-code/examples/node/android-webview.js" target="_blank">手机Hybrid webview的测试</a>
 - <a href="ui-galen-tests/responsive-automate.md">响应式设计的自动化测试</a>
  
