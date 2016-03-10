/**
 * @fileOverView start
 * @author zhangmeng on 16/2/12
 */
describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://juliemr.github.io/protractor-demo/');
        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});