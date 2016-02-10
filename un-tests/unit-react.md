# Jest

前面介绍了<a target="_blank" href="">Polymer</a>的测试框架web-components-tester, 今天来看看React团队出品的Jest.在此,特别感谢婆婆帮忙带宝宝才让我有时间继续书写文章.

## Jest的功能

- 内置jasmine
- 内置mock函数 可以mock模块
- 基于jsdom
- 同步化书写异步代码
- 真心赞一下简洁明了的API定义和用法 以及清晰的文档,确实让书写单元测试不再痛苦
- 适用于commonJS模块的单元测试
- 运行速度较慢

## Jest用法

- 安装: npm install jest-cli(需要node版本大于4)
- 配置 package.json 如下
- 运行: npm test
- 调试(使用node-debug再浏览器中调试)：node-debug --nodejs --harmony ./node_modules/jest-cli/bin/jest.js --runInBand __tests__/getUser-test.js
- 运行单个文件 ./node_modules/jest-cli/bin/jest.js __tests__/getUser-test.js

```javascript
{
  "name": "jest-test-examples",
  "version": "0.0.1",
  "dependencies": {},
  "scripts": {
    "test": "jest"
  }
}
```
下面就具体介绍一下使用jest进行测试的方法,采用的例子为jest的<a href="https://facebook.github.io/jest/docs/getting-started.html#content" target="_blank">官方实例</a>

## 一个简单的测试

```javascript
jest.dontMock('../src/sum');
describe('sum', function() {
    it('adds 1 + 2 to equal 3', function() {
        var sum = require('../src/sum');
        expect(sum(1, 2)).toBe(3);
    });
});
```
describe和it还有expect都使用了jasmine的语法, jest会自动mock所有的依赖模块,对模块中所有的输出方法予以遍历并进行mock,对于要测试的模块使用jest.dontMock标识,jest就不会去mock.

## 异步的单元测试实例
异步是javascript的灵魂, 所以异步的测试也是极其重要的,下面看看jest关于异步程序的测试,假如有这样个ajax程序,获取数据并进行解析,对其进行测试
    
 - 1 ajax的数据获取是否正确
 - 2 parseUserJson是否正确
在第二个测试用例中使用了genMockFunction,用来对回调函数进行mock,在jest中有两种方式进行函数的mock
- 1 使用xFunc = require('xx');
- 2 使用xFunc = jest.genMockFunction();
使用后,会在xFunc.calls中存储有关函数的调用信息,例如
- //mock.calls.length 记录了函数被调用了几次
- //mock.calls[0][0]  被调用函数的第一个参数
- //mock.calls[0][1]  第二个参数
代码如下: $.ajax是一个被mock的函数,callback也被mock,getUser(callback)调用后,可以通过检测传递的参数判断是否正确.
```javascript
var $ = require('jquery');
function parseUserJson(userJson) {
    return {
        loggedIn: true,
        fullName: userJson.firstName + ' ' + userJson.lastName
    };
}
function fetchCurrentUser(callback) {
    return $.ajax({
        type: 'GET',
        url: 'http://example.com/currentUser',
        success: function(userJson) {
            callback(parseUserJson(userJson));
        }
    });
}
module.exports = fetchCurrentUser;
```

```javascript
jest.dontMock('../src/getUser');
describe('getUser', function() {
    //test right params
    it('calls into $.ajax with the correct params', function() {
        var $ = require('jquery');
        var getUser = require('../src/getUser');
        function dummyCallback() {}
        getUser(dummyCallback);
        // Now make sure that $.ajax was properly called during the previous
        // 2 lines
        expect($.ajax).toBeCalledWith({
            type: 'GET',
            url: 'http://example.com/currentUser',
            success: jasmine.any(Function)
        });
    });

    //test callback function
    it('calls the callback when $.ajax requests are finished', function() {
        var $ = require('jquery');
        var getUser = require('../src/getUser');

        //create mock function
        var callback = jest.genMockFunction();
        getUser(callback);

        //xfunc.mock have interactions information
        //mock.calls.length call times
        //mock.calls[0][0] first param
        //mock.calls[0][1] second param
        //https://facebook.github.io/jest/docs/mock-functions.html

        //emulate the params pass to success
        $.ajax.mock.calls[0][0].success({
            firstName: 'Bobby',
            lastName: '");DROP TABLE Users;--'
        });

        expect(callback.mock.calls[0][0]).toEqual({
            loggedIn: true,
            fullName: 'Bobby ");DROP TABLE Users;--'
        });

    });
});
```

