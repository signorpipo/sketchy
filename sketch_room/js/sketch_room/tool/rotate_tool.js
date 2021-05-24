class RotateTool {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapeRotation = [];
        this._myStartHandRotation = [];
        this._myStartHandRotationInverse = [];

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
        let handRotation = null;
        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            handRotation = PlayerPose.myLeftHandRotation.slice(0);
        } else {
            handRotation = PlayerPose.myRightHandRotation.slice(0);
        }

        let rotation = [];
        glMatrix.quat.mul(rotation, handRotation, this._myStartHandRotationInverse);

        glMatrix.quat.mul(rotation, rotation, this._myStartShapeRotation);
        glMatrix.quat.normalize(rotation, rotation);

        this._mySelectedShape.setRotation(rotation);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapeTransform = this._mySelectedShape.getTransform();
        this._myStartShapeRotation = this._mySelectedShape.getRotation();

        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            this._myStartHandRotation = PlayerPose.myLeftHandRotation.slice(0);
        } else {
            this._myStartHandRotation = PlayerPose.myRightHandRotation.slice(0);
        }
        glMatrix.quat.conjugate(this._myStartHandRotationInverse, this._myStartHandRotation);
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setRotation(this._myStartShapeRotation);
        this._myIsWorking = false;
    }
}