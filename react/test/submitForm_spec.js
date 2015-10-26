/**
 * 测试order-view能够正确的提交填写的参数
 */
var Setup = require('../helper/setup');
var Logger = require('../helper/logger');
var wd = require("wd");

var desired = Setup.desired;
var serverConfig = Setup.serverConfig || {};
var should = Setup.should;
var driver;
var Q = wd.Q;


var getScriptStr = function (path) {
    var fs = require('fs');
    var script = fs.readFileSync(path, 'utf-8');
    return script.replace(/[\r\n]/g,'').trim(); //// Android doesn't like cariage return
}

describe('order-view can ends ans "add beverage" request to the controller', function () {
    before (function () {
       driver = wd.promiseChainRemote(serverConfig);
       return driver
           .init(desired)
           .setAsyncScriptTimeout(30000)
    });
    before(function () {
        var addBeverageForm = {
            target: '/orders/items_2',
            method: 'POST',
            enabled: true,
            shown: true,
            fields: [
                {name: '__method', type: 'hidden', value: 'PUT'},
                {name: 'beverage', type: 'text', value: ''},
                {name: 'quantity', type: 'text', value: ''},
                {name: 'addToOrder', type: 'submit', value: 'Add to order'}
            ],
            messages: []
        };
        var prepare_script_path = __dirname + '/../helper/script/prepare_form.js';
        //Logger.configure(driver);//显示wd日志
        return driver
            .get("http://localhost:3000/test/order.html")
            .executeAsync(getScriptStr(prepare_script_path), [addBeverageForm]);
    });

    after(function() {
        return driver.quit();
    });


    function willSubmitForm(example) {
        var enteredBeverage = example.input.beverage,
            enteredQuantity = example.input.quantity;
        describe('given that the user has entered ' + example.title, function () {
            var expectedRequest = {
                beverage: enteredBeverage,
                quantity: enteredQuantity,
                target: '/orders/items_2',
                method: 'PUT'
            };
            beforeEach(function () {
                return driver.waitForElementByCssSelector('.container .order form.add-beverage input[name="beverage"]').sendKeys(enteredBeverage).waitForElementByCssSelector('.container .order form.add-beverage input[name="quantity"]').sendKeys(enteredQuantity);
            });
            afterEach(function () {
                return driver.elementByCss('.container .order form.add-beverage input[name="beverage"]').clear().elementByCss('.container .order form.add-beverage input[name="quantity"]').clear().execute('controller.addBeverage.reset();');
            });

            it('when the user clicks the "add to order" button, ' +
            'an addBeverage request will be sent to the order with "' + example.title + '"', function () {
               return driver.waitForElementByCssSelector('.container .order form.add-beverage input[name="addToOrder"]').click().execute('expect(controller.addBeverage).to.have.been.calledWith(arguments[0]);',[expectedRequest])
            });


            ['beverage', 'quantity'].forEach(function (fieldName) {
                it('when the user press ENTER in the "' + fieldName + '" input, ' +
                'an addBeverage request will be sent to the order with "' + example.title + '"', function () {
                    return driver.waitForElementByCssSelector('.container .order form.add-beverage input[name="' + fieldName + '"]')
                                 .sendKeys(wd.SPECIAL_KEYS.Enter)
                                 .execute('expect(controller.addBeverage).to.have.been.calledWith(arguments[0]);',[expectedRequest])
                });
            });

        });
    }

    [
        {
            title: '2 Capuccinos',
            input: {
                beverage: 'Cappuccino',
                quantity: '2'
            }
        }
        ,
        {
            title: '12 Expressos',
            input: {
                beverage: 'Expresso',
                quantity: '12'
            }
        },
        {
            title: 'nothing',
            input: {
                beverage: ' ',
                quantity: ' '
            }
        }
    ].forEach(willSubmitForm);



});