## React组件的单元测试实例

假如我们有这样一个checkbox react组件, 如下, react的es6写法请参考我的blog-<a href="http://dj1211.com/?p=667" target="_blank">ES6的核心语法与应用</a>
原理非常简单,点击checkbox切换label的状态.我们的测试代码如下, 使用了<a href="https://facebook.github.io/react/docs/test-utils.html" target="_blank">react-addons-test-utils</a>这个模块, 模块的renderIntoDocument用于将react组件渲染到document中,
并且支持产生模拟事件:TestUtils.Simulate.change. 
```javascript
import React from 'react';
class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        this.changeState = this.changeState.bind(this);
    }
    changeState () {
        this.setState({isChecked: !this.state.isChecked})
    }
    render() {
        return (<label>
                <input type="checkbox" checked={this.state.isChecked} onChange={this.changeState} />
                {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
               </label>)
    }

}
export default Checkbox;
```

```javascript
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDom from  'react-dom';
jest.dontMock('../src/checkbox');
const Checkbox = require('../src/checkbox');

describe('test react checkbox component', () => {
    it('change the label after click', () => {
        //1 render component
        //2 get node label get default value off
        //3 simulate click
        //4 expect value equal on

        //TestUtils.renderIntoDocument method refers to https://facebook.github.io/react/docs/test-utils.html#renderintodocument
        //TestUtils.findRenderedDOMComponentWithTag https://facebook.github.io/react/docs/test-utils.html#findrendereddomcomponentwithtag
        //ReactDom API:findDOMNode render unmountComponentAtNode server-side:renderToString renderToStaticMarkup

        var checkbox = TestUtils.renderIntoDocument(<Checkbox labelOn="On" labelOff="Off" />);
        var checkboxNode = ReactDom.findDOMNode(checkbox);
        //https://facebook.github.io/jest/docs/api.html#expect-value
        expect(checkboxNode.textContent).toEqual('Off');
        TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input'));
        expect(checkboxNode.textContent).toEqual('On');
    });
});
```

运行的时候我们需要通过babel预处理一下,通过如下的方式配置package.json即可运行:

```javascript
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "scriptPreprocessor": "<rootDir>/node_modules/babel-jest",
    "unmockedModulePathPatterns": [
      "<rootDir>/node_modules/react",
      "<rootDir>/node_modules/react-dom",
      "<rootDir>/node_modules/react-addons-test-utils"
    ],
    "modulePathIgnorePatterns": [
      "<rootDir>/node_modules/"
    ]
  }
```

## 手动mock

经常我们需要模拟某个模块中的方法(此方法实现非常复杂依赖第三方的模块)用来测试另一个模块的输入输出是否正确,jest就提供非常方便的mock机制,例如,我们在A模块中依赖jquery的fx方法
而fx方法又依赖于其他方法, 因为我们只关心fx的输出,所以我们就可以直接用来模拟,方法如下:

- 建立__mocks__文件夹
- 新建jquery模块:jquery.js
- 使用genMockFromModule和mockImplementation API 如下

```javascript
// mock the module of real jquery

var jqueryMocks = jest.genMockFromModule('jquery');
var mock_fx = function () {
    return 'mockValue';
};
//using mock_fx to mock the function of real fx
jqueryMocks.fx.mockImplementation(mock_fx);
module.exports = jqueryMocks;
```
这样就可以在测试代码中直接引用已经模拟好的fx函数进行测试了,直接对模块的输入控制,减少了依赖,实现测试的"解耦".

```javascript
describe('jest mocks', function () {
   it('jquery mock getEnv value', function(){
       var value = require('jquery').fx();
       expect(value).toEqual('mockValue')
   });
});
```

## 代码参考

<a href="" target="_blank">源码</a>








