/**
 * @fileOverView load.js
 * @author zhangmeng on 15/9/29
 */

var loadScript = function (scriptUrl) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    var done = false;
    script.onload = script.onreadystatechange = (function() {
        if (!done && (!this.readyState || this.readyState == 'loaded'
            || this.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    });
    script.src = scriptUrl;
    head.appendChild(script);
};
loadScript('//cdn.bootcss.com/jquery/2.1.4/jquery.js');

