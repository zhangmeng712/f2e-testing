/**
 * @fileOverView monitor 手动启动
 * pkill -f selenium-standalone 手动kill
 * @author zhangmeng on 15/10/31
 */
var selenium = require('selenium-standalone');
selenium.start({
    seleniumArgs:['-port', '5555']
},function(err, child) {
    if (err) {
        console.log(err);
        return;
    }
    child.stderr.on('data', function(data){
        console.log(data.toString());
    });
});