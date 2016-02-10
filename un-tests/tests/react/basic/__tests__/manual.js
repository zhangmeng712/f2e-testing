/**
 * @fileOverView Manual mocks
 * @author zhangmeng on 16/2/6
 */

describe('jest mocks', function () {
   it('jquery mock getEnv value', function(){
       var value = require('jquery').fx();
       expect(value).toEqual('mockValue')
   });
});

