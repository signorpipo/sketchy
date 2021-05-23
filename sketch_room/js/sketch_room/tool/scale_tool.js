class ScaleTool {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapeScale = [];
        this._myStartShapePosition = [];
        this._myStartHandPosition = [];

        this._myScaleReferenceAxis = [];

        this._myIsWorking = false;
        this._myCurrentHandedness = PP.HandednessIndex.NONE;
    }

    setSelectedShape(object) {
        if (this._mySelectedShape != object) {
            if (this._myIsWorking) {
                this._stopWork();
            }
        }
        this._mySelectedShape = object;
    }

    isEnabled() {
        return this._myIsEnabled;
    }

    setEnabled(enabled) {
        if (this._myIsEnabled != enabled && !enabled && this._myIsWorking) {
            this._stopWork();
        }
        this._myIsEnabled = enabled;
    }

    start() {
    }

    update(dt) {
        if (!this._myIsEnabled) {
            return;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            if (!this._myIsWorking && this._mySelectedShape) {
                this._startWork(PP.HandednessIndex.LEFT);
            } else if (this._myIsWorking) {
                this._cancelWork();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            if (!this._myIsWorking && this._mySelectedShape) {
                this._startWork(PP.HandednessIndex.RIGHT);
            } else if (this._myIsWorking) {
                this._cancelWork();
            }
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd() || PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myIsWorking) {
                this._stopWork();
            }
        }

        if (this._myIsWorking) {
            this._updateWork(dt);
        }
    }

    _updateWork(dt) {
        let handPosition = null;
        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            handPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            handPosition = PlayerPose.myRightHandPosition.slice(0);
        }

        let translation = [];
        glMatrix.vec3.subtract(translation, handPosition, this._myStartHandPosition);
        let rawScale = PP.MathUtils.getComponentAlongAxis(translation, this._myScaleReferenceAxis);
        let scaleAmount = glMatrix.vec3.length(rawScale) * (PP.MathUtils.isConcordant(rawScale, this._myScaleReferenceAxis) ? 1 : -1);

        let scaleToApply = [scaleAmount, scaleAmount, scaleAmount];
        scaleToApply = ToolUtils.applyAxesScaleSettings(scaleToApply, this._myToolSettings.myAxesSettings, this._myStartShapeTransform);
        glMatrix.vec3.add(scaleToApply, this._myStartShapeScale, scaleToApply);
        scaleToApply = scaleToApply.map(function (value) { return Math.max(value, 0.01); });

        this._mySelectedShape.setScale(scaleToApply);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapeTransform = this._mySelectedShape.getTransform();
        this._myStartShapeScale = this._mySelectedShape.getScale();
        this._myStartShapePosition = this._mySelectedShape.getPosition();

        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            this._myStartHandPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            this._myStartHandPosition = PlayerPose.myRightHandPosition.slice(0);
        }

        glMatrix.vec3.subtract(this._myScaleReferenceAxis, this._myStartHandPosition, this._myStartShapePosition);
        glMatrix.vec3.normalize(this._myScaleReferenceAxis, this._myScaleReferenceAxis);
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
        let scale = this._mySelectedShape.getScale();
        scale = scale.map(function (value) { return Math.max(value, 0.01); });
        this._mySelectedShape.setScale(scale);
    }

    _cancelWork() {
        this._mySelectedShape.setScale(this._myStartShapeScale);
        this._myIsWorking = false;
    }
}