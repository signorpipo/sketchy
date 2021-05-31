class SelectTool {
    constructor() {
        this._myIsEnabled = false;
        this._myCursorStartCounter = 1; //let the cursor perform the first update

        this._myShapeSelectedCallbacks = new Map();

        this._mySelectedShape = null;

        this._myLeftCursorDeactivate = false;
        this._myRightCursorDeactivate = false;

        this._myDoubleClickDeselectTimer = 0;
        this._myDeselectShape = false;

        //Setup
        this._myDoubleClickDeselectMaxDelay = 0.5;
    }

    setSelectedShape(shape) {
        this._mySelectedShape = shape;
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
}