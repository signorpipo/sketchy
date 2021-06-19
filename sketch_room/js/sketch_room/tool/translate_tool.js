class TranslateTool {
    constructor(toolSettings, wallSettings) {
        this._myToolSettings = toolSettings;
        this._myWallSettings = wallSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapePosition = [];
        this._myStartHandPosition = [];

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
            let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE];
            switch (axisLockType) {
                case AxisLockType.FREE:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE] = AxisLockType.LOCAL;
                    break;
                case AxisLockType.LOCAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE] = AxisLockType.GLOBAL;
                    break;
                case AxisLockType.GLOBAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE] = AxisLockType.FREE;
                    break;
                default:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE] = AxisLockType.LOCAL;
                    break;
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

        this._updateAxisLock(handPosition);

        let translation = [];
        glMatrix.vec3.subtract(translation, handPosition, this._myStartHandPosition);

        if (this._myClosestAxis) {
            translation = PP.MathUtils.getComponentAlongAxis(translation, this._myClosestAxis);
        }

        glMatrix.vec3.add(translation, translation, this._myStartShapePosition);
        this._mySelectedShape.setPosition(translation);

        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapeTransform = this._mySelectedShape.getTransform();
        this._myStartShapePosition = this._mySelectedShape.getPosition();

        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            this._myStartHandPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            this._myStartHandPosition = PlayerPose.myRightHandPosition.slice(0);
        }

        this._myClosestAxis = null;
        this._myKeepCurrentClosestAxis = false;
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _cancelWork() {
        this._mySelectedShape.setPosition(this._myStartShapePosition);
        this._myIsWorking = false;
    }

    _updateAxisLock(currentHandPosition) {
        if (this._myKeepCurrentClosestAxis) {
            return;
        }

        let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.TRANSLATE];

        this._myClosestAxis = null;

        if (axisLockType != AxisLockType.FREE) {
            let direction = [];
            glMatrix.vec3.subtract(direction, currentHandPosition, this._myStartHandPosition);
            let difference = glMatrix.vec3.length(direction);
            if (difference > 0.0001) {
                glMatrix.vec3.normalize(direction, direction);

                let referenceAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
                if (axisLockType == AxisLockType.LOCAL) {
                    referenceAxes = PP.MathUtils.getAxes(this._myStartShapeTransform);
                }

                let minAngle = Math.PI;
                for (let axis of referenceAxes) {
                    let angle = glMatrix.vec3.angle(axis, direction);
                    if (angle > Math.PI / 2) {
                        angle = Math.PI - angle; //close to axis, direction is not important
                    }

                    if (angle < minAngle) {
                        minAngle = angle;
                        this._myClosestAxis = axis;
                    }
                }

                if (difference > 0.025) {
                    this._myKeepCurrentClosestAxis = true;
                }
            }
        }
    }
}