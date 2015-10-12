/**
 * @fileOverView server.js 构建react的应用
 * @author zhangmeng on 15/10/9
 */
var express = require('express'),
    port = process.env.PORT || 3000,
    server,
    app = express(),
    browserify = require('browserify'),
    reactify = require('reactify'),
    bundles = {};

var wd = require('wd');
var Q = wd.Q;
function registerBundle(name, cb) {
    return function (err, buf) {
        if (err)
            return cb(err);
        bundles[name] = buf.toString();
        if (cb) cb();
    };
}

function bundleReact (cb) {
    var reactFileName = require.resolve('react/dist/react.js');
    browserify({
        noParse: [reactFileName]
    })
        .require(reactFileName, {expose: 'react'})
        .bundle(registerBundle('react', cb));
}

function bundleOrderView(cb) {
    var viewFileName = require.resolve(__dirname + '/src/order-view.jsx');
    browserify()
        .transform(reactify)
        .require(viewFileName, {expose: 'order-view'})
        .add(viewFileName)
        .exclude('react')
        .bundle(registerBundle('order-view', cb));
}

Q.all([
    bundleReact(),
    bundleOrderView()
]).then(function () {
    app.use(express.static(__dirname + '/test/..'));
    app.get('/dist/:bundleName.js', function (req, res) {
        var bundle = bundles[req.param('bundleName')];
        if (!bundle)
            return res.sendStatus(404);
        res.set('Content-Type', 'application/json');
        res.send(bundle);
    });
    app.listen(port, function () {
        server = this;
        console.log('server started')

    });

});



