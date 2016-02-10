/**
 * @fileOverView jquery.js
 * @author zhangmeng on 16/2/6
 */
var jqueryMocks = jest.genMockFromModule('jquery');
var mock_fx = function () {
    return 'mockValue';
};
//using mock_fx to mock the function of real fx
jqueryMocks.fx.mockImplementation(mock_fx);
module.exports = jqueryMocks;