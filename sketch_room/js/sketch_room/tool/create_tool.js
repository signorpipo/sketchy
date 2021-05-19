class CreateTool {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myIsEnabled = false;

        this._myObjectScale = [0.075, 0.075, 0.075];
        this._myObjectColor = [140 / 255, 55 / 255, 230 / 255, 1];

        this._myObjectCreatedCallbacks = new Map();
        this._myObjectDeletedCallbacks = new Map();

        this._myLeftTimer = 0;
        this._myRightTimer = 0;

        this._mySelectedObject = null;
    }

    setSelectedObject(object) {
        this._mySelectedObject = object;
    }

    isEnabled() {
        return this._myIsEnabled;
    }

    setEnabled(enabled) {
        this._myIsEnabled = enabled;
    }

    registerObjectCreatedChangedEventListener(id, callback) {
        this._myObjectCreatedCallbacks.set(id, callback);
    }

    unregisterObjectCreatedChangedEventListener(id) {
        this._myObjectCreatedCallbacks.delete(id);
    }

    registerObjectDeletedChangedEventListener(id, callback) {
        this._myObjectDeletedCallbacks.set(id, callback);
    }

    unregisterObjectDeletedChangedEventListener(id) {
        this._myObjectDeletedCallbacks.delete(id);
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
                this._createObject(PlayerPose.myLeftHandPosition);
            } else {
                this._deleteSelectedObject();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myRightTimer < 1) {
                this._createObject(PlayerPose.myRightHandPosition);
            } else {
                this._deleteSelectedObject();
            }
        }
    }

    _createObject(position) {
        let object = new SketchBox(this._mySceneObject);
        object.setPosition(position);
        object.setScale(this._myObjectScale);
        object.setColor(this._myObjectColor);

        for (let value of this._myObjectCreatedCallbacks.values()) {
            value(object);
        }
    }

    _deleteSelectedObject() {
        if (this._mySelectedObject) {
            this._mySelectedObject.delete();
            for (let value of this._myObjectDeletedCallbacks.values()) {
                value(this._mySelectedObject);
            }
        }
    }
}