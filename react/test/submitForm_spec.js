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
            .execute(getScriptStr(prepare_script_path), [addBeverageForm]);
    });




    after(function() {
       // return driver.quit();
    });



    //
    //it('the server is correctly set up', function () {
    //    return driver.title().should.become("A test bed page for our Order Passive view");
    //});

    function willSubmitForm(example) {
        var beverage = '';
        var quantity = '';
    }





})