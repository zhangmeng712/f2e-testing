'use strict';

var React = require('react'),
    Input = require('./input.jsx');

module.exports = React.createClass({
  displayName: 'Form',
  getDefaultProps: function () {
    return {
      model: {
        method: 'GET',
        target: '',
        fields: [],
        enabled: true,
        shown: true,
        messages: []
      }
    };
  },
  handleSubmit: function (ev) {
    ev.preventDefault();

    if (typeof this.props.onSubmit === 'function') {
      var thisModel = this.props.model,
          formData = {
            target: thisModel.target,
            method: thisModel.method
          };

      thisModel.fields
          .filter(function (fieldModel) {
            var fieldType = fieldModel.type;
            return fieldType != 'submit' && fieldType != 'button';
          })
          .forEach(function (fieldModel) {
            var name = fieldModel.name,
                inputValue = this.refs[name].state.value;
            if (name === '__method')
              name = 'method';
            formData[name] = inputValue;
          }, this);
      this.props.onSubmit(formData);
    }
  },
  render: function () {
    var model = this.props.model;
    return (
        <form method={model.method}
            action={model.target} className={this.props.className}
            style={{display: model.shown ? "" : "none"}}
            onSubmit={this.handleSubmit}>
            {model.fields.map(function (fieldModel) {
              return (
                  <Input model={fieldModel}
                      enabled={model.enabled}
                      ref={fieldModel.name}/>
              );
            })}
            {model.messages.map(function (msg) {
              return (
                  <span className="error-msg">{msg}</span>
              );
            })}
        </form>
    );
  }
});