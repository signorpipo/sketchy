WL.registerComponent('test-rotate', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        this.object.rotateAxisAngleDegObject([0, 1, 0], 1);
    },
});