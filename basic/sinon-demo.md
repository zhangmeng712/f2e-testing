# sinon的用法

## sinon用途

- 在测试领域 Test double是很重要的一个概念。Test double主要用在自动化测试领域，会使用简单的对象或者流程模拟对应的行为减少测试的复杂性。
- 用于 JavaScript 的测试监视(spy)、桩(stub)和仿制(mock)功能。不依赖其他类库，兼容任何单元测试框架。

## sinon spy（最常用）
- test spy 是这样的一类函数，它可以记录自己被调用的情况，包括传入的参数、返回结果、this 指向和抛出的错误（如果有的话）。test spy 可以是一个匿名函数，也可以是对一个已有函数进行的封装。
- 用于测试callback函数
- 用于spy已知行为的方法
- 创建spy

```javascript
    //创建一个匿名的函数用于记录调用的参数、返回值、以及异常
    var spy = sinon.spy();
    var spy = sinon.spy(myFunc);
    //对对象的方法增加spy 用于替换原有方法的行为，可以通过调用object.method.restore()实现恢复设置
    var spy = sinon.spy(object, "method");
```


- sinon API用法

   - 判断某函数调用了某些参数：spy.withArgs(arg1[, arg2, ...]); e.g.  assert(spy.withArgs(42).calledOnce);
   - 某函数调用的次数：spy.callCount
   - spy.called
   - spy.calledTwice   spy.calledThrice
   - spy.firstCall spy.secondCall spy.thirdCall
   - 判断是否在另一个spy之前（后）被调用 spy.calledBefore(anotherSpy);spy.calledAfter(anotherSpy);
   - 至少有一次被某个参数调用，参数可以部分匹配：spy.calledWith(arg1, arg2, ...);
   - 至少有一次抛出异常：spy.threw();

- sinon spy实例

```javascript
        //以backbone的Event单测为例
        var eventer = _.extend({}, Backbone.Events),
            spy = sinon.spy();

        // Set up the spy.
        eventer.on("foo", spy);
        expect(spy.called).to.be.false;

        // Fire event.
        eventer.trigger("foo", 42);

        // Check number of calls.
        expect(spy.calledOnce).to.be.true;
        expect(spy.callCount).to.equal(1);

        // Check calling arguments.
        expect(spy.firstCall.args[0]).to.equal(42);
        expect(spy.calledWith(42)).to.be.true;
```


## sinon stub

- stub（桩）其实是最抽象最难理解的，Test stubs是一类预编码行为的函数（也是一种 spy）。除了改变stub对象的行为之外，它还支持所有的 spy API。同spy一样，stubs 可以是匿名函数，或者包装已有函数。当使用 stub 包装一个已有函数时，原函数将不会被调用。
- stub用于：
    - 在测试中控制一个方法的行为，以强制代码沿特定路径执行。例如测试错误处理时，可以强制一个方法抛出错误。
    - 当你希望阻止一个方法被直接调用时（可能是因为这个方法触发了干扰行为，例如 XHR 请求之类的）。
- 创建stub
  - 创建一个匿名的 stub 函数。var stub = sinon.stub();
  - 使用一个 stub 函数替代 object.method。原函数可以通过调用 object.method.restore() （或 stub.restore()）方法来还原。如果 object.method 不是一个函数，则会抛出一个异常来帮助你避免类型错误。var stub = sinon.stub(object, "method");
  - 使用 func 来替换 object.method，并且被包装在一个 spy 中。object.method.restore() 可以恢复原方法。var stub = sinon.stub(object, "method", func);
  - stub 该对象的所有方法。var stub = sinon.stub(obj);

- stub API，<a href="http://sinonjs.org/docs/#stubs">详情</a>
    - stub.withArgs(arg1[, arg2, ...]);
    - stub.returns(obj);
    - stub.throws(); 例： var callback = sinon.stub(); callback.withArgs(1).throws("TypeError");
    - stub.yieldsTo(property, [arg1, arg2, ...])

- sinon stub实例

