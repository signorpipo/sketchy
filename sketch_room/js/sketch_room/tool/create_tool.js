class CreateTool {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myIsEnabled = false;

        this._myShapeScale = [0.075, 0.075, 0.075];
        this._myShapeColor = [140 / 255, 55 / 255, 230 / 255, 1];

        this._myShapeCreatedCallbacks = new Map();
        this._myShapeDeletedCallbacks = new Map();

        this._myLeftTimer = 0;
        this._myRightTimer = 0;

        this._mySelectedShape = null;
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

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myLeftTimer < 1) {
                this._createShape(PlayerPose.myLeftHandPosition);
            } else {
                this._deleteSelectedShape();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myRightTimer < 1) {
                this._createShape(PlayerPose.myRightHandPosition);
            } else {
                this._deleteSelectedShape();
            }
        }
    }

    _createShape(position) {
        let object = new SketchBox(this._mySceneObject);
        object.setPosition(position);
        object.setScale(this._myShapeScale);
        object.setColor(this._myShapeColor);

        for (let value of this._myShapeCreatedCallbacks.values()) {
            value(object);
        }
    }

    _deleteSelectedShape() {
        if (this._mySelectedShape) {
            this._mySelectedShape.delete();
            for (let value of this._myShapeDeletedCallbacks.values()) {
                value(this._mySelectedShape);
            }
        }
    }
}