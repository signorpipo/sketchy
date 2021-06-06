class ScaleTool {
    constructor(toolSettings, wallSettings) {
        this._myToolSettings = toolSettings;
        this._myWallSettings = wallSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapeScale = [];
        this._myStartShapePosition = [];
        this._myStartHandPosition = [];

        this._myScaleReferenceAxis = [];

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
            let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE];
            switch (axisLockType) {
                case AxisLockType.FREE:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE] = AxisLockType.LOCAL;
                    break;
                case AxisLockType.LOCAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE] = AxisLockType.GLOBAL;
                    break;
                case AxisLockType.GLOBAL:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE] = AxisLockType.FREE;
                    break;
                default:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE] = AxisLockType.LOCAL;
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

        let scaleToApply = [0, 0, 0];
        let handDirection = [];
        glMatrix.vec3.subtract(handDirection, handPosition, this._myStartHandPosition);

        if (this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE] != AxisLockType.FREE) {
            this._updateAxisLock(handPosition);
            let localClosestAxis = null;
            if (this._myClosestAxis) {
                this._myScaleReferenceAxis = PP.MathUtils.getComponentAlongAxis(this._myScaleReferenceAxis, this._myClosestAxis);
                if (glMatrix.vec3.length(this._myScaleReferenceAxis) < 0.001) {
                    this._myScaleReferenceAxis = this._myClosestAxis.slice(0);
                }
                glMatrix.vec3.normalize(this._myScaleReferenceAxis, this._myScaleReferenceAxis);

                localClosestAxis = this._getLocalClosestAxis();
            } else {
                glMatrix.vec3.subtract(this._myScaleReferenceAxis, this._myStartHandPosition, this._myStartShapePosition);
                glMatrix.vec3.normalize(this._myScaleReferenceAxis, this._myScaleReferenceAxis);
            }

            let rawScale = PP.MathUtils.getComponentAlongAxis(handDirection, this._myScaleReferenceAxis);
            let scaleAmount = glMatrix.vec3.length(rawScale) * (PP.MathUtils.isConcordant(rawScale, this._myScaleReferenceAxis) ? 1 : -1);

            scaleToApply = [scaleAmount, scaleAmount, scaleAmount];
            if (localClosestAxis) {
                scaleToApply = PP.MathUtils.getComponentAlongAxis(scaleToApply, localClosestAxis);
            }
        } else {
            let shapeAxes = PP.MathUtils.getAxes(this._myStartShapeTransform);

            let xComponent = PP.MathUtils.getComponentAlongAxis(handDirection, shapeAxes[0]);
            let xScaleReference = PP.MathUtils.getComponentAlongAxis(this._myScaleReferenceAxis, shapeAxes[0]);
            let xAmount = glMatrix.vec3.length(xComponent);
            if (!PP.MathUtils.isConcordant(xComponent, xScaleReference)) {
                xAmount = -xAmount;
            }

            let yComponent = PP.MathUtils.getComponentAlongAxis(handDirection, shapeAxes[1]);
            let yScaleReference = PP.MathUtils.getComponentAlongAxis(this._myScaleReferenceAxis, shapeAxes[1]);
            let yAmount = glMatrix.vec3.length(yComponent);
            if (!PP.MathUtils.isConcordant(yComponent, yScaleReference)) {
                yAmount = -yAmount;
            }

            let zComponent = PP.MathUtils.getComponentAlongAxis(handDirection, shapeAxes[2]);
            let zScaleReference = PP.MathUtils.getComponentAlongAxis(this._myScaleReferenceAxis, shapeAxes[2]);
            let zAmount = glMatrix.vec3.length(zComponent);
            if (!PP.MathUtils.isConcordant(zComponent, zScaleReference)) {
                zAmount = -zAmount;
            }

            scaleToApply = [xAmount, yAmount, zAmount];
        }

        glMatrix.vec3.add(scaleToApply, scaleToApply, this._myStartShapeScale);
        scaleToApply = scaleToApply.map(function (value) { return Math.max(value, 0.005); });

        this._mySelectedShape.setScale(scaleToApply);

        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
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

        this._myClosestAxis = null;
        this._myKeepCurrentClosestAxis = false;
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
        this._mySelectedShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);
    }

    _cancelWork() {
        this._mySelectedShape.setScale(this._myStartShapeScale);
        this._myIsWorking = false;
    }

    _updateAxisLock(currentHandPosition) {
        if (this._myKeepCurrentClosestAxis) {
            return;
        }

        let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.SCALE];

        this._myClosestAxis = null;

        if (axisLockType == AxisLockType.LOCAL) {
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

                if (difference > 0.05) {
                    this._myKeepCurrentClosestAxis = true;
                }
            }
        }
    }

    //fix the axis based on the rotation, the issue is that, for example, the first paramter of the scale is always the X no matter the rotation
    _getLocalClosestAxis() {
        let localClosestAxis = null;

        let closestAxisShapePosition = [];
        glMatrix.vec3.add(closestAxisShapePosition, this._myClosestAxis, this._myStartShapePosition);
        let closestAxisShapeTransform = [];
        glMatrix.quat2.fromTranslation(closestAxisShapeTransform, closestAxisShapePosition);

        let shapeTransformInverse = [];
        glMatrix.quat2.conjugate(shapeTransformInverse, this._myStartShapeTransform);
        let closestAxisLocalTransform = [];
        glMatrix.quat2.mul(closestAxisLocalTransform, shapeTransformInverse, closestAxisShapeTransform);

        let closestAxisLocalPosition = [];
        glMatrix.quat2.getTranslation(closestAxisLocalPosition, closestAxisLocalTransform);

        let referenceAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        let minAngle = Math.PI;
        for (let axis of referenceAxes) {
            let angle = glMatrix.vec3.angle(axis, closestAxisLocalPosition);
            if (angle > Math.PI / 2) {
                angle = Math.PI - angle; //close to axis, direction is not important
            }

            if (angle < minAngle) {
                minAngle = angle;
                localClosestAxis = axis;
                if (!PP.MathUtils.isConcordant(localClosestAxis, closestAxisLocalPosition)) {
                    glMatrix.vec3.scale(localClosestAxis, localClosestAxis, -1);
                }
            }
        }

        return localClosestAxis;
    }
}