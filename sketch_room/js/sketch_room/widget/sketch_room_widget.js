class SketchRoomWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;

        this._myWidgetFrame = new SketchWidgetFrame();
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));
        this._myWidgetFrame.registerWidgetChangedEventListener(this, this._widgetChanged.bind(this));

        this._myAdditionalSetup = null;

        this._myCurrentToolType = ToolType.NONE;

        this._myToolSelectedCallbacks = new Map();

        this._myWidgets = [];
        this._myCurrentWidgetType = SketchWidgetType.NONE;
    }

    setSelectedShape(shape) {
        for (let widget of this._myWidgets) {
            if (widget) {
                widget.setSelectedShape(shape);
            }
        }
    }

    setSelectedTool(toolType) {
        this._myCurrentToolType = toolType;
        for (let widget of this._myWidgets) {
            if (widget) {
                widget.setSelectedTool(toolType);
            }
        }
    }

    registerToolSelectedChangedEventListener(id, callback) {
        this._myToolSelectedCallbacks.set(id, callback);
    }

    unregisterToolSelectedChangedEventListener(id) {
        this._myToolSelectedCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myWidgetFrame.start(parentObject, additionalSetup);

        this._initializeWidgets(this._myWidgetFrame.getWidgetObject());
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        for (let widget of this._myWidgets) {
            if (widget) {
                widget.update(dt);
            }
        }

        if (!this._myWidgets[this._myCurrentWidgetType] || !this._myWidgets[this._myCurrentWidgetType].isUsingThumbstick()) {
            this._updateGamepadShortcuts(dt);
        }
    }

    _updateGamepadShortcuts(dt) {
        let rightAxesInfo = PP.RightGamepad.getAxesInfo();
        if (rightAxesInfo.myAxes[0] > 0.9) {
            this._toolSelected(ToolType.GRAB);
        } else if (rightAxesInfo.myAxes[0] < -0.9) {
            this._toolSelected(ToolType.TRANSLATE);
        } else if (rightAxesInfo.myAxes[1] < -0.9) {
            this._toolSelected(ToolType.ROTATE);
        } else if (rightAxesInfo.myAxes[1] > 0.9) {
            this._toolSelected(ToolType.SCALE);
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd()) {
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

    _widgetChanged(sketchWidgetType) {
        if (this._myWidgets[this._myCurrentWidgetType]) {
            this._myWidgets[this._myCurrentWidgetType].setVisible(false);
        }
        this._myCurrentWidgetType = sketchWidgetType;
        this._myWidgets[this._myCurrentWidgetType].setVisible(true);
    }

    _widgetVisibleChanged() {

    }

    _initializeWidgets(parentObject) {
        this._myWidgets[SketchWidgetType.SHAPE] = new ShapeWidget(this._myToolSettings);
        this._myWidgets[SketchWidgetType.TOOLS] = new ToolsWidget(this._myToolSettings);

        for (let widget of this._myWidgets) {
            if (widget) {
                widget.start(parentObject, this._myAdditionalSetup);
                widget.setVisible(false);
            }
        }
    }
}