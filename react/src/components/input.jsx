'use strict';
var React = require('react');

module.exports = React.createClass({
  displayName: 'Input',
  getDefaultProps: function () {
    return {
      model: {
        name: '',
        type: '',
        value: '',
        error: false,
        enabled: true
      }
    };
  },
  getInitialState: function () {
    return {
      value: this.props.model.value
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      value: nextProps.model.value
    });
  },
  handleChange: function (ev) {
    this.setState({
      value: ev.target.value
    });
  },
  render: function () {
    var model = this.props.model;
    return (
        <input name={model.name}
            type={model.type}
            value={this.state.value}
            className={model.error ? "error" : ""}
            disabled={!this.props.enabled}
            onChange={this.handleChange}/>
    );
  }
});