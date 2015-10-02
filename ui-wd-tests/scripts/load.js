/**
 * @fileOverView load.js
 * @author zhangmeng on 15/9/29
 */
var loadScript = function (scriptUrl, callback) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    var done = false;
    script.onload = script.onreadystatechange = (function() {
        if (!done && (!this.readyState || this.readyState == 'loaded'
            || this.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
            callback();
        }
    });
    script.src = scriptUrl;
    head.appendChild(script);
  //  callback();
};
loadScript = loadScript(arguments[0], arguments[arguments.length - 1]);
//loadScript('//cdn.bootcss.com/jquery/2.1.4/jquery.js');
//loadScript('//g.alicdn.com/kissy/k/1.4.8/seed-min.js');
