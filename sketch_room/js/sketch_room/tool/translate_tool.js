class TranslateTool {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapePosition = [];
        this._myStartHandPosition = [];

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

        translation = ToolUtils.applyAxesTranslationSettings(translation, this._myToolSettings.myAxesSettings, this._myStartShapePosition);

        glMatrix.vec3.add(translation, translation, this._myStartShapePosition);
        this._mySelectedShape.setPosition(translation);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapePosition = this._mySelectedShape.getPosition();

        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            this._myStartHandPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            this._myStartHandPosition = PlayerPose.myRightHandPosition.slice(0);
        }
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setPosition(this._myStartShapePosition);
        this._myIsWorking = false;
    }
}