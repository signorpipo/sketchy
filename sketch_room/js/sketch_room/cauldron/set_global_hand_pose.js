WL.registerComponent('set-global-hand-pose', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
        if (this._myHandedness == 0) {
            PlayerPose.myLeftHandObject = this.object;
        } else {
            PlayerPose.myRightHandObject = this.object;
        }
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myHandedness == 0) {
            PlayerPose.myLeftHandTransform = this.object.transformWorld.slice(0);
            this.object.getTranslationWorld(PlayerPose.myLeftHandPosition);
            PlayerPose.myLeftHandRotation = this.object.transformWorld.slice(0, 4);
        } else {
            PlayerPose.myRightHandTransform = this.object.transformWorld.slice(0);
            this.object.getTranslationWorld(PlayerPose.myRightHandPosition);
            PlayerPose.myRightHandRotation = this.object.transformWorld.slice(0, 4);
        }
    },
});