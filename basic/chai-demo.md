# chai和chai插件的用法

## chai
### 概念

 测试技术的断言框架。

### 特点
- 支持多种BDD/TDD断言语法
    - BDD：should
    - BDD：expect
    - TDD：assert
- 可用在browser端和node端。
- 可以和很多测试框架结合例如mocha jasmine等进行单元和UI测试。

### 安装

```shell
    npm install chai
```

### 用法
#### browser端
```html
  <script src="//cdn.bootcss.com/chai/3.4.0/chai.js"></script>
  <script>
    //expect为全局的函数
     expect(foo).to.not.equal('bar');
  </script>
```

#### node端

```javascript
var chai = require('chai'),
    expect = chai.expect;
chai.should();
```

### expect用法

```javascript

//------------------ 连接词用法 -----------------
//not用法 expect().not.to.
expect(foo).to.not.equal('bar');
expect(goodFn).to.not.throw(Error);
expect({ foo: 'baz' }).to.have.property('foo').and.not.equal('bar');

//deep用法 expect(foo).to.deep. 通常和equal连用，判断object的相等需要用deep
expect(foo).to.deep.equal({ bar: 'baz' });


//any用法 用在keys的判断上
expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');

// all用法 用在keys的判断上
expect(foo).to.have.all.keys('bar', 'baz');
expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);

//a 判断typeof 或者 language chain
// typeof
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
expect(null).to.be.a('null');
expect(undefined).to.be.an('undefined');

// language chain
expect(foo).to.be.an.instanceof(Foo);



//---------------------判断bool----------------------
//bool
// 1 truthy
expect('everthing').to.be.ok;
expect(1).to.be.ok;
expect(false).to.not.be.ok;
expect(undefined).to.not.be.ok;
expect(null).to.not.be.ok;

//2 true
expect(true).to.be.true;
expect(1).to.not.be.true;

//3 false
expect(false).to.be.false;
expect(0).to.not.be.false;

//4 null
expect(null).to.be.null;
expect(undefined).not.to.be.null;

// 5 undefined
expect(undefined).to.be.undefined;
expect(null).to.not.be.undefined;

//6 exist
var foo = 'hi'
  , bar = null
  , baz;

expect(foo).to.exist;
expect(bar).to.not.exist;
expect(baz).to.not.exist;

//7 expty
expect([]).to.be.empty;
expect('').to.be.empty;
expect({}).to.be.empty;

//------------------------判断函数参数---------------------------
// arguments
function test () {
  expect(arguments).to.be.arguments;
}


//------------------------判断相等和大小关系--------------------------------
// equal if the deep flag is set, 
// attention: asserts that the target is deeply equal to value.
expect('hello').to.equal('hello');
expect(42).to.equal(42);
expect(1).to.not.equal(true);
expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });


// eql: 判断值等
expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);

//.above：大于

expect(10).to.be.above(5);
expect('foo').to.have.length.above(2);
expect([ 1, 2, 3 ]).to.have.length.above(2);

//least 至少
expect('foo').to.have.length.of.at.least(2);
expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);


//below 低于
expect(5).to.be.below(10);
expect('foo').to.have.length.below(4);
expect([ 1, 2, 3 ]).to.have.length.below(4);

//most 最大为
expect(5).to.be.at.most(5);
expect('foo').to.have.length.of.at.most(4);
expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);

//.within(start, finish)在什么区间内
expect(7).to.be.within(5,10);
expect('foo').to.have.length.within(2,4);
expect([ 1, 2, 3 ]).to.have.length.within(2,4);

//.closeTo(expected, delta)
expect(1.5).to.be.closeTo(1, 0.5);

//------------------正则---------------

//match(regexp)
expect('foobar').to.match(/^foo/);

//-----------------字符串-------------
//string 判断含有某字符串
expect('foobar').to.have.string('bar');

//----------------throw---------------

var err = new ReferenceError('This is a bad function.');
var fn = function () { throw err; }
expect(fn).to.throw(ReferenceError);
expect(fn).to.throw(Error);
expect(fn).to.throw(/bad function/);
expect(fn).to.not.throw('good function');
expect(fn).to.throw(ReferenceError, /bad function/);
expect(fn).to.throw(err);
expect(fn).to.not.throw(new RangeError('Out of range.'));

//------------------------object相关判断-------------------------
//deep & property属性
expect(foo).to.deep.equal({ bar: 'baz' });
expect({ foo: { bar: { baz: 'quux' } } }).to.have.deep.property('foo.bar.baz', 'quux');


// typeof
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
expect(null).to.be.a('null');
expect(undefined).to.be.an('undefined');

// language chain
expect(foo).to.be.an.instanceof(Foo);

// include
expect([1,2,3]).to.include(2);
expect('foobar').to.contain('foo');
expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');

// members 判断数组成员
expect([1, 2, 3]).to.include.members([3, 2]);
expect([1, 2, 3]).to.not.include.members([3, 2, 8]);

expect([4, 2]).to.have.members([2, 4]);
expect([5, 2]).to.not.have.members([5, 2, 1]);
expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);


//respondTo(method) 判断是否是原型方法
Klass.prototype.bar = function(){};
expect(Klass).to.respondTo('bar');
expect(obj).to.respondTo('bar');

Klass.baz = function(){};
expect(Klass).itself.to.respondTo('baz');

//itself和respondTo结合起来判断是否是原型链的方法还是自身的方法
function Foo() {}
Foo.bar = function() {}
Foo.prototype.baz = function() {}

expect(Foo).itself.to.respondTo('bar');
expect(Foo).itself.not.to.respondTo('baz');


//change 判断函数是否改变了对象的属性值
var obj = { val: 10 };
var fn = function() { obj.val += 3 };
var noChangeFn = function() { return 'foo' + 'bar'; }
expect(fn).to.change(obj, 'val');
expect(noChangFn).to.not.change(obj, 'val')

//increase(function) 函数是否升高了属性值
var obj = { val: 10 };
var fn = function() { obj.val = 15 };
expect(fn).to.increase(obj, 'val');


//.decrease(function) 函数是否降低了属性值
var obj = { val: 10 };
var fn = function() { obj.val = 5 };
expect(fn).to.decrease(obj, 'val');

//keys.判断是否object含有某项属性
//Note, either any or all should be used in the assertion. If neither are used, the assertion is defaulted to all.
expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo', 7});
expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys([{'bar': 6}}]);


```

