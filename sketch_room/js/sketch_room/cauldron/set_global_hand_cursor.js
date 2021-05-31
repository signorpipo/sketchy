WL.registerComponent('set-global-hand-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
        let cursor = this.object.getComponent("cursor");
        let cursorMaterial = cursor.cursorObject.getComponent("mesh").material.clone();
        cursor.cursorObject.getComponent("mesh").material = cursorMaterial;
        cursorMaterial.color = Colors[8];
        if (this._myHandedness == 0) {
            HandCursor.myLeftCursor = cursor;
        } else {
            HandCursor.myRightCursor = cursor;
        }
    },
    start: function () {
    },
    update: function (dt) {
    },
});