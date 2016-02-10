/**
 * @fileOverView sum-test
 * @author zhangmeng on 16/1/15
 */
//sum为不需要mock的目标模块
jest.dontMock('../src/sum');

describe('sum', function() {
    it('adds 1 + 2 to equal 3', function() {
        var sum = require('../src/sum');
        expect(sum(1, 2)).toBe(3);
    });
});