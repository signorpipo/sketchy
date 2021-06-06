class CreateTool {
    constructor(toolSettings, wallSettings, sceneObject) {
        this._myToolSettings = toolSettings;
        this._myWallSettings = wallSettings;
        this._mySceneObject = sceneObject;
        this._myIsEnabled = false;

        this._myShapeCreatedCallbacks = new Map();
        this._myShapeDeletedCallbacks = new Map();

        this._myCurrentAction = null;
        this._mySelectedShape = null;
    }

    setSelectedShape(object) {
        if (this._mySelectedShape != object) {
            if (this._myIsWorking) {
                this._cancelWork();
            }
        }

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
            if (!this._myIsWorking) {
                this._startWork();
            } else if (this._myIsWorking) {
                this._cancelWork();
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            if (!this._myIsWorking) {
                this._startWork();
            } else if (this._myIsWorking) {
                this._cancelWork();
            }
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myIsWorking) {
                this._stopWork(PlayerPose.myLeftHandPosition);
            }
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myIsWorking) {
                this._stopWork(PlayerPose.myRightHandPosition);
            }
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE];
            switch (axisLockType) {
                case AxisLockType.FREE: // CREATE
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE] = AxisLockType.LOCAL;
                    break;
                case AxisLockType.LOCAL: // CLONE
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE] = AxisLockType.GLOBAL;
                    break;
                case AxisLockType.GLOBAL: // DELETE
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE] = AxisLockType.FREE;
                    break;
                default:
                    this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE] = AxisLockType.FREE;
                    break;
            }
        }
    }

    _updateWork(dt) {
    }

    _startWork() {
        if (this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE] != AxisLockType.FREE &&
            (this._mySelectedShape == null || this._mySelectedShape.getType() == ShapeType.WALL)) {
            return;
        }

        this._myCurrentAction = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE];
        this._myIsWorking = true;
    }

    _stopWork(position) {
        let axisLockType = this._myToolSettings.myAxisLockSettings.myAxisLockType[ToolType.CREATE];
        switch (axisLockType) {
            case AxisLockType.FREE: // CREATE
                this._createShape(position);
                break;
            case AxisLockType.LOCAL: // CLONE
                this._cloneShape(position);
                break;
            case AxisLockType.GLOBAL: // DELETE
                this._deleteSelectedShape();
                break;
            default:
                break;
        }

        this._myIsWorking = false;
    }

    _cancelWork() {
        this._myIsWorking = false;
    }

    _createShape(position) {
        let newShape = new SketchBox(this._mySceneObject);
        newShape.setPosition(position);
        newShape.setScale(this._myToolSettings.myCreateSettings.myScale);
        newShape.setColor(this._myToolSettings.myCreateSettings.myColor);

        newShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);
        newShape.snapRotation(this._myToolSettings.mySnapSettings.myRotationSnap);
        newShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
        newShape.snapInsideRoom(this._myWallSettings, this._myToolSettings);

        for (let value of this._myShapeCreatedCallbacks.values()) {
            value(newShape);
        }
    }

    _cloneShape(position) {
        let newShape = this._mySelectedShape.clone();
        if (newShape) {
            newShape.setPosition(position);
            newShape.snapPosition(this._myToolSettings.mySnapSettings.myPositionSnap);

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