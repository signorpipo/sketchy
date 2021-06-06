class SelectTool {
    constructor(shapeOutlineObject, invertedCubeObject) {
        this._myShapeOutlineObject = shapeOutlineObject;
        this._myInvertedCubeObject = invertedCubeObject;

        this._myIsEnabled = false;
        this._myCursorStartCounter = 1; //let the cursor perform the first update

        this._myShapeSelectedCallbacks = new Map();

        this._mySelectedShape = null;

        this._myLeftCursorDeactivate = false;
        this._myRightCursorDeactivate = false;

        this._myDoubleClickDeselectTimer = 0;
        this._myDeselectShape = false;

        this._myIsOutlineVisible = false;
        this._myOutlineTimer = 0;

        //Setup
        this._myDoubleClickDeselectMaxDelay = 0.3;
        this._myOutlineShadeFactor = 0.6;
        this._myOutlineSpeedFactor = 2.5;
    }

    setSelectedShape(shape) {
        if (this._mySelectedShape != shape) {
            this._mySelectedShape = shape;
            if (shape) {
                this._myIsOutlineVisible = true;
            } else {
                this._hideOutline();
            }
        }
    }

    isEnabled() {
        return this._myIsEnabled;
    }

    setEnabled(enabled) {
        this._myIsEnabled = enabled;
    }

    registerShapeSelectedChangedEventListener(id, callback) {
        this._myShapeSelectedCallbacks.set(id, callback);
    }

    unregisterShapeSelectedChangedEventListener(id) {
        this._myShapeSelectedCallbacks.delete(id);
    }

    start() {
        this._myShapeOutlineMaterial = this._myShapeOutlineObject.getComponent("mesh").material.clone();
        this._myShapeOutlineObject.getComponent("mesh").material = this._myShapeOutlineMaterial;

        this._myInvertedCubeMaterial = this._myInvertedCubeObject.getComponent("mesh").material.clone();
        this._myInvertedCubeObject.getComponent("mesh").material = this._myInvertedCubeMaterial;

        this._hideOutline();
    }

    update(dt) {
        this._firstUpdatesStuff(dt);

        if (!this._myIsEnabled) {
            return;
        }

        this._myDoubleClickDeselectTimer += dt;
        if (this._myDeselectShape) {
            this._myDeselectShape = false;
            this._shapeSelected(null);
        }

        //Deactivate cursor when select is not pressed to avoid showing the cursor object when u just move the hands
        if (this._myLeftCursorDeactivate) {
            this._myLeftCursorDeactivate = false;
            HandCursor.myLeftCursor.active = false;
            HandCursor.myLeftCursor._setCursorVisibility(false);
        }
        if (this._myRightCursorDeactivate) {
            this._myRightCursorDeactivate = false;
            HandCursor.myRightCursor.active = false;
            HandCursor.myRightCursor._setCursorVisibility(false);
        }

        let squeezePressed = PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed || PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed;

        //activate cursor only when the button is pressed
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressStart() && !squeezePressed) {
            HandCursor.myLeftCursor.active = true;
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressStart() && !squeezePressed) {
            HandCursor.myRightCursor.active = true;
        }

        //Delay deactivation to give the cursor the time to update
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            if (this._myDoubleClickDeselectTimer < this._myDoubleClickDeselectMaxDelay) { //double click quick enough
                this._myDeselectShape = true;
            }
            this._myLeftCursorDeactivate = true;
            this._myDoubleClickDeselectTimer = 0;
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            if (this._myDoubleClickDeselectTimer < this._myDoubleClickDeselectMaxDelay) { //double click quick enough
                this._myDeselectShape = true;
            }
            this._myRightCursorDeactivate = true;
            this._myDoubleClickDeselectTimer = 0;
        }

        this._updateSelectVisual();
    }

    _updateSelectVisual(dt) {
        if (this._myIsOutlineVisible) {

            let outlineObject = this._myShapeOutlineObject;
            let outlineMaterial = this._myShapeOutlineMaterial;

            let shapeScale = this._mySelectedShape.getScale();

            if (this._mySelectedShape.getType() == ShapeType.BOX) {
                outlineObject = this._myInvertedCubeObject;
                outlineMaterial = this._myInvertedCubeMaterial;

                glMatrix.vec3.add(shapeScale, shapeScale, [0.005, 0.005, 0.005]);
            } else {
                glMatrix.vec3.add(shapeScale, shapeScale, [0.001, 0.001, 0.001]);
            }

            outlineObject.resetScaling();
            outlineObject.scale(shapeScale);
            outlineObject.setTranslationWorld(this._mySelectedShape.getPosition());
            outlineObject.resetRotation();
            outlineObject.rotateObject(this._mySelectedShape.getRotation());

            this._myOutlineTimer += dt;
            let currentShadeFactor = Math.sin(this._myOutlineTimer * this._myOutlineSpeedFactor) * this._myOutlineShadeFactor;
            let diffuseColor = this._mySelectedShape.getColor();
            if (currentShadeFactor >= 0) {
                //Darker
                for (let i = 0; i < 3; ++i) {
                    diffuseColor[i] = diffuseColor[i] * (1 - currentShadeFactor);
                }
            } else {
                //Lighter
                for (let i = 0; i < 3; ++i) {
                    diffuseColor[i] = Math.min(1, diffuseColor[i] + (1 - diffuseColor[i]) * (-currentShadeFactor));
                }
            }
            let ambientColor = diffuseColor.slice(0);
            glMatrix.vec3.scale(ambientColor, ambientColor, 0.5);
            outlineMaterial.diffuseColor = diffuseColor;
            outlineMaterial.ambientColor = ambientColor;
        }
    }

    _firstUpdatesStuff(dt) {
        if (this._myCursorStartCounter == 0) {
            HandCursor.myLeftCursor.globalTarget.addClickFunction(this._shapeSelected.bind(this));
            HandCursor.myRightCursor.globalTarget.addClickFunction(this._shapeSelected.bind(this));

            HandCursor.myLeftCursor._setCursorVisibility(false);
            HandCursor.myRightCursor._setCursorVisibility(false);

            HandCursor.myLeftCursor.active = false;
            HandCursor.myRightCursor.active = false;

            this._myCursorStartCounter = -1;
        } else if (this._myCursorStartCounter > 0) {
            this._myCursorStartCounter -= 1;
        }
    }

    _shapeSelected(shape) {
        if (this._myIsEnabled) {
            if (shape) {
                let shapeComp = shape.getComponent("sketch-shape");
                if (shapeComp && shapeComp.myShape && (shapeComp.myShape.getType() != ShapeType.WALL || !this._mySelectedShape || this._mySelectedShape.getType() == ShapeType.WALL)) {
                    for (let value of this._myShapeSelectedCallbacks.values()) {
                        value(shapeComp.myShape);
                    }
                } else if (this._mySelectedShape) {
                    for (let value of this._myShapeSelectedCallbacks.values()) {
                        value(null);
                    }
                }
            } else {
                for (let value of this._myShapeSelectedCallbacks.values()) {
                    value(null);
                }
            }
        }
    }

    _hideOutline() {
        this._myOutlineTimer = 0;
        this._myIsOutlineVisible = false;

        this._myShapeOutlineObject.scale([0, 0, 0]);
        this._myShapeOutlineObject.setTranslationLocal([0, -7777, 0]);

        this._myInvertedCubeObject.scale([0, 0, 0]);
        this._myInvertedCubeObject.setTranslationLocal([0, -7777, 0]);
    }
}