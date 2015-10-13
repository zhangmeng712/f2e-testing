/**
 * @fileOverView mocha-chai-demo
 * @author zhangmeng on 15/10/12
 */

var chai = require('chai');
var expect = chai.expect;

var Person = function (name) {
    this.name = name;
};

var zhangmeng = new Person('zhangmeng');

describe('zhangmeng attribute', function () {
    it ('zhangmeng should be a person ', function () {
        expect(zhangmeng).to.be.an.instanceof(Person);
    })
});



