WL.registerComponent('set-global-head-pose', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        PlayerPose.myHeadTransform = this.object.transformWorld.slice(0);
        this.object.getTranslationWorld(PlayerPose.myHeadPosition);
        PlayerPose.myHeadRotation = this.object.transformWorld.slice(0, 4);
    },
});