'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'OrderItem',
  render: function () {
    return (
        <tr className="item">
          <td className="name">{this.props.name}</td>
          <td className="quantity">{this.props.quantity}</td>
          <td className="price">{this.props.unitPrice}</td>
        </tr>
    );
  }
});