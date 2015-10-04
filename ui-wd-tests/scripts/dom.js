Fn = {};
var appendChild = setTimeout(function() {
    $("#i_am_an_id").append('<div class="child">I am the child</div>')
}, arguments[0]);


var removeChildren = function () {
    $("#i_am_an_id").empty();
};


var appendKISSYNode = function () {
    //KISSY.use('node', function (S, Node) {
    //    var $ = Node.all;
    //    $("#i_am_an_id").append('<div class="child">I am the child</div>');
    //});
    var $ = KISSY.Node.all;
    $("#i_am_an_id").append('<div class="child">I am the child</div>');
};


Fn = {
    appendChild: appendChild,
    removeChildren: removeChildren,
    appendKISSYNode: appendKISSYNode
};

window.Fn = Fn;
