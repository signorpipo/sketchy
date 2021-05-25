class TranslateTool {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myIsEnabled = false;

        this._mySelectedShape = null;

        this._myStartShapeTransform = [];
        this._myStartShapePosition = [];
        this._myStartHandPosition = [];

        this._myIsWorking = false;
        this._myCurrentHandedness = PP.HandednessIndex.NONE;

        this._myUseClosestLocalAxis = false;
        this._myUseClosestGlobalAxis = false;
        this._myClosestAxis = null;
        this._myLastHandPositions = [];

        //Setup
        this._myClosestMaxPositions = 10;
        this._myClosestRequiredPositions = 5;
        this._myClosestMinDifference = 0.0005;

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("ClosestMaxPositions", 10, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("ClosestMinDifference", 0.0005, 0.001, 4));
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
        this._myClosestMaxPositions = PP.EasyTuneVariables.get("ClosestMaxPositions").myValue;
        this._myClosestRequiredPositions = Math.round(this._myClosestMaxPositions / 2);
        this._myClosestMinDifference = PP.EasyTuneVariables.get("ClosestMinDifference").myValue;

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

        this._myUseClosestLocalAxis = PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed;
        this._myUseClosestGlobalAxis = PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed;

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
            } else if (this._myUseClosestGlobalAxis) {
                this._updateClosestGlobalAxis(dt);
            }
        }

        if (!(this._myUseClosestLocalAxis || this._myUseClosestGlobalAxis) || this._myClosestAxis) {
            let translation = [];
            glMatrix.vec3.subtract(translation, handPosition, this._myStartHandPosition);

            if (this._myClosestAxis) {
                translation = PP.MathUtils.getComponentAlongAxis(translation, this._myClosestAxis);
            }
            //translation = ToolUtils.applyAxesTranslationSettings(translation, this._myToolSettings.myAxesSettings, this._myStartShapeTransform);

            glMatrix.vec3.add(translation, translation, this._myStartShapePosition);
            this._mySelectedShape.setPosition(translation);
        }
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
        this._myLastHandPositions = [];
    }

    _stopWork() {
        this._myIsWorking = false;
        this._mySelectedShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
    }

    _cancelWork() {
        this._mySelectedShape.setPosition(this._myStartShapePosition);
        this._myIsWorking = false;
    }

    _updateClosestLocalAxis(dt) {
        this._updateClosestAxis(PP.MathUtils.getLocalAxes(this._myStartShapeTransform));
    }

    _updateClosestGlobalAxis(dt) {
        this._updateClosestAxis([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
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
            glMatrix.vec3.scale(averageAxisToCheck, translationSum, 1 / validCount); //average useless remove
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