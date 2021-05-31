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

        this._myUseClosestLocalAxis = false;
        this._myUseClosestGlobalAxis = false;
        this._myClosestAxis = null;
        this._myLastHandRotations = [];

        //Setup
        this._myClosestMaxRotations = 10;
        this._myClosestRequiredRotations = 5;
        this._myClosestMinDifference = Math.PI / (180 * 2);
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

        this._myUseClosestLocalAxis = PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed;
        this._myUseClosestGlobalAxis = PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed;

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

        this._addHandPosition(handRotation);
        if (!this._myClosestAxis) {
            if (this._myUseClosestLocalAxis) {
                this._updateClosestLocalAxis(dt);
            } else if (this._myUseClosestGlobalAxis) {
                this._updateClosestGlobalAxis(dt);
            }
        }


        if (!(this._myUseClosestLocalAxis || this._myUseClosestGlobalAxis) || this._myClosestAxis) {
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
        }
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
        this._myLastHandRotations = [];
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setRotation(this._myStartShapeRotation);
        this._myIsWorking = false;
    }

    _updateClosestLocalAxis(dt) {
        this._updateClosestAxis(PP.MathUtils.getLocalAxes(this._myStartShapeTransform));
    }

    _updateClosestGlobalAxis(dt) {
        this._updateClosestAxis([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    }

    _updateClosestAxis(referenceAxes) {
        let averageAxis = [0, 0, 0];
        let validCount = 0;

        let difference = [];
        let rotationAxis = [];
        for (let i = 0; i < this._myLastHandRotations.length; i++) {
            glMatrix.quat.mul(difference, this._myLastHandRotations[i], this._myStartHandRotationInverse);
            let rotationAngle = glMatrix.quat.getAxisAngle(rotationAxis, difference);
            if (rotationAngle > this._myClosestMinDifference) {
                validCount++;
                glMatrix.vec3.scale(rotationAxis, rotationAxis, rotationAngle);
                glMatrix.vec3.add(averageAxis, averageAxis, rotationAxis);
            }
        }

        if (validCount >= this._myClosestRequiredRotations) {
            let minAngle = Math.PI;
            for (let axis of referenceAxes) {
                let angle = glMatrix.vec3.angle(axis, averageAxis);
                if (angle > Math.PI / 2) {
                    angle = Math.PI - angle; //close to axis, direction is not important
                }

                if (angle < minAngle) {
                    minAngle = angle;
                    this._myClosestAxis = axis;
                }
            }
        }
    }

    _addHandPosition(position) {
        this._myLastHandRotations.push(position);
        if (this._myLastHandRotations.length > this._myClosestLastHandRotations) {
            this._myLastHandRotations.shift();
        }
    }
}