### should用法

同chai的差别详情<a href="http://chaijs.com/guide/styles/" target="_blank">参考</a>
```javascript
var chai = require('chai');
chai.should();
    //语法： 基本是 expect().to.xx 相当于 ().should.xx ****
    foo.should.be.a('string'); //expect(foo).to.be.a('string');
    foo.should.equal('bar'); //expect(foo).to.equal('bar');
    //省略用法，见expect
```
注意：should在IE9下有问题

### assert
assert为TDD用法，现在一般都是用基于BDD的测试，所以省略，详情请参考 <a href="" target="">Assert</a>


## chai as promise用法 **

- 将promise和chai结合起来，用于在某种异步的条件下形成的断言判断
- attention： Chai as Promised is only compatible with modern browsers (IE ≥9, Safari ≥6, no PhantomJS)
- 具体用法：<a href="https://github.com/domenic/chai-as-promised/" target="_blank">参见</a>

```javascript

doSomethingAsync().then(
    function (result) {
        result.should.equal("foo");
        done();
    },
    function (err) {
       done(err);
    }
);

//安装： npm install chai-as-promised
//引用chai as promise后可以写作 should.eventually.xxx
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

return doSomethingAsync().should.eventually.equal("foo");

//在ui测试中可以写作
return driver.getAttribute(input, 'type').should.eventually.equal(fieldModel.type);

return promise.should.be.fulfilled;
return promise.should.eventually.deep.equal("foo");
return promise.should.become("foo"); // same as `.eventually.deep.equal`
return promise.should.be.rejected;
return promise.should.be.rejectedWith(Error); // other variants of Chai's `throw` assertion work too.

// 通过覆盖chaiAsPromised.transferPromiseness方法将assertion赋予then的链式调用功能
// 应用例子 wd.js中 chaiAsPromised.transferPromiseness = wd.transferPromiseness;

chaiAsPromised.transferPromiseness = function (assertion, promise) {
    assertion.then = promise.then.bind(promise); // this is all you get by default
    assertion.finally = promise.finally.bind(promise);
    assertion.done = promise.done.bind(promise);
};
```

