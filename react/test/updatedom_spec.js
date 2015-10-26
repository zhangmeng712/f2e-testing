/**
 *
 */
var Setup = require('../helper/setup');
var Logger = require('../helper/logger');
var wd = require("wd");

var desired = Setup.desired;
var serverConfig = Setup.serverConfig || {};
var should = Setup.should;
var driver;
describe('An order-view updates the DOM', function () {
    before(function () {
        driver = wd.promiseChainRemote(serverConfig);
      //  Logger.configure(driver);//显示wd日志
        return driver.init(desired).setAsyncScriptTimeout(30000);
    });
    before(function () {
        return driver
            .get("http://localhost:3000/test/order.html")
            .execute('window.view=require("order-view")(".container");')
    });


    after(function() {
       return driver.quit();
    });

    /**
     * 测试用例
     * 1 总价是否正确
     * 2 items列表是否正常
     *   - 条数正常
     *   - name都正确
     *   - 单价都正确
     *   - 数量都正确
     * 3 form是否正常可以添加
     *   - Method方法
     *   - Action
     *   - shown参数
     *   - message
     *   - input是否正确
     *
     */
    function willUpdateTheDOM (example) {
        //植入example
        var viewModel = example.viewModel || {};
        var items = viewModel.items || [];
        var formModel = viewModel.addBeverageForm || {};


        describe('when update is called with ' + example.description, function () {
            beforeEach(function () {
                return driver.execute('window.view.update(arguments[0],arguments[1])', [viewModel])
            });
            //总价
            it('will update the DOM to show the total price', function () {
               var totalPrice = viewModel.totalPrice;
              return driver.waitForElementByCssSelector('.container .order .price').text().should.eventually.be.equal(totalPrice);
            });
            // 列表
            describe('will update the DOM to show the items', function () {
                it('there is one entry per each item', function () {
                        return driver.elementsByCssSelector('.container .order .item').should.eventually.have.length(viewModel.items.length);
                });
                //循环保证名字 数量 单价
                items.forEach(function (itemModel, i) {
                    var itemSelector = '.container .order .item:nth-of-type(' + (i + 1) + ')';
                    it('the DOM for item ' + i + ' shows the item name', function () {
                        return driver.elementByCssSelector(itemSelector + ' .name').text().should.eventually.be.equal(itemModel.name);
                    });
                    it('the DOM for item ' + i + ' shows the item quantity', function () {
                        return driver.elementByCssSelector(itemSelector + ' .quantity').text().should.eventually.be.equal(itemModel.quantity);
                    });

                    it('the DOM for item ' + i + ' shows the item price', function () {
                        return driver.elementByCssSelector(itemSelector + ' .price').text().should.eventually.be.equal(itemModel.unitPrice);
                    });

                })

            });
            //form
            describe('will update the DOM to show the add beverage action', function () {
                describe('it is a form', function () {
                    var _that = this;
                    beforeEach(function (done) {
                        return driver.elementByCssSelector('.container .order form.add-beverage').then(function (el) {
                            _that.form = el;
                            return done();
                        });
                    })
                    it('with a ' + formModel.method + ' method', function () {
                        return driver.getAttribute(_that.form, 'method').should.eventually.equal(formModel.method.toLowerCase());
                    });

                    it('with action set to ' + formModel.target, function () {
                        //查看的时候使用
                        //return driver.getAttribute(_that.form, 'action').then(function (text) {
                        //    console.log('er', text)//er http://localhost:3000/orders/items_2
                        //
                        //});
                        return driver.getAttribute(_that.form, 'action').should.eventually.match(new RegExp(formModel.target + '$'))
                    });

                    it('which is ' + (formModel.shown ? '' : 'not ') + 'visible', function () {
                        return driver.isDisplayed(_that.form).should.eventually.equal(formModel.shown);
                    });

                    if (formModel.shown) {
                        formModel.messages.forEach(function (msg, i) {
                            it('with an error message [' + msg + ']', function () {
                                return driver.elementByCssSelector('.error-msg:nth-of-type(' + (i + 1) + ')').text().should.eventually.equal(msg);
                            });
                        });
                    }
                    formModel.fields.forEach(function (fieldModel) {
                        describe('with a field named ' + fieldModel.name, function () {
                            var input;
                            beforeEach(function (done) {
                                return driver.elementByCssSelector('input[name="' + fieldModel.name + '"]').then(function (el) {
                                    input = el;
                                    return done();
                                })
                            })
                            it('that has type [' + fieldModel.type + ']', function () {
                                return driver.getAttribute(input, 'type').should.eventually.equal(fieldModel.type);
                            });

                            it('that has value [' + fieldModel.value + ']', function () {
                                return driver.getValue(input).should.eventually.equal(fieldModel.value);
                            });

                            it('that is ' + (fieldModel.error ? '' : 'not ') + 'highlighted as error', function () {
                                if (fieldModel.error) {
                                    return driver.getAttribute(input, 'class').should.eventually.include('error');
                                } else {
                                    return driver.getAttribute(input, 'class').should.eventually.not.include('error');
                                }
                            });

                            it('that is ' + (formModel.enabled ? 'enabled' : 'disabled'), function () {
                                return driver.execute('var inputEl = arguments[0];return inputEl.disabled;',[input]).should.eventually.equal(!formModel.enabled);
                            });
                        });
                    });
                });
            });
        });
    }

    //测试demo用例
    [
        {
            description: 'an order with 3 items',
            viewModel: {
                totalPrice: '12.34 $',
                items: [
                    {name: 'Expresso', quantity: '2', unitPrice: '2.33 $'},
                    {name: 'Mocaccino', quantity: '3', unitPrice: '1.45 $'},
                    {name: 'Latte', quantity: '1', unitPrice: '2.00 $'}
                ],
                addBeverageForm: {
                    target: '/orders/items_3',
                    method: 'POST',
                    enabled: true,
                    shown: true,
                    fields: [
                        {name: '__method', type: 'hidden', value: 'PUT'},
                        {name: 'beverage', type: 'text', value: '', error: true},
                        {name: 'quantity', type: 'text', value: '1', error: false},
                        {name: 'addToOrder', type: 'submit', value: 'Add to order'}
                    ],
                    messages: ['name of the beverage is required']
                }
            }
        }
        ,
        {
            description: 'an order with 1 item',
            viewModel: {
                totalPrice: '15.46 $',
                items: [
                    {name: 'Kaffee', quantity: '3', unitPrice: '5.43 $'},
                    {name: 'Latte', quantity: '5', unitPrice: '2.10 $'}
                ],
                addBeverageForm: {
                    target: '/orders/items_2',
                    method: 'POST',
                    enabled: false,
                    shown: true,
                    fields: [
                        {name: '__method', type: 'hidden', value: 'PUT'},
                        {name: 'beverage', type: 'text', value: 'Expresso'},
                        {name: 'quantity', type: 'text', value: '10'},
                        {name: 'addToOrder', type: 'submit', value: 'Add to order'}
                    ],
                    messages: []
                }
            }
        }
    ].forEach(willUpdateTheDOM);



});