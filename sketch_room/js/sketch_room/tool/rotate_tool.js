class RotateTool {
    constructor(toolSettings, wallSettings) {
        this._myToolSettings = toolSettings;
        this._myWallSettings = wallSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapeRotation = [];
        this._myStartHandRotation = [];
        this._myStartHandRotationInverse = [];

        this._myIsWorking = false;
        this._myCurrentHandedness = PP.HandednessIndex.NONE;

        this._myClosestAxis = null;
        this._myKeepCurrentClosestAxis = false;
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

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE];
            switch (axisLockType) {
                case AxisLockType.FREE:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE] = AxisLockType.LOCAL;
                    break;
                case AxisLockType.LOCAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE] = AxisLockType.GLOBAL;
                    break;
                case AxisLockType.GLOBAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE] = AxisLockType.FREE;
                    break;
                default:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE] = AxisLockType.LOCAL;
                    break;
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

        this._updateAxisLock(handRotation);

        let rotation = [];
        glMatrix.quat.mul(rotation, handRotation, this._myStartHandRotationInverse);

        if (this._myClosestAxis) {
            let rotationAxis = [];
            let rotationAngle = glMatrix.quat.getAxisAngle(rotationAxis, rotation);
            if (isNaN(rotationAngle)) {
                rotationAngle = 0;
            }

            glMatrix.vec3.scale(rotationAxis, rotationAxis, rotationAngle);
            rotationAxis = PP.MathUtils.getComponentAlongAxis(rotationAxis, this._myClosestAxis);

            rotationAngle = glMatrix.vec3.length(rotationAxis);
            if (rotationAngle > 0.0001) {
                glMatrix.vec3.normalize(rotationAxis, rotationAxis);
            } else {
                rotationAngle = 0;
                rotationAxis = this._myClosestAxis; // rotationAxis is [0,0,0]
            }

            glMatrix.quat.setAxisAngle(rotation, rotationAxis, rotationAngle);
        }

        glMatrix.quat.mul(rotation, rotation, this._myStartShapeRotation);
        glMatrix.quat.normalize(rotation, rotation);

        this._mySelectedShape.setRotation(rotation);

        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
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

        this._myClosestAxis = null;
        this._myKeepCurrentClosestAxis = false;
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _cancelWork() {
        this._mySelectedShape.setRotation(this._myStartShapeRotation);
        this._myIsWorking = false;
    }

    _updateAxisLock(currentHandRotation) {
        if (this._myKeepCurrentClosestAxis) {
            return;
        }

        let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE];

        this._myClosestAxis = null;

        if (axisLockType != AxisLockType.FREE) {

            let rotation = [];
            glMatrix.quat.mul(rotation, currentHandRotation, this._myStartHandRotationInverse);
            let rotationAxis = [];
            let rotationAngle = glMatrix.quat.getAxisAngle(rotationAxis, rotation);

            if (!isNaN(rotationAngle) && rotationAngle > 0.0001) {
                let referenceAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
                if (axisLockType == AxisLockType.LOCAL) {
                    referenceAxes = PP.MathUtils.getAxes(this._myStartShapeTransform);
                }

                let minAngle = Math.PI;
                for (let axis of referenceAxes) {
                    let angle = glMatrix.vec3.angle(axis, rotationAxis);
                    if (angle > Math.PI / 2) {
                        angle = Math.PI - angle; //close to axis, direction is not important
                    }

                    if (angle < minAngle) {
                        minAngle = angle;
                        this._myClosestAxis = axis;
                    }
                }

                if (rotationAngle > PP.MathUtils.toRadians(5)) {
                    this._myKeepCurrentClosestAxis = true;
                }
            }
        }
    }
}