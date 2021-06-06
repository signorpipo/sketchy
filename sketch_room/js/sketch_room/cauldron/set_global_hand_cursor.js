WL.registerComponent('set-global-hand-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
        let cursor = this.object.getComponent("fixed-cursor");
        this._myCursorMaterial = cursor.cursorObject.getComponent("mesh").material.clone();
        cursor.cursorObject.getComponent("mesh").material = this._myCursorMaterial;
        if (this._myHandedness == 0) {
            HandCursor.myLeftCursor = cursor;
        } else {
            HandCursor.myRightCursor = cursor;
        }

        this._myToolType = ToolType.NONE;
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myToolType != CurrentToolType) {
            this._myToolType = CurrentToolType;
            let color = [1, 1, 1, 1];

            switch (this._myToolType) {
                case ToolType.GRAB:
                    color = Colors[10];
                    break;
                case ToolType.TRANSLATE:
                    color = Colors[5];
                    break;
                case ToolType.ROTATE:
                    color = Colors[4];
                    break;
                case ToolType.SCALE:
                    color = Colors[15];
                    break;
                case ToolType.CREATE:
                    color = Colors[11];
                    break;
                default:
                    color = Colors[0];
                    break;
            }
            this._myCursorMaterial.color = color.slice(0);
        }
    },
});