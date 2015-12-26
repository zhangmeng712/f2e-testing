/**
 * @fileOverView sinon
 * @author zhangmeng on 15/12/21
 */

describe("Sinon.JS spies", function () {
    //匿名函数增加spy
    it("calls anonymous spy on event", function () {
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
    });

    //函数spy
    it("calls spy wrapper on function", function () {
        var divide = function (a, b) {
                return a / b;
            },
            divAndSpy = sinon.spy(divide);

        // Call wrapped function and verify result.
        expect(divAndSpy(4, 2)).to.equal(2);

        // Now, verify spy properties.
        sinon.assert.calledOnce(divAndSpy);
        sinon.assert.calledWith(divAndSpy, 4, 2);

        // Sinon.JS doesn't have assert for returned.
        expect(divAndSpy.returned(2)).to.be.true;
    });

    //Sinon.JS ships with a set of assertions that mirror most behavior verification methods and properties on spies and stubs
    var obj = {
        multiply: function (a, b) {
            return a * b;
        },
        error: function (msg) {
            throw new Error(msg);
        }
    };

    it("calls spy on wrapped object", function () {
        // Wrap members with `sinon` directly.
        sinon.spy(obj, "multiply");
        sinon.spy(obj, "error");

        expect(obj.multiply(5, 2)).to.equal(10);
        sinon.assert.calledWith(obj.multiply, 5, 2);
        expect(obj.multiply.returned(10)).to.be.true;

        try {
            obj.error("Foo");
        } catch (e) {
        }

        //Passes if the spy threw the given exception
        sinon.assert.threw(obj.error, "Error");

        // Have to restore after tests finish.
        obj.multiply.restore();
        obj.error.restore();
    });

    //结合chai使用
    function hello(name, cb) {
        cb("hello " + name);
    }

    it("using chai plugin", function () {
        var cb = sinon.spy();

        hello("foo", cb);

        expect(cb).to.have.been.calledWith("hello foo");
    });

});

describe("Sinon.JS Stubs", function () {
    describe("basic usage", function () {
        var obj = {
            multiply: function (a, b) {
                return a * b;
            },
            error: function (msg) {
                throw new Error(msg);
            }
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
            var stub = this.stub(obj, "error");
            //stub.throws();
            expect(obj.error).to.not.throw();
        }));
    });

    describe("asynchronous", function () {

        it("stubs with yields", function (done) {
            var obj = {
                async: function (callback) {
                    callback("a", "b");
                }
            };

            sinon.stub(obj, "async").yields(1, 2);

            // Verify stub calls with (1, 2), *not* ("a", "b").
            //
            // **Note**: We stick the assertion code *in* the callback
            // here, but we could just as easily use a Sinon.JS spy
            // as the callback to `obj.async()` for verification purposes.
            obj.async(function (first, second) {
                expect(first).to.equal(1);
                expect(second).to.equal(2);

                obj.async.restore();
                done();
            });
        });

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

        it("stubs with callsArgWith", function () {
            var obj = {
                    async: function (callback, errback) {
                        callback("a", "b");
                    }
                },
                callbackSpy = sinon.spy(),
                errbackSpy = sinon.spy();

            // "1" is the index of the `errback` parameter.
            // "2, 3" are the callback arguments.
            sinon.stub(obj, "async").callsArgWith(1, 2, 3);

            // Call on object with callback and errback spies.
            obj.async(callbackSpy, errbackSpy);

            expect(callbackSpy).to.have.not.have.been.called;
            expect(errbackSpy)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith(2, 3);
        });




    });

});


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



