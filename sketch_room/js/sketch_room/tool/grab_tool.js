class GrabTool {
    constructor() {
        this._myIsEnabled = false;

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

    start() {
    }

    update(dt) {
        if (!this._myIsEnabled) {
            return;
        }
    }
}