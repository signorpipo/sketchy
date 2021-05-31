class CurrentToolWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myAdditionalSetup = null;
        this._mySetup = new CurrentToolWidgetSetup();
        this._myUI = new CurrentToolWidgetUI();

        this._myIsVisible = false;

        this._myCurrentToolType = ToolType.NONE;
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
        let toolName = "";

        switch (this._myCurrentToolType) {
            case ToolType.GRAB:
                toolName = "Grab";
                break;
            case ToolType.TRANSLATE:
                toolName = "Move";
                break;
            case ToolType.ROTATE:
                toolName = "Rotate";
                break;
            case ToolType.SCALE:
                toolName = "Scale";
                break;
            case ToolType.CREATE:
                toolName = "Create";
                break;
            default:
                toolName = "Error";
                break;
        }

        this._myUI.myCurrentToolTextComponent.text = toolName;

        let axisLockType = "Free";

        this._myUI.myAxisLockTextComponent.text = this._mySetup.myAxisLockText.concat(axisLockType);
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