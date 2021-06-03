class CreateTool {
    constructor(toolSettings, sceneObject) {
        this._myToolSettings = toolSettings;
        this._mySceneObject = sceneObject;
        this._myIsEnabled = false;

        this._myShapeScale = [0.075, 0.075, 0.075];
        this._myShapeColor = [140 / 255, 55 / 255, 230 / 255, 1];

        this._myShapeCreatedCallbacks = new Map();
        this._myShapeDeletedCallbacks = new Map();

        this._myLeftTimer = 0;
        this._myRightTimer = 0;

        this._myIsClone = false;
        this._myHasCloned = false;

        this._mySelectedShape = null;

        //Setup
        this._myDeleteDelay = 0.4;
    }

    setSelectedShape(object) {
        this._mySelectedShape = object;
    }

    isEnabled() {
        return this._myIsEnabled;
    }

    setEnabled(enabled) {
        this._myIsEnabled = enabled;
    }

    registerShapeCreatedChangedEventListener(id, callback) {
        this._myShapeCreatedCallbacks.set(id, callback);
    }

    unregisterShapeCreatedChangedEventListener(id) {
        this._myShapeCreatedCallbacks.delete(id);
    }

    registerShapeDeletedChangedEventListener(id, callback) {
        this._myShapeDeletedCallbacks.set(id, callback);
    }

    unregisterShapeDeletedChangedEventListener(id) {
        this._myShapeDeletedCallbacks.delete(id);
    }

    start() {

    }

    update(dt) {
        if (!this._myIsEnabled) {
            return;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            this._myLeftTimer = 0;
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            this._myRightTimer = 0;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed) {
            this._myLeftTimer += dt;
        }
        else if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed) {
            this._myRightTimer += dt;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed) {
            this._myIsClone = true;
            this._myHasCloned = false;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (!this._myHasCloned && (this._myLeftTimer < this._myDeleteDelay || this._myIsClone)) {
                this._createShape(PlayerPose.myLeftHandPosition);
            } else if (!this._myHasCloned) {
                this._deleteSelectedShape();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (!this._myHasCloned && (this._myRightTimer < this._myDeleteDelay || this._myIsClone)) {
                this._createShape(PlayerPose.myRightHandPosition);
            } else if (!this._myHasCloned) {
                this._deleteSelectedShape();
            }
        }

        if (!PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed) {
            this._myIsClone = false;
            this._myHasCloned = false;
        }
    }

    _createShape(position) {
        if (this._myIsClone && this._mySelectedShape) {
            let newShape = this._mySelectedShape.clone();
            if (newShape) {
                newShape.setPosition(position);
                newShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);

                for (let value of this._myShapeCreatedCallbacks.values()) {
                    value(newShape);
                }
            }

            this._myIsClone = false;
            this._myHasCloned = true;
        } else {
            let newShape = new SketchBox(this._mySceneObject);
            newShape.setPosition(position);
            newShape.setScale(this._myToolSettings.myCreateSettings.myScale);
            newShape.setColor(this._myToolSettings.myCreateSettings.myColor);

            newShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
            newShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
            newShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);

            for (let value of this._myShapeCreatedCallbacks.values()) {
                value(newShape);
            }
        }
    }

    _deleteSelectedShape() {
        if (this._mySelectedShape && this._mySelectedShape.getType() != ShapeType.WALL) {
            let selected = this._mySelectedShape; //keep it after delete deselecting occurs

            for (let value of this._myShapeDeletedCallbacks.values()) {
                value(this._mySelectedShape);
            }

            selected.delete(); //delay delete after notify to let tools do finalize stuff without having to worry if the object is deleted
        }
    }
}