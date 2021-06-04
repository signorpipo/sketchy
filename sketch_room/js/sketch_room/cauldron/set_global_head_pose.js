WL.registerComponent('set-global-head-pose', {
    eyeLeft: { type: WL.Type.Object, default: null },
    eyeRight: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        []
    },
    start: function () {
    },
    update: function (dt) {
        let eyeLeftPosition = [];
        this.eyeLeft.getTranslationWorld(eyeLeftPosition);
        let eyeRightPosition = [];
        this.eyeRight.getTranslationWorld(eyeRightPosition);

        let headPosition = [];
        glMatrix.vec3.add(headPosition, eyeLeftPosition, eyeRightPosition);
        glMatrix.vec3.scale(headPosition, headPosition, 0.5);

        let headRotation = eyeLeft.transformWorld.slice(0, 4);

        PlayerPose.myHeadPosition = headPosition;
        PlayerPose.myHeadRotation = headRotation;
        glMatrix.quat2.fromRotationTranslation(PlayerPose.myHeadTransform, headRotation, headPosition);
    },
});