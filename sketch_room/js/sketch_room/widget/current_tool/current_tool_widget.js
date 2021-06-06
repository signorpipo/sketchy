class CurrentToolWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myAdditionalSetup = null;
        this._mySetup = new CurrentToolWidgetSetup();
        this._myUI = new CurrentToolWidgetUI();

        this._myIsVisible = false;

        this._myCurrentToolType = ToolType.NONE;

        this._myLastToolType = null;
        this._myLastAxisLockType = null;
    }

    setSelectedShape(shape) {
    }

    setSelectedTool(toolType) {
        this._myCurrentToolType = toolType;
        this._refreshUI();
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
        if (visible) {
            this._refreshUI();
        }
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);

        this._refreshUI();
    }

    update(dt) {
        if (this._myIsVisible) {
            this._refreshUI();
        }
    }

    _refreshUI() {
        if (this._myLastToolType && this._myLastToolType == this._myCurrentToolType && this._myLastAxisLockType == this._myToolSettings.myAxisLockSettings.myAxisLockType[this._myCurrentToolType]) {
            return;
        }

        let toolName = "";
        let hasAxisLock = false;

        switch (this._myCurrentToolType) {
            case ToolType.GRAB:
                toolName = "Grab";
                hasAxisLock = true;
                break;
            case ToolType.TRANSLATE:
                toolName = "Move";
                hasAxisLock = true;
                break;
            case ToolType.ROTATE:
                toolName = "Rotate";
                hasAxisLock = true;
                break;
            case ToolType.SCALE:
                toolName = "Scale";
                hasAxisLock = true;
                break;
            case ToolType.CREATE:
                toolName = "Create";
                break;
            default:
                toolName = "Error";
                break;
        }
        this._myUI.myCurrentToolTextComponent.text = toolName;

        if (hasAxisLock) {
            let axisLockType = "";

            switch (this._myToolSettings.myAxisLockSettings.myAxisLockType[this._myCurrentToolType]) {
                case AxisLockType.FREE:
                    axisLockType = "Free";
                    hasAxisLock = true;
                    break;
                case AxisLockType.LOCAL:
                    axisLockType = "Local";
                    hasAxisLock = true;
                    break;
                case AxisLockType.GLOBAL:
                    axisLockType = "Global";
                    break;
                default:
                    axisLockType = "Error";
                    break;
            }

            this._myUI.myAxisLockTextComponent.text = this._mySetup.myAxisLockText.concat(axisLockType);
        } else {
            this._myUI.myAxisLockTextComponent.text = "";
        }

        this._myLastToolType = this._myCurrentToolType;
        this._myLastAxisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[this._myCurrentToolType];
    }
}

var ToolType = {
    NONE: 0,
    GRAB: 1,
    TRANSLATE: 2,
    ROTATE: 3,
    SCALE: 4,
    CREATE: 5,
    SELECT: 6
};