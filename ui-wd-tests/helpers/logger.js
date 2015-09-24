/**
 * @fileOverView logger
 * 蓝绿色driver状态
 * Driving the web on session: 861e4811-b292-4dc2-a831-d8fd968b4d74
 * Ending your web drivage..
   黄色 wd命令 CALL RESPONSE
   粉色：http请求
 * @author zhangmeng on 15/6/29
 */
"use strict";
exports.configure = function (driver) {
    // See whats going on
    driver.on('status', function (info) {
        console.log(info.cyan);
    });
    driver.on('command', function (meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
    });
    driver.on('http', function (meth, path, data) {
        console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
};
