class SketchRoomWidget {
    constructor() {
        this._myCurrentToolType = ToolType.NONE;

        this._myToolSelectedCallbacks = new Map();
    }

    selectTool(toolType) {
        this._myCurrentToolType = toolType;
        //update widgets and stuff
    }

    registerToolSelectedChangedEventListener(id, callback) {
        this._myToolSelectedCallbacks.set(id, callback);
    }

    unregisterToolSelectedChangedEventListener(id) {
        this._myToolSelectedCallbacks.delete(id);
    }

    start() {
        //create all sub widgets
        //manage visibility like easy tune
        //select current one
        //the widget has the tool manager so it can set the tool and the settings like snap and so on
    }

    update(dt) {
        this._updateGamepadShortcuts(dt);
    }

    _updateGamepadShortcuts(dt) {
        let rightAxesInfo = PP.RightGamepad.getAxesInfo();
        if (rightAxesInfo.myAxes[0] > 0.9) {
            this._toolSelected(ToolType.GRAB);
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            this._toolSelected(ToolType.CREATE);
        }
    }

    _toolSelected(toolType) {
        if (this._myCurrentToolType != toolType) {
            for (let value of this._myToolSelectedCallbacks.values()) {
                value(toolType);
            }
        }
    }
}