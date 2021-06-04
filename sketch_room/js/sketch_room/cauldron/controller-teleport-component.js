//Thanks Florian <3

WL.registerComponent("controller-teleport-component", {
    /** Object that will be placed as indiciation for where the player will teleport to. */
    teleportIndicatorMeshObject: { type: WL.Type.Object, default: null },
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: { type: WL.Type.Object, default: null },
    eyeLeft: { type: WL.Type.Object, default: null },
    eyeRight: { type: WL.Type.Object, default: null },
    /** Collision group of valid "floor" objects that can be teleported on */
    floorGroup: { type: WL.Type.Int, default: 1 },
    thumbstickActivationThreshhold: { type: WL.Type.Float, default: -0.7 },
    thumbstickDeactivationThreshhold: { type: WL.Type.Float, default: 0.3 },
    indicatorYOffset: { type: WL.Type.Float, default: 0.0 },
    snapTurnAmount: { type: WL.Type.Float, default: 0.6 },
}, {
    init: function () {
        this.snapTurnAmount = PP.MathUtils.toRadians(this.snapTurnAmount);
        this.prevThumbstickYAxisInput = 0;
        this.prevThumbstickXAxisInput = 0;
        this.input = this.object.getComponent('input');
        this._tempVec = [0, 0, 0];
        this._camRotation = 0;
        this._currentIndicatorRotation = 0;
        if (!this.input) {
            console.error(this.object.name, "controller-teleport-component.js: input component is required on the object.")
            return;
        }
        if (this.teleportIndicatorMeshObject) {
            this.isIndicating = false;

            this.indicatorHidden = true;
            this.hitSpot = undefined;
        } else {
            console.error(this.object.name, 'controller-teleport-component.js: Teleport indicator mesh is missing.');
        }

        this._extraRotation = 0;
        this._currentStickAxes = [];
    },
    start: function () {
        WL.onXRSessionStart.push(this.setupVREvents.bind(this));
        this.teleportIndicatorMeshObject.translate([1000, 1000, 1000]);
    },
    update: function () {
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd()) {
            this._teleportPlayer([0, 0, 0], 0);
        }

        let thumbstickXAxisInput = 0;
        let thumbstickYAxisInput = 0;
        let inputLength = 0;
        if (this.gamepadLeft && this.gamepadLeft.axes) {
            thumbstickXAxisInput = this.gamepadLeft.axes[2];
            thumbstickYAxisInput = this.gamepadLeft.axes[3];
            inputLength = Math.abs(thumbstickXAxisInput) + Math.abs(thumbstickYAxisInput);
        }

        if (!this.isIndicating && this.prevThumbstickYAxisInput >= this.thumbstickActivationThreshhold && thumbstickYAxisInput < this.thumbstickActivationThreshhold) {
            this.isIndicating = true;
            this.eyeLeft.getForward(this._tempVec);
            this._tempVec[1] = 0;
            glMatrix.vec3.normalize(this._tempVec, this._tempVec);
            this._camRotation = Math.atan2(this._tempVec[0], this._tempVec[2]);
        } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
            this.isIndicating = false;
            this.teleportIndicatorMeshObject.translate([1000, 1000, 1000]);

            if (this.hitSpot && this.camRoot) {
                // this.session.requestReferenceSpace("local").then(function(xrReferenceSpace) {
                //    this.session.requestAnimationFrame(function(time, xrFrame) {
                //      console.log(xrFrame.getViewerPose(xrReferenceSpace).transform)
                //    })
                // }.bind(this))
                this.eyeLeft.getForward(this._tempVec);
                this._tempVec[1] = 0;
                glMatrix.vec3.normalize(this._tempVec, this._tempVec);
                this._camRotation = Math.atan2(this._tempVec[0], this._tempVec[2]);
                this._camRotation = this._currentIndicatorRotation - this._camRotation;
                //this.camRoot.rotateAxisAngleRad([0, 1, 0], this._camRotation);

                let rotationToAdd = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]); // + Math.PI because up is -1, remove if up is 1
                this._teleportPlayer(this.hitSpot, rotationToAdd);
            } else if (!this.camRoot) {
                console.error(this.object.name, 'controller-teleport-component.js: Cam Root reference is missing.');
            }
        }

        if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
            let origin = [0, 0, 0];
            glMatrix.quat2.getTranslation(origin, this.object.transformWorld);

            let quat = this.object.transformWorld.slice(0);
            let extraRotation = [-0.5, 0, 0, 0.866];
            extraRotation = glMatrix.quat.normalize(extraRotation, extraRotation);
            glMatrix.quat.mul(quat, quat, extraRotation);

            let forwardDirection = [0, 0, 0];
            glMatrix.vec3.transformQuat(forwardDirection, [0, 0, -1], quat);
            let rayHit = WL.scene.rayCast(origin, forwardDirection, 1 << this.floorGroup);
            if (rayHit.hitCount > 0) {
                if (this.indicatorHidden) {
                    this.indicatorHidden = false;
                }

                this._currentStickAxes = [thumbstickXAxisInput, thumbstickYAxisInput];
                this._extraRotation = Math.PI + Math.atan2(thumbstickXAxisInput, thumbstickYAxisInput);
                this._currentIndicatorRotation = this._camRotation + (this._extraRotation - Math.PI);
                this.teleportIndicatorMeshObject.resetTranslationRotation();
                this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);

                this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);


                this.hitSpot = rayHit.locations[0].slice(0);
                if (this.indicatorYOffset) {
                    this.hitSpot[1] += this.indicatorYOffset;
                }
            } else {
                if (!this.indicatorHidden) {
                    this.teleportIndicatorMeshObject.translate([1000, 1000, 1000]);
                    this.indicatorHidden = true;
                }
                this.hitSpot = undefined;
            }
        } else {
            if (Math.abs(this.prevThumbstickXAxisInput) <= Math.abs(this.thumbstickActivationThreshhold) && Math.abs(thumbstickXAxisInput) > Math.abs(this.thumbstickActivationThreshhold)) {
                let rotationToAdd = -Math.sign(thumbstickXAxisInput) * this.snapTurnAmount;
                this._teleportPlayer(this._getCurrentHeadFloorPosition(), rotationToAdd);
            }
        }

        this.prevThumbstickXAxisInput = thumbstickXAxisInput;
        this.prevThumbstickYAxisInput = thumbstickYAxisInput;
    },
    setupVREvents: function (s) {
        /* If in VR, one-time bind the listener */
        this.session = s;
        s.addEventListener('end', function (e) {
            /* Reset cache once the session ends to rebind select etc, in case
             * it starts again */
            this.gamepad = null;
            this.session = null;
        }.bind(this));

        if (s.inputSources && s.inputSources.length) {
            for (var i = 0; i < s.inputSources.length; i++) {
                let inputSource = s.inputSources[i];

                if (inputSource.handedness == "right") {
                    this.gamepadRight = inputSource.gamepad;
                } else {
                    this.gamepadLeft = inputSource.gamepad;
                }
            }
        }

        s.addEventListener('inputsourceschange', function (e) {
            if (e.added && e.added.length) {
                for (var i = 0; i < e.added.length; i++) {
                    let inputSource = e.added[i];
                    if (inputSource.handedness == "right") {
                        this.gamepadRight = inputSource.gamepad;
                    } else {
                        this.gamepadLeft = inputSource.gamepad;
                    }
                }
            }
        }.bind(this));

        s.requestReferenceSpace('local-floor').then(function (refSpace) {
            //refSpace.addEventListener("reset", this.onViewReset().bind(this));
        }.bind(this));
    },
    _teleportPlayer: function (newPosition, rotationToAdd) {
        //current head floor position
        let currentHeadFloorPosition = this._getCurrentHeadFloorPosition();

        //current head rotation
        let currentHeadForward = [];
        this.eyeLeft.getForward(currentHeadForward);
        currentHeadForward[1] = 0;
        if (glMatrix.vec3.length(currentHeadForward) < 0.0001) {
            currentHeadForward = [0, 0, 1];
        }
        glMatrix.vec3.normalize(currentHeadForward, currentHeadForward);

        let currentHeadUp = [0, 1, 0];

        let currentHeadRight = [];
        glMatrix.vec3.cross(currentHeadRight, currentHeadUp, currentHeadForward);
        glMatrix.vec3.normalize(currentHeadRight, currentHeadRight);

        let currentHeadRotation = [];
        glMatrix.quat.setAxes(currentHeadRotation, currentHeadForward, currentHeadRight, currentHeadUp);

        //current head floor transform
        let currentHeadFloorTransform = [];
        glMatrix.quat2.fromRotationTranslation(currentHeadFloorTransform, currentHeadRotation, currentHeadFloorPosition);

        //new head floor transform        
        let newHeadPosition = newPosition.slice(0);
        let newHeadRotation = glMatrix.quat.clone(currentHeadRotation);
        glMatrix.quat.rotateY(newHeadRotation, newHeadRotation, rotationToAdd);
        let newHeadFloorTransform = [];
        glMatrix.quat2.fromRotationTranslation(newHeadFloorTransform, newHeadRotation, newHeadPosition);

        //local cam root transform to head floor
        let currentCamRootTransform = this.camRoot.transformWorld.slice(0);
        let localCamRootTransform = PP.MathUtils.getLocalTransform(currentCamRootTransform, currentHeadFloorTransform);

        //new cam root transform
        let newCamRootTransform = PP.MathUtils.getWorldTransform(localCamRootTransform, newHeadFloorTransform);
        let newCamRootPosition = [];
        glMatrix.quat2.getTranslation(newCamRootPosition, newCamRootTransform);

        this.camRoot.resetTranslationRotation();
        this.camRoot.rotate(newCamRootTransform);
        this.camRoot.setTranslationWorld(newCamRootPosition);
    },
    _getCurrentHeadFloorPosition: function () {
        let eyeLeftPosition = [];
        this.eyeLeft.getTranslationWorld(eyeLeftPosition);
        let eyeRightPosition = [];
        this.eyeRight.getTranslationWorld(eyeRightPosition);

        let currentHeadPosition = [];
        glMatrix.vec3.add(currentHeadPosition, eyeLeftPosition, eyeRightPosition);
        glMatrix.vec3.scale(currentHeadPosition, currentHeadPosition, 0.5);

        let currentCamRootPosition = [];
        this.camRoot.getTranslationWorld(currentCamRootPosition);
        currentHeadPosition[1] = currentCamRootPosition[1];

        return currentHeadPosition;
    },
    onViewReset() {
        //console.log("RESET");
    }
});