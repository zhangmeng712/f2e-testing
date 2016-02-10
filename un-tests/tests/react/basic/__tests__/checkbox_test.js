/**
 * @fileOverView checkbox_test.js 测试react程序
 * @author zhangmeng on 16/1/27
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDom from  'react-dom';

jest.dontMock('../src/checkbox');

const Checkbox = require('../src/checkbox');

describe('test react checkbox component', () => {
    it('change the label after click', () => {
        //1 render component
        //2 get node label get default value off
        //3 simulate click
        //4 expect value equal on

        //TestUtils.renderIntoDocument method refers to https://facebook.github.io/react/docs/test-utils.html#renderintodocument
        //TestUtils.findRenderedDOMComponentWithTag https://facebook.github.io/react/docs/test-utils.html#findrendereddomcomponentwithtag
        //ReactDom API:findDOMNode render unmountComponentAtNode server-side:renderToString renderToStaticMarkup

        var checkbox = TestUtils.renderIntoDocument(<Checkbox labelOn="On" labelOff="Off" />);
        var checkboxNode = ReactDom.findDOMNode(checkbox);
        //https://facebook.github.io/jest/docs/api.html#expect-value
        expect(checkboxNode.textContent).toEqual('Off');
        TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input'));
        expect(checkboxNode.textContent).toEqual('On');
    });
});