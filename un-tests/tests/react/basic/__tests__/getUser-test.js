/**
 * @fileOverView getUser-test
 * @author zhangmeng on 16/1/16
 */

jest.dontMock('../src/getUser');

describe('getUser', function() {
    //test right params
    it('calls into $.ajax with the correct params', function() {
        var $ = require('jquery');
        var getUser = require('../src/getUser');
        function dummyCallback() {}
        getUser(dummyCallback);
        // Now make sure that $.ajax was properly called during the previous
        // 2 lines
        expect($.ajax).toBeCalledWith({
            type: 'GET',
            url: 'http://example.com/currentUser',
            success: jasmine.any(Function)
        });
    });

    //test callback function
    it('calls the callback when $.ajax requests are finished', function() {
        var $ = require('jquery');
        var getUser = require('../src/getUser');

        //create mock function
        var callback = jest.genMockFunction();
        getUser(callback);

        //xfunc.mock have interactions information
        //mock.calls.length call times
        //mock.calls[0][0] first param
        //mock.calls[0][1] second param
        //https://facebook.github.io/jest/docs/mock-functions.html

        //emulate the params pass to success
        $.ajax.mock.calls[0][0].success({
            firstName: 'Bobby',
            lastName: '");DROP TABLE Users;--'
        });

        expect(callback.mock.calls[0][0]).toEqual({
            loggedIn: true,
            fullName: 'Bobby ");DROP TABLE Users;--'
        });

    });
});
