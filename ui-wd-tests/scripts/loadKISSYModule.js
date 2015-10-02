/**
 * @fileOverView loadKISSYModuel
 * @author zhangmeng on 15/10/2
 */

var loadKISSY = function (moduleNameArr, callback) {
    var moduleStr = moduleNameArr.join(',');
    KISSY.use(moduleStr, function () {
        callback();
    });
}

loadKISSY(arguments[0], arguments[arguments.length - 1])
