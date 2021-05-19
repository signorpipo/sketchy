class CreateTool {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myIsEnabled = false;

        this._myObjectScale = [0.075, 0.075, 0.075];

        this._myObjectCreatedCallbacks = new Map();
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

    start() {

    }

    update(dt) {
        if (!this._myIsEnabled) {
            return;
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            _createObject(PlayerPose.myLeftHandPosition);
        } else if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            _createObject(PlayerPose.myRightHandPosition);
        }
    }

    _createObject(position) {
        let object = new SketchBox(this._mySceneObject);
        object.setPosition(position);
        object.setScale(this._myObjectScale);

        for (let value of this._myObjectCreatedCallbacks.values()) {
            value(object);
        }
    }
}