## sinon-chai用法 **

- sinon-chai 用于对<a href="http://sinonjs.org/" target="_blank">Sinon.JS</a>中的spy, stub, and mocking framework进行断言
- 具体用法，<a href="http://chaijs.com/plugins/sinon-chai" target="_blank">参见</a>
- API为：
<table>
    <thead>
        <tr>
            <th>Sinon.JS property/method</th>
            <th>Sinon–Chai assertion</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>called</td>
            <td>spy.should.have.been.called</td>
        </tr>
        <tr>
            <td>callCount</td>
            <td>spy.should.have.callCount(n)</td>
        </tr>
        <tr>
            <td>calledOnce</td>
            <td>spy.should.have.been.calledOnce</td>
        </tr>
        <tr>
            <td>calledTwice</td>
            <td>spy.should.have.been.calledTwice</td>
        </tr>
        <tr>
            <td>calledThrice</td>
            <td>spy.should.have.been.calledThrice</td>
        </tr>
        <tr>
            <td>calledBefore</td>
            <td>spy1.should.have.been.calledBefore(spy2)</td>
        </tr>
        <tr>
            <td>calledAfter</td>
            <td>spy1.should.have.been.calledAfter(spy2)</td>
        </tr>
        <tr>
            <td>calledWithNew</td>
            <td>spy.should.have.been.calledWithNew</td>
        </tr>
        <tr>
            <td>alwaysCalledWithNew</td>
            <td>spy.should.always.have.been.calledWithNew</td>
        </tr>
        <tr>
            <td>calledOn</td>
            <td>spy.should.have.been.calledOn(context)</td>
        </tr>
        <tr>
            <td>alwaysCalledOn</td>
            <td>spy.should.always.have.been.calledOn(context)</td>
        </tr>
        <tr>
            <td>calledWith</td>
            <td>spy.should.have.been.calledWith(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWith</td>
            <td>spy.should.always.have.been.calledWith(...args)</td>
        </tr>
        <tr>
            <td>calledWithExactly</td>
            <td>spy.should.have.been.calledWithExactly(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWithExactly</td>
            <td>spy.should.always.have.been.calledWithExactly(...args)</td>
        </tr>
        <tr>
            <td>calledWithMatch</td>
            <td>spy.should.have.been.calledWithMatch(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWithMatch</td>
            <td>spy.should.always.have.been.calledWithMatch(...args)</td>
        </tr>
        <tr>
            <td>returned</td>
            <td>spy.should.have.returned(returnVal)</td>
        </tr>
        <tr>
            <td>alwaysReturned</td>
            <td>spy.should.have.always.returned(returnVal)</td>
        </tr>
        <tr>
            <td>threw</td>
            <td>spy.should.have.thrown(errorObjOrErrorTypeStringOrNothing)</td>
        </tr>
        <tr>
            <td>alwaysThrew</td>
            <td>spy.should.have.always.thrown(errorObjOrErrorTypeStringOrNothing)</td>
        </tr>
    </tbody>
</table>

```javascript

//安装 npm install sinon-chai
//用法
var chai = require("chai");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);


function hello(name, cb) {
    cb("hello " + name);
}
describe("hello", function () {
    it("should call callback with correct greeting", function () {
        var cb = sinon.spy();
        hello("foo", cb);
        cb.should.have.been.calledWith("hello foo");
        //if expect expect(cb).to.have.been.calledWith("hello foo");
    });
});


```

### chai和mocha结合的测试用例
- browser端：<a href="http://chaijs.com/api/test/">点击</a>
- node端:
    - <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/test/chai-should.js" target="_blank">chai-should.js</a>
    - <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/test/chai-expect.js" target="_blank">chai-expect.js</a>

