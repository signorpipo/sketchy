class SketchRoomManager {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myToolManager = new ToolManager(this._mySceneObject);

        this._myCurrentObject = null;
    }

    start() {
        this._myToolManager.selectTool(ToolType.CREATE);
    }

    update(dt) {
        this._myToolManager.update(dt);
    }

}