class RotateTool {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapeRotation = [];
        this._myStartHandPosition = [];
        this._myStartShapeStartHandDirection = [];

        this._myIsWorking = false;
        this._myCurrentHandedness = PP.HandednessIndex.NONE;

        this._myClosestHandDirection = null;
        this._myClosestAxis = null;
        this._myKeepCurrentClosestAxis = false;
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
        let handPosition = null;
        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            handPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            handPosition = PlayerPose.myRightHandPosition.slice(0);
        }

        let rotationAxis = null;
        let handDirection = [];
        glMatrix.vec3.subtract(handDirection, handPosition, this._myStartHandPosition);
        let rotationAmountNormalized = glMatrix.vec3.length(handDirection);

        if (this._myClosestAxis) {
            rotationAxis = this._myClosestAxis;

            let projectedHandDirection = PP.MathUtils.getComponentAlongAxis(handDirection, this._myClosestHandDirection);
            rotationAmountNormalized = glMatrix.vec3.length(projectedHandDirection) * (PP.MathUtils.isConcordant(projectedHandDirection, this._myClosestHandDirection) ? 1 : -1);
        } else {
            let rotationAxes = this._getRotationAxes(handDirection);

            glMatrix.vec3.normalize(rotationAxis, rotationAxis);
        }

        //actual rotation
        let rotationAmount = rotationAmountNormalized * (Math.PI / 0.15); //15 centimeters for 180 degrees

        let rotation = [];
        glMatrix.quat.setAxisAngle(rotation, rotationAxis, rotationAmount);

        glMatrix.quat.mul(rotation, rotation, this._myStartShapeRotation);
        glMatrix.quat.normalize(rotation, rotation);

        this._mySelectedShape.setRotation(rotation);

        /*
        //compute rotation axis
        let rotationAxis = null;
        {
            let difference = glMatrix.vec3.length(handDirection);
            if (difference > 0.0001) {
                let cross = [];
                glMatrix.vec3.cross(cross, this._myStartShapeStartHandDirection, handDirection);

                if (glMatrix.vec3.length(cross) > 0.0001) {
                    glMatrix.vec3.normalize(cross, cross);
                    rotationAxis = cross;
                }
            }
        }

        if (rotationAxis) {
            let rotationAmountNormalized = glMatrix.vec3.length(handDirection);

            //closest axis
            this._updateAxisLock(handDirection, rotationAxis);
            if (this._myClosestAxis) {
                rotationAxis = this._myClosestAxis;
                let projectedHandDirection = PP.MathUtils.getComponentAlongAxis(handDirection, this._myClosestHandDirection);
                rotationAmountNormalized = glMatrix.vec3.length(projectedHandDirection) * (PP.MathUtils.isConcordant(projectedHandDirection, this._myClosestHandDirection) ? 1 : -1);
                //console.log(rotationAxis);
            }
            glMatrix.vec3.normalize(rotationAxis, rotationAxis);

            //actual rotation
            let rotationAmount = rotationAmountNormalized * (Math.PI / 0.15); //15 centimeters for 180 degrees

            let rotation = [];
            glMatrix.quat.setAxisAngle(rotation, rotationAxis, rotationAmount);

            glMatrix.quat.mul(rotation, rotation, this._myStartShapeRotation);
            glMatrix.quat.normalize(rotation, rotation);

            this._mySelectedShape.setRotation(rotation);

        } else {
            this._mySelectedShape.setRotation(this._myStartShapeRotation);
        }
        */

        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
    }

    _startWork(handedness) {
        this._myCurrentHandedness = handedness;

        this._myIsWorking = true;
        this._myStartShapeTransform = this._mySelectedShape.getTransform();
        this._myStartShapeRotation = this._mySelectedShape.getRotation();

        if (this._myCurrentHandedness == PP.HandednessIndex.LEFT) {
            this._myStartHandPosition = PlayerPose.myLeftHandPosition.slice(0);
        } else {
            this._myStartHandPosition = PlayerPose.myRightHandPosition.slice(0);
        }

        this._myStartShapeStartHandDirection = [];
        glMatrix.vec3.subtract(this._myStartShapeStartHandDirection, this._myStartHandPosition, this._mySelectedShape.getPosition());

        this._myClosestAxis = null;
        this._myClosestRotationAxis = null;
        this._myKeepCurrentClosestAxis = false;
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setRotation(this._myStartShapeRotation);
        this._myIsWorking = false;
    }

    _updateAxisLock(handDirection, rotationAxis) {
        if (this._myKeepCurrentClosestAxis) {
            return;
        }

        let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.ROTATE];

        this._myClosestAxis = null;

        if (axisLockType != AxisLockType.FREE) {
            let referenceAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            if (axisLockType == AxisLockType.LOCAL) {
                referenceAxes = PP.MathUtils.getAxes(this._myStartShapeTransform);
            }

            //Hand direction
            let minAngle = Math.PI;
            let handDirectionAxisIndex = 0;
            for (let i = 0; i < referenceAxes.length; i++) {
                let axis = referenceAxes[i];
                let angle = glMatrix.vec3.angle(axis, handDirection);
                if (angle > Math.PI / 2) {
                    angle = Math.PI - angle; //close to axis, direction is not important
                }

                if (angle < minAngle) {
                    minAngle = angle;
                    handDirectionAxisIndex = i;
                }
            }

            let rotationAxisIndexMap = [1, 0, 2];
            let rotationAxisIndex = rotationAxisIndexMap[handDirectionAxisIndex];

            this._myClosestAxis = referenceAxes[rotationAxisIndex].slice(0);
            if (!PP.MathUtils.isConcordant(this._myClosestAxis, rotationAxis)) {
                glMatrix.vec3.scale(this._myClosestAxis, this._myClosestAxis, -1);
            }

            this._myClosestHandDirection = referenceAxes[handDirectionAxisIndex].slice(0);
            if (!PP.MathUtils.isConcordant(this._myClosestHandDirection, handDirection)) {
                glMatrix.vec3.scale(this._myClosestHandDirection, this._myClosestHandDirection, -1);
            }

            if (glMatrix.vec3.length(handDirection) > 0.05) {
                this._myKeepCurrentClosestAxis = true;
            }
        }
    }
    _getRotationAxes(handDirection) {
        let initialAxes = [];
        let headAxes = PP.MathUtils.getAxes(PlayerPose.myHeadTransform);
        if (axisLockType == AxisLockType.FREE) {
            let normalizedDirection = [];
            glMatrix.vec3.normalize(normalizedDirection, handDirection);

            let crossAxis = headAxes[2];
            if (glMatrix.vec3.angle(normalizedDirection, crossAxis) < PP.MathUtils.toRadians(30)) {
                crossAxis = headAxis[1];
            }

            initialAxes[0] = normalizedDirection;
            initialAxes[1] = [];
            glMatrix.vec3.cross(initialAxes[1], initialAxes[0], crossAxis);
            initialAxes[12] = [];
            glMatrix.vec3.cross(initialAxes[2], initialAxes[0], initialAxes[1]);
        } else if (axisLockType == AxisLockType.LOCAL) {
            initialAxes = PP.MathUtils.getAxes(this._myStartShapeTransform);
        } else {
            initialAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }

        let rotationAxes = [];
        for (let i = 0; i < headAxes.length; i++) {
            let closestIndex = this._getClosestVectorIndex(headAxes[i], initialAxes);

            rotationAxes[i] = initialAxes[closestIndex];

            if (!PP.MathUtils.isConcordant(headAxes[i], rotationAxes[i])) {
                glMatrix.vec3.scale(rotationAxes[i], rotationAxes[i], -1);
            }
            initialAxes.splice(closestIndex, 1);
        }

    }

    _getClosestVectorIndex(vector, vectorList) {
        let minAngle = Math.PI;
        let closestIndex = -1;

        for (let j = 0; j < vectorList.length; j++) {
            let currentVector = vectorList[j];
            let angle = glMatrix.vec3.angle(vector, currentVector);
            if (angle > Math.PI / 2) {
                angle = Math.PI - angle; //close to axis, direction is not important
            }

            if (angle <= minAngle) {
                minAngle = angle;
                closestIndex = j;
            }
        }

        return closestIndex;
    }
}