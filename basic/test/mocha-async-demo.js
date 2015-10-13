/**
 * @fileOverView mocha-async-demo
 * @author zhangmeng on 15/10/12
 */

//使用异步callback的方式

var fs = require('fs');
var fileName = '/opt/local/share/nginx/html/my-git/f2e-testing/basic/files/name.json';

var chai = require('chai');
var expect = chai.expect;
var Q = require('q');


//使用回调的方式测试

describe('file content validation through callback', function () {
    //读取文件内容
    var fileObj = {};
    before(function (done) {
        //async
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            fileObj = JSON.parse(data);
            done();
        });
    });

    it ('expect name to be zhangmeng', function () {
        var name = fileObj.name;
        expect(name).to.equal("zhangmeng");
    });

    it ('expect name to be zhangmeng', function () {
        var age = fileObj.age;
        expect(age).to.equal('29');
    });
});



//使用promise的方式例子
describe('file content validation through promise', function () {
    var fileObj = {};
    var readFilePromise = function(path, encoding) {
        var encoding = encoding || 'utf-8';
        var deferred = Q.defer();
        fs.readFile(path, encoding, function(err, text) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(text);
            }
        });
        return deferred.promise;
    };

    before('read name.json', function () {
        //return 支持promise的异步
        return readFilePromise(fileName).then(function(data) {
            try {
                fileObj = JSON.parse(data);
            } catch(err) {
                console.log(err);
            }
        })
    });

    it ('name should be zhangmeng', function () {
       var name = fileObj.name;
       expect(name).to.equal('zhangmeng');
    });

    it ('age should be 29', function () {
        var age = fileObj.age;
        expect(age).to.equal('29');
    });
});