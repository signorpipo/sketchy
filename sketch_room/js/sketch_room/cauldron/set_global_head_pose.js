WL.registerComponent('set-global-head-pose', {
    _myEyeLeft: { type: WL.Type.Object, default: null },
    _myEyeRight: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        []
    },
    start: function () {
    },
    update: function (dt) {
        let eyeLeftPosition = [];
        this._myEyeLeft.getTranslationWorld(eyeLeftPosition);
        let eyeRightPosition = [];
        this._myEyeRight.getTranslationWorld(eyeRightPosition);

        let headPosition = [];
        glMatrix.vec3.add(headPosition, eyeLeftPosition, eyeRightPosition);
        glMatrix.vec3.scale(headPosition, headPosition, 0.5);

        let headRotation = this._myEyeLeft.transformWorld.slice(0, 4);

        PlayerPose.myHeadPosition = headPosition;
        PlayerPose.myHeadRotation = headRotation;
        glMatrix.quat2.fromRotationTranslation(PlayerPose.myHeadTransform, headRotation, headPosition);
    },
});