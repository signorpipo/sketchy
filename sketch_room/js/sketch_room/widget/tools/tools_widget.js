class ToolsWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myAdditionalSetup = null;
        this._mySetup = new ToolsWidgetSetup();
        this._myUI = new ToolsWidgetUI();

        this._myIsVisible = false;

        this._myPositionHover = false;
        this._myRotationHover = false;

        this._myTempPositionSnap = 0;
        this._myTempRotationSnap = 0;
    }

    setSelectedShape(shape) {
    }

    setSelectedTool(toolType) {
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
        if (visible) {
            this._refreshToolsData();
        }
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._addListeners();

        this._refreshToolsData();
    }

    isUsingThumbstick() {
        return this._myPositionHover || this._myRotationHover;
    }

    update(dt) {
        if (this._myIsVisible) {
            this._updateGamepad(dt);
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
            if (this._myPositionHover) {
                let amountToAdd = intensity * this._mySetup.myModifyPositionThumbstickStepPerSecond * dt;

                this._myTempPositionSnap = Math.max(0.005, this._myTempPositionSnap + amountToAdd);
                let positionSnap = Math.round(this._myTempPositionSnap / 0.005) * 0.005;

                this._myToolSettings.mySnapSettings.myPositionSnap[0] = positionSnap;
                this._myToolSettings.mySnapSettings.myPositionSnap[1] = positionSnap;
                this._myToolSettings.mySnapSettings.myPositionSnap[2] = positionSnap;

                this._myToolSettings.mySnapSettings.myScaleSnap[0] = positionSnap;
                this._myToolSettings.mySnapSettings.myScaleSnap[1] = positionSnap;
                this._myToolSettings.mySnapSettings.myScaleSnap[2] = positionSnap; 9
            }

            if (this._myRotationHover) {
                let amountToAdd = intensity * this._mySetup.myModifyRotationThumbstickStepPerSecond * dt;

                this._myTempRotationSnap = PP.MathUtils.clamp(this._myTempRotationSnap + amountToAdd, 1, 90);
                let rotationSnap = PP.MathUtils.toRadians(Math.round(this._myTempRotationSnap));
                this._myToolSettings.mySnapSettings.myRotationSnap[0] = rotationSnap;
                this._myToolSettings.mySnapSettings.myRotationSnap[1] = rotationSnap;
                this._myToolSettings.mySnapSettings.myRotationSnap[2] = rotationSnap;
            }

            this._refreshToolsData();
        }
    }

    _refreshToolsData() {
        this._myUI.myPositionValueTextComponent.text = this._myToolSettings.mySnapSettings.myPositionSnap[0].toFixed(3);
        this._myUI.myRotationValueTextComponent.text = Math.round(PP.MathUtils.toDegrees(this._myToolSettings.mySnapSettings.myRotationSnap[0])).toFixed(0);

        for (let i = 0; i < this._myUI.myColorButtonsSelectedBackgrounds.length; i++) {
            this._myUI.myColorButtonsSelectedBackgrounds[i].scale([0, 0, 0]);
        }

        let colorIndex = this._mySetup.myColors.findIndex(function (value) { return glMatrix.vec4.equals(value, this._myToolSettings.myCreateSettings.myColor); }.bind(this));
        if (colorIndex >= 0) {
            this._myUI.myColorButtonsSelectedBackgrounds[colorIndex].resetScaling();
            this._myUI.myColorButtonsSelectedBackgrounds[colorIndex].scale(this._mySetup.myColorSelectedBackgroundScale);
        }
    }

    _addListeners() {
        this._myUI.myPositionValueCursorTargetComponent.addHoverFunction(this._positionHover.bind(this));
        this._myUI.myPositionValueCursorTargetComponent.addUnHoverFunction(this._positionUnHover.bind(this));
        this._myUI.myRotationValueCursorTargetComponent.addHoverFunction(this._rotationHover.bind(this));
        this._myUI.myRotationValueCursorTargetComponent.addUnHoverFunction(this._rotationUnHover.bind(this));

        for (let i = 0; i < this._myUI.myColorButtonsCursorTargetComponents.length; i++) {
            this._myUI.myColorButtonsCursorTargetComponents[i].addClickFunction(this._changeColor.bind(this, i));
            this._myUI.myColorButtonsCursorTargetComponents[i].addHoverFunction(this._colorHover.bind(this, i));
            this._myUI.myColorButtonsCursorTargetComponents[i].addUnHoverFunction(this._colorUnHover.bind(this, i));
        }
    }

    _positionHover() {
        this._myPositionHover = true;
        this._snapHover(this._myUI.myPositionLabelTextComponent, this._myUI.myPositionValueTextComponent);

        this._myTempPositionSnap = this._myToolSettings.mySnapSettings.myPositionSnap[0];
    }

    _positionUnHover() {
        this._myPositionHover = false;
        this._snapUnHover(this._myUI.myPositionLabelTextComponent, this._myUI.myPositionValueTextComponent);
    }

    _rotationHover() {
        this._myRotationHover = true;
        this._snapHover(this._myUI.myRotationLabelTextComponent, this._myUI.myRotationValueTextComponent);

        this._myTempRotationSnap = PP.MathUtils.toDegrees(this._myToolSettings.mySnapSettings.myRotationSnap[0]);
    }

    _rotationUnHover() {
        this._myRotationHover = false;
        this._snapUnHover(this._myUI.myRotationLabelTextComponent, this._myUI.myRotationValueTextComponent);
    }

    _snapHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myHoverTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
        valueTextComponent.material.color = this._mySetup.myHoverTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
    }

    _snapUnHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myTextColor;
        valueTextComponent.material.color = this._mySetup.myTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
    }

    _changeColor(index) {
        let newColor = this._mySetup.myColors[index];
        this._myToolSettings.myCreateSettings.myColor = newColor;

        this._refreshToolsData();
    }

    _colorHover(index) {
        let material = this._myUI.myColorButtonsBackgroundComponents[index].material;
        let color = this._mySetup.myColors[index].slice(0);

        for (let i = 0; i < 3; ++i) {
            color[i] = Math.min(1, color[i] + (1 - color[i]) * 0.6);
        }

        material.color = color;
    }

    _colorUnHover(index) {
        let material = this._myUI.myColorButtonsBackgroundComponents[index].material;
        material.color = this._mySetup.myColors[index];
    }
}