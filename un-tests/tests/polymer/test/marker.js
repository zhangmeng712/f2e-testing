/**
 * @fileOverView marker basic test
 * @author zhangmeng on 16/1/9
 */

suite('markers default', function () {
    var map;
    setup(function () {
        map = document.querySelector('#map');
    });

    test('markers are initialized', function () {
        var markerEl = Polymer.dom(map).querySelector('google-map-marker');
        assert.isUndefined(markerEl.marker);
        assert.isUndefined(markerEl.map);
        assert.isNull(markerEl.info);
        assert.equal(markerEl.latitude, 37.779);
        assert.equal(markerEl.longitude, -122.3892);
    });

    test('markers are added to map', function () {
        map.addEventListener('google-map-ready', function () {
            var mapMarkerEl = Polymer.dom(map).querySelector('google-map-marker');
            var firstMarker = map.markers[0];
            expect(firstMarker).to.deep.equal(mapMarkerEl);
            assert.equal(map.markers.length, 3);
        });
    });

    test('markers position can be updated', function (done) {
        map.addEventListener('google-map-ready', function (e) {
            var markerEl = Polymer.dom(map).querySelector('google-map-marker');
            markerEl.latitude = 37.79493;
            markerEl.longitude = -122.41942;
            markerEl.zIndex = 1;
            assert.equal(markerEl.map, map.map, "marker's map is not the google-map's");
            //重新渲染 异步过程
            Polymer.dom.flush();
            async.nextTick(function () {
                var marker = markerEl.marker;
                assert.equal(marker.getPosition().lat(), markerEl.latitude);
                assert.equal(marker.getPosition().lng(), markerEl.longitude);
                assert.equal(marker.getZIndex(), markerEl.zIndex);
                done();
            });
        });
    });




});

//test 是否marker可以被删除 添加
//test('markers are added, removed', function (done) {
//    map.addEventListener('google-map-ready', function (e) {
//        // Check if marker children were setup and can be added/removed.
//        var marker = map.markers[0];
//        Polymer.dom((Polymer.dom(marker).parentNode)).removeChild(marker);
//        Polymer.dom.flush();
//        async.nextTick(function () {
//            // needed because map.updateMarkers has mutationObserver
//            assert.equal(map.markers.length, 2);
//            assert.isNull(
//                marker.marker.map, 'removed marker is still visible on map');
//            Polymer.dom(map).appendChild(marker);
//            Polymer.dom.flush();
//            async.nextTick(function () {
//                assert.isNotNull(
//                    marker.marker.map, 're-added marker is not visible.');
//                done();
//            });
//        });
//    });
//});



