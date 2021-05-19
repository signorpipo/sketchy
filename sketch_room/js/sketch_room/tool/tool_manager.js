
class ToolManager {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;

        this._createTools();
    }

    getTool(type) {
        return this._myTools[type];
    }

    selectTool(type) {
        for (let tool of this._myTools) {
            if (tool) {
                tool.setEnabled(false);
            }
        }

        this._myTools[type].setEnabled(true);
    }

    setSelectedObject(object) {
        for (let tool of this._myTools) {
            if (tool) {
                tool.setSelectedObject(object);
            }
        }
    }

    update(dt) {
        for (let tool of this._myTools) {
            if (tool) {
                tool.update(dt);
            }
        }
    }

    _createTools() {
        this._myTools = [];
        this._myTools[ToolType.CREATE] = new CreateTool(this._mySceneObject);
    }
}

var ToolType = {
    GRAB: 0,
    MOVE: 1,
    ROTATE: 2,
    SCALE: 3,
    SELECT: 4,
    CREATE: 5
};