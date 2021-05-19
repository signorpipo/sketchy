WL.registerComponent('sync-hand-position', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myHandedness == 0) {
            this.object.getTranslationLocal(PlayerPose.myLeftHandPosition);
            PlayerPose.myLeftHandRotation = this.object.transformLocal.slice(0, 4);
        } else {
            this.object.getTranslationLocal(PlayerPose.myRightHandPosition);
            PlayerPose.myRightHandRotation = this.object.transformLocal.slice(0, 4);
        }
    },
});