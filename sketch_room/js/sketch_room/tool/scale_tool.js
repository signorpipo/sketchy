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

        this._myUseClosestLocalAxis = false;
        this._myClosestAxis = null;
        this._myLastHandPositions = [];

        //Setup
        this._myClosestMaxPositions = 10;
        this._myClosestRequiredPositions = 5;
        this._myClosestMinDifference = 0.001;
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

        this._myUseClosestLocalAxis = PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed ||
            PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed;

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

        this._addHandPosition(handPosition);
        if (!this._myClosestAxis) {
            if (this._myUseClosestLocalAxis) {
                this._updateClosestLocalAxis(dt);
                if (this._myClosestAxis) {
                    this._myScaleReferenceAxis = PP.MathUtils.getComponentAlongAxis(this._myScaleReferenceAxis, this._myClosestAxis);
                    if (glMatrix.vec3.length(this._myScaleReferenceAxis) < 0.001) {
                        this._myScaleReferenceAxis = this._myClosestAxis.slice(0);
                    }
                    glMatrix.vec3.normalize(this._myScaleReferenceAxis, this._myScaleReferenceAxis);

                    this._fixClosestAxis();
                }
            }
        }

        if (!this._myUseClosestLocalAxis || this._myClosestAxis) {
            let translation = [];
            glMatrix.vec3.subtract(translation, handPosition, this._myStartHandPosition);
            let rawScale = PP.MathUtils.getComponentAlongAxis(translation, this._myScaleReferenceAxis);
            let scaleAmount = glMatrix.vec3.length(rawScale) * (PP.MathUtils.isConcordant(rawScale, this._myScaleReferenceAxis) ? 1 : -1);

            let scaleToApply = [scaleAmount, scaleAmount, scaleAmount];
            if (this._myClosestAxis) {
                scaleToApply = PP.MathUtils.getComponentAlongAxis(scaleToApply, this._myClosestAxis);
            }

            //scaleToApply = ToolUtils.applyAxesScaleSettings(scaleToApply, this._myToolSettings.myAxesSettings, this._myStartShapeTransform);
            glMatrix.vec3.add(scaleToApply, scaleToApply, this._myStartShapeScale);
            scaleToApply = scaleToApply.map(function (value) { return Math.max(value, 0.005); });

            this._mySelectedShape.setScale(scaleToApply);
        }

        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
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
        this._myLastHandPositions = [];
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setScale(this._myStartShapeScale);
        this._myIsWorking = false;
    }

    _updateClosestLocalAxis(dt) {
        this._updateClosestAxis(PP.MathUtils.getAxes(this._myStartShapeTransform));
    }

    _updateClosestAxis(referenceAxes) {
        let averageAxis = null;
        let validCount = 0;
        let translationSum = [0, 0, 0];

        let difference = [];
        for (let i = 0; i < this._myLastHandPositions.length; i++) {
            glMatrix.vec3.subtract(difference, this._myLastHandPositions[i], this._myStartHandPosition);
            if (glMatrix.vec3.length(difference) > this._myClosestMinDifference) {
                validCount++;
                glMatrix.vec3.add(translationSum, translationSum, difference);
            }
        }

        if (validCount >= this._myClosestRequiredPositions) {
            let averageAxisToCheck = [];
            glMatrix.vec3.scale(averageAxisToCheck, translationSum, 1 / validCount);
            if (glMatrix.vec3.length(averageAxisToCheck) > this._myClosestMinDifference) {
                averageAxis = averageAxisToCheck;
            }
        }

        if (averageAxis) {
            let minAngle = Math.PI;
            for (let axis of referenceAxes) {
                let angle = glMatrix.vec3.angle(axis, averageAxis);
                if (angle > Math.PI / 2) {
                    angle = Math.PI - angle; //close to axis, direction is not important
                }

                if (angle < minAngle) {
                    minAngle = angle;
                    this._myClosestAxis = axis;
                    if (!PP.MathUtils.isConcordant(this._myClosestAxis, averageAxis)) {
                        glMatrix.vec3.scale(this._myClosestAxis, this._myClosestAxis, -1);
                    }
                }
            }
        }
    }

    //fix the axis based on the rotation, the issue is that, for example, the first paramter of the scale is always the X no matter the rotation
    _fixClosestAxis() {
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
                this._myClosestAxis = axis;
                if (!PP.MathUtils.isConcordant(this._myClosestAxis, closestAxisLocalPosition)) {
                    glMatrix.vec3.scale(this._myClosestAxis, this._myClosestAxis, -1);
                }
            }
        }
    }

    _addHandPosition(position) {
        this._myLastHandPositions.push(position);
        if (this._myLastHandPositions.length > this._myClosestRequiredPositions) {
            this._myLastHandPositions.shift();
        }
    }
}