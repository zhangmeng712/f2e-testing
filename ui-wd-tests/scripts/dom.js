Fn = {};
var appendChild = setTimeout(function() {
    $("#i_am_an_id").append('<div class="child">I am the child</div>')
}, arguments[0]);


var removeChildren = function () {
    $("#i_am_an_id").empty();
};

Fn = {
    appendChild: appendChild,
    removeChildren: removeChildren
};

window.Fn = Fn;