```javascript
//basic usage
    var obj = {
      multiply: function (a, b) { return a * b; },
      error: function (msg) { throw new Error(msg); }
    };

    it("stubs multiply", function () {
      // Stub with a hard-coded return value.
      sinon.stub(obj, "multiply").returns(5);
      expect(obj.multiply(1, 2)).to.equal(5);
      obj.multiply.restore();

      // Stub with a function.
      sinon.stub(obj, "multiply", function (a, b) {
        return a + b;
      });
      expect(obj.multiply(1, 2)).to.equal(3);
      obj.multiply.restore();
    });

    it("stubs error", sinon.test(function () {
      this.stub(obj, "error");
      expect(obj.error).to.not.throw();
    }));
  });

//use yieldsTo
    it("stubs with yieldsTo", function () {
            var obj = {
                    async: function (opts) {
                        opts.success("a", "b");
                    }
                },
                spyObj = {
                    failure: sinon.spy(),
                    success: sinon.spy()
                };

            sinon.stub(obj, "async").yieldsTo("success", 1, 2);

            // Call on object with callback spies.
            obj.async(spyObj);

            expect(spyObj.failure).to.have.not.have.been.called;
            expect(spyObj.success)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith(1, 2);
        });

```

##sinon mock

- 用于给出expectation然后验证某个object的method是否是正确的
- 同spy的区别，mock出的object收到了数据或是调用并没有真正执行，一切针对mock的调用都是假的。所以mock可以用来测试具有side effect的函数，这里的side effect泛指和外部对象有数据交互或者是调用，比如调用外部对象的方法、向server发送数据、和UI对象有交互、写日志等等。
- API
    - 创建mock：var mock = sinon.mock(obj);
    - 给出expectation   mock.expects("method");
    - 校验是否正确： mock.verify();
    - 重置：mock.restore();

- sinon mock 例子

```javascript
describe("Sinon.JS mocks", function () {
  // Object literal with two methods.
  var obj = {
    multiply: function (a, b) { return a * b; },
    error: function (msg) { throw new Error(msg); }
  };

  it("mocks multiply", function () {
    // Create the mock.
    var mock = sinon.mock(obj);

    // The multiply method is expected to be called:
    mock.expects("multiply")
      .atLeast(2)    // 2+ times,
      .atMost(4)     // no more than 4 times, and
      .withArgs(2);  // 2 was first arg on *all* calls.

    // Make 3 calls to `multiply()`.
    obj.multiply(2, 1);
    obj.multiply(2, 2);
    obj.multiply(2, 3);

    // Verify **all** of the previous expectations.
    mock.verify();

    // Restore the object.
    mock.restore();
  });

});
```

## sinon FakeTimer

## sinon Fake XMLHttpRequest/ Fake Server

- fake server用法

```javascript
    {
        setUp: function () {
            this.server = sinon.fakeServer.create();//创建server
        },

        tearDown: function () {
            this.server.restore();
        },

        "test should fetch comments from server" : function () {
            this.server.respondWith("GET", "/some/article/comments.json",
                [200, { "Content-Type": "application/json" },
                 '[{ "id": 12, "comment": "Hey there" }]']);

            var callback = sinon.spy();
            myLib.getCommentsFor("/some/article", callback);
            this.server.respond();

            sinon.assert.calledWith(callback, [{ id: 12, comment: "Hey there" }]);
        }
    }

```

- sinon可以用作实现request的模拟，现在更多的使用<a href="https://github.com/visionmedia/supertest" target="_blank">supertest</a>
用于HTTP的测试

```javascript
describe('GET /user', function(){
  it('user.name should be an case-insensitive match for "tobi"', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.id = 'some fixed id';
        res.body.name = res.body.name.toUpperCase();
      })
      .expect(200, {
        id: 'some fixed id',
        name: 'TOBI'
      }, done);
  });
});
```

## <a href="https://github.com/zhangmeng712/f2e-testing/blob/master/basic/test/test-sinon.html">sinon 测试代码</a>

