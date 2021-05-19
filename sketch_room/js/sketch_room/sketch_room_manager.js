class SketchRoomManager {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myToolManager = new ToolManager(this._mySceneObject);

        this._myObjects = [];
        this._mySelectedObject = null;
    }

    start() {
        this._registerToolsEventListeners();

        this._myToolManager.selectTool(ToolType.CREATE);
    }

    update(dt) {
        this._myToolManager.update(dt);

        for (let object of this._myObjects) {
            object.update(dt);
        }
    }

    _registerToolsEventListeners() {
        let createTool = this._myToolManager.getTool(ToolType.CREATE);
        createTool.registerObjectCreatedChangedEventListener(this, this._objectCreated.bind(this));
    }

    _objectCreated(object) {
        this._myObjects.push(object);
        this._selectObject(object);
    }

    _selectObject(object) {
        if (this._mySelectedObject) {
            this._mySelectedObject.setSelected(false);
        }

        if (object) {
            this._mySelectedObject = object;
            this._mySelectedObject.setSelected(true);
        }
    }

}