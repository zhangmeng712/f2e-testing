/**
 * @fileOverView prepare_form.js
 * @author zhangmeng on 15/10/15
 */
var newOrderView = require('order-view'),
    addBeverageForm = arguments[0];

var cb = arguments[1];

window.controller = {
    addBeverage: sinon.spy()
};
newOrderView('.container', window.controller)
    .update({
        totalPrice: '0 $',
        items: [],
        addBeverageForm: addBeverageForm
    },cb);


