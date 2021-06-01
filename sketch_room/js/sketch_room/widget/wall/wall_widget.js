class WallWidget {
    constructor(wallSettings) {
        this._myWallSettings = wallSettings;
        this._myAdditionalSetup = null;
        this._mySetup = new WallWidgetSetup();
        this._myUI = new WallWidgetUI();

        this._myIsVisible = false;

        this._myHeightHover = false;
        this._myWidthHover = false;
        this._myDepthHover = false;

        this._myTempHeight = 0;
        this._myTempWidth = 0;
        this._myTempDepth = 0;

        this._myExportCallbacks = new Map();
    }

    setSelectedShape(shape) {
    }

    setSelectedTool(toolType) {
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
        if (visible) {
            this._myUI.myExportResultTextComponent.text = "";
            this._refreshData();
        }
    }

    registerExportEventListener(id, callback) {
        this._myExportCallbacks.set(id, callback);
    }

    unregisterExportEventListener(id) {
        this._myExportCallbacks.delete(id);
    }

    isUsingThumbstick() {
        return this._myHeightHover || this._myWidthHover || this._myDepthHover;
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._addListeners();
    }

    update(dt) {
        if (this._myIsVisible) {
            this._updateGamepad(dt);
            this._refreshData();

            if (this._myResultTimer > 0) {
                this._myResultTimer -= dt;
                if (this._myResultTimer <= 0) {
                    this._myUI.myExportResultTextComponent.text = "";
                }
            }
        }
    }

    _updateGamepad(dt) {
        let intensity = 0;

        {
            let y = PP.RightGamepad.getAxesInfo().myAxes[1];

            if (Math.abs(y) > this._mySetup.myModifyThumbstickMinThreshold) {
                let normalizedModifyAmount = (Math.abs(y) - this._mySetup.myModifyThumbstickMinThreshold) / (1 - this._mySetup.myModifyThumbstickMinThreshold);
                intensity = Math.sign(y) * normalizedModifyAmount;
            }
        }

        if (intensity != 0) {
            let amountToAdd = intensity * this._mySetup.myModifyThumbstickStepPerSecond * dt;

            if (this._myHeightHover) {
                this._myTempHeight = Math.max(2, this._myTempHeight + amountToAdd);
                this._myWallSettings.myHeight = this._myTempHeight;
            }
            if (this._myWidthHover) {
                this._myTempWidth = Math.max(1, this._myTempWidth + amountToAdd);
                this._myWallSettings.myWidth = this._myTempWidth;
            }
            if (this._myDepthHover) {
                this._myTempDepth = Math.max(1, this._myTempDepth + amountToAdd);
                this._myWallSettings.myDepth = this._myTempDepth;
            }
            this._refreshData();
        } else if (this._myHeightHover || this._myWidthHover || this._myDepthHover) {
            this._myWallSettings.myHeight = Math.round(this._myWallSettings.myHeight / 0.1) * 0.1;
            this._myWallSettings.myWidth = Math.round(this._myWallSettings.myWidth / 0.1) * 0.1;
            this._myWallSettings.myDepth = Math.round(this._myWallSettings.myDepth / 0.1) * 0.1;
        }
    }

    _refreshData() {
        this._myUI.myHeightValueTextComponent.text = this._myWallSettings.myHeight.toFixed(3);
        this._myUI.myWidthValueTextComponent.text = this._myWallSettings.myWidth.toFixed(3);
        this._myUI.myDepthValueTextComponent.text = this._myWallSettings.myDepth.toFixed(3);
    }

    _addListeners() {
        this._myUI.myHeightValueCursorTargetComponent.addHoverFunction(this._heightHover.bind(this));
        this._myUI.myHeightValueCursorTargetComponent.addUnHoverFunction(this._heightUnHover.bind(this));
        this._myUI.myWidthValueCursorTargetComponent.addHoverFunction(this._widthHover.bind(this));
        this._myUI.myWidthValueCursorTargetComponent.addUnHoverFunction(this._widthUnHover.bind(this));
        this._myUI.myDepthValueCursorTargetComponent.addHoverFunction(this._depthHover.bind(this));
        this._myUI.myDepthValueCursorTargetComponent.addUnHoverFunction(this._depthUnHover.bind(this));

        this._myUI.myExportButtonCursorTargetComponent.addClickFunction(this._export.bind(this));
        this._myUI.myExportButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, this._myUI.myExportButtonBackgroundComponent.material));
        this._myUI.myExportButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, this._myUI.myExportButtonBackgroundComponent.material));
    }

    _export() {
        if (this._myIsVisible) {
            let result = "";
            for (let value of this._myExportCallbacks.values()) {
                result = result.concat(value()).concat("\n");
            }

            this._myUI.myExportResultTextComponent.text = result;
            this._myResultTimer = this._mySetup.myResultTimer;
        }
    }

    _heightHover() {
        this._myHeightHover = true;
        this._sizeHover(this._myUI.myHeightLabelTextComponent, this._myUI.myHeightValueTextComponent);

        this._myTempHeight = this._myWallSettings.myHeight;
    }

    _heightUnHover() {
        this._myHeightHover = false;
        this._sizeUnHover(this._myUI.myHeightLabelTextComponent, this._myUI.myHeightValueTextComponent);
    }

    _widthHover() {
        this._myWidthHover = true;
        this._sizeHover(this._myUI.myWidthLabelTextComponent, this._myUI.myWidthValueTextComponent);

        this._myTempWidth = this._myWallSettings.myWidth;
    }

    _widthUnHover() {
        this._myWidthHover = false;
        this._sizeUnHover(this._myUI.myWidthLabelTextComponent, this._myUI.myWidthValueTextComponent);
    }

    _depthHover() {
        this._myDepthHover = true;
        this._sizeHover(this._myUI.myDepthLabelTextComponent, this._myUI.myDepthValueTextComponent);

        this._myTempDepth = this._myWallSettings.myDepth;
    }

    _depthUnHover() {
        this._myDepthHover = false;
        this._sizeUnHover(this._myUI.myDepthLabelTextComponent, this._myUI.myDepthValueTextComponent);
    }

    _sizeHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myHoverTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
        valueTextComponent.material.color = this._mySetup.myHoverTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
    }

    _sizeUnHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myTextColor;
        valueTextComponent.material.color = this._mySetup.myTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myTextOutlineColor;

        this._myWallSettings.myHeight = Math.round(this._myWallSettings.myHeight / 0.1) * 0.1;
        this._myWallSettings.myWidth = Math.round(this._myWallSettings.myWidth / 0.1) * 0.1;
        this._myWallSettings.myDepth = Math.round(this._myWallSettings.myDepth / 0.1) * 0.1;
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }
}