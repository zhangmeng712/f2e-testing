/**
 * @fileOverView app
 * @author zhangmeng on 15/10/8
 */

var orderView = require('order-view');
var React = require('react');
var view = orderView('.container', {
    addBeverage: function () {
        console.log(arguments)
        console.log('this is addBaverage');//submit事件
    }
});
var items = [];
var totalPrice = '0 $';
var calCulateTotal = function (totalPrice, items) {
    return '12 $'
};
view.update({
    totalPrice: totalPrice,
    items: items,
    //现有item
    //form onSubmit事件
    //onAddBeverage: function () {
    //    //this指Form
    //    //从form中取得内容
    //    var beverage = $('input[name="beverage"]').val();
    //    var quantity = $('input[name="quantity"]').val();
    //    var unitPrice =  $('input[name="unitPrice"]').val();
    //    items.push({
    //        name: beverage,
    //        quantity: quantity,
    //        unitPrice: unitPrice
    //    });
    //    view.update({
    //        items: items,
    //        totalPrice: calCulateTotal(totalPrice)
    //    });
    //},
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
});
