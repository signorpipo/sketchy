class GrabTool {
    constructor(toolSettings, wallSettings) {
        this._myToolSettings = toolSettings;
        this._myWallSettings = wallSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myIsWorking = false;

        this._myStartShapeTransform = [];
        this._myLocalGrabTransform = [];
        this._myCurrentHandedness = PP.HandednessIndex.NONE;
    }

    setSelectedShape(object) {
        if (this._mySelectedShape != object) {
            if (this._myIsWorking) {
                this._cancelWork();
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
            if (!this._myIsWorking && this._mySelectedShape && this._mySelectedShape.getType() != ShapeType.WALL) {
                this._startWork(PP.HandednessIndex.LEFT);
            } else if (this._myIsWorking) {
                this._cancelWork();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            if (!this._myIsWorking && this._mySelectedShape && this._mySelectedShape.getType() != ShapeType.WALL) {
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
        let handTransform = null;
        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            handTransform = PlayerPose.myLeftHandTransform.slice(0);
        } else {
            handTransform = PlayerPose.myRightHandTransform.slice(0);
        }

        let newTransform = [];
        glMatrix.quat2.mul(newTransform, handTransform, this._myLocalGrabTransform);
        let newPosition = [];
        glMatrix.quat2.getTranslation(newPosition, newTransform);
        let newRotation = PP.MathUtils.quaternionToEuler(newTransform);

        let startPosition = [];
        glMatrix.quat2.getTranslation(startPosition, this._myStartShapeTransform);
        let startRotation = PP.MathUtils.quaternionToEuler(this._myStartShapeTransform);

        let translation = [];
        glMatrix.vec3.subtract(translation, newPosition, startPosition);

        let rotation = [];
        glMatrix.vec3.subtract(rotation, newRotation, startRotation);

        glMatrix.vec3.add(newPosition, startPosition, translation);
        glMatrix.vec3.add(newRotation, rotation, startRotation);
        newRotation = PP.MathUtils.eulerToQuaternion(newRotation);

        glMatrix.quat2.fromRotationTranslation(newTransform, newRotation, newPosition);

        this._mySelectedShape.setTransform(newTransform);
        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapeTransform = this._mySelectedShape.getTransform();

        let handTransform = null;
        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            handTransform = PlayerPose.myLeftHandTransform.slice(0);
        } else {
            handTransform = PlayerPose.myRightHandTransform.slice(0);
        }

        //get local transform to the hand
        glMatrix.quat2.conjugate(handTransform, handTransform);
        glMatrix.quat2.mul(this._myLocalGrabTransform, handTransform, this._myStartShapeTransform);
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _cancelWork() {
        this._mySelectedShape.setTransform(this._myStartShapeTransform);
        this._myIsWorking = false;
    }
}