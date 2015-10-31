# chai和chai插件的用法

## chai

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
  <script src="/node_modules/chai/chai.js"></script>
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

//not用法
expect(foo).to.not.equal('bar');
expect(goodFn).to.not.throw(Error);
expect({ foo: 'baz' }).to.have.property('foo').and.not.equal('bar');

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











```

### should用法

```javascript
var chai = require('chai');
chai.should();
    //语法： 基本是 expect().to.xx 相当于 ().should.xx
    foo.should.be.a('string'); //expect(foo).to.be.a('string');
    foo.should.equal('bar'); //expect(foo).to.equal('bar');
    //省略用法，见expect
```
注意：should在IE9下有问题

### assert
assert为TDD用法，现在一般都是用基于BDD的测试，所以省略，详情请参考 <a href="" target="">Assert</a>

### 测试用例
- browser端：<a href="http://chaijs.com/api/test/">点击</a>
- node端:
    - chai-should.js
    - chai-expect.js

## chai as promise用法


## sinon-chai用法
http://chaijs.com/plugins/sinon-chai

