'use strict';

var React = require('react'),
    OrderItem = require('./orderItem.jsx'),
    Form = require('./form.jsx');

module.exports = React.createClass({
  displayName: 'Order',
  getDefaultProps: function () {
    return {
      totalPrice: '0 $',
      items: []
    }
  },
  render: function () {
    return (
        <div className="order">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit price</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Total price:</td>
                <td colSpan="2" className="price">{this.props.totalPrice}</td>
              </tr>
            </tfoot>
            <tbody>
                {this.props.items.map(function (itemProps) {
                  return (
                      <OrderItem
                          name={itemProps.name}
                          quantity={itemProps.quantity}
                          unitPrice={itemProps.unitPrice}/>
                  );
                })}
            </tbody>
          </table>
          <Form model={this.props.addBeverageForm}
              className="add-beverage"
              onSubmit={this.props.onAddBeverage}/>
        </div>
    );
  }
});