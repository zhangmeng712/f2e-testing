/**
 * @fileOverView setup.js
 * @author zhangmeng on 15/6/26
 */
require('colors');
var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
//使用方法 wd.transferPromiseness 使wd的promise拥有assertation的功能
// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
exports.should = should;
exports.serverConfig = {
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    path: '/wd/hub'
};
exports.desired = {browserName:'chrome'};

