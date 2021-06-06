
class ToolManager {
    constructor(sceneObject, shapeOutlineObject, wallSettings) {
        this._mySceneObject = sceneObject;
        this._myWallSettings = wallSettings;

        this._myToolSettings = new ToolSettings();

        this._createTools(shapeOutlineObject);
    }

    getTool(type) {
        return this._myTools[type];
    }

    getToolSettings() {
        return this._myToolSettings;
    }

    selectTool(type) {
        for (let tool of this._myTools) {
            if (tool) {
                tool.setEnabled(false);
            }
        }

        this._myTools[type].setEnabled(true);
        this._myTools[ToolType.SELECT].setEnabled(true);

        CurrentToolType = type;
    }

    setSelectedShape(shape) {
        for (let tool of this._myTools) {
            if (tool) {
                tool.setSelectedShape(shape);
            }
        }
    }

    start() {
        for (let tool of this._myTools) {
            if (tool) {
                tool.start();
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

    _createTools(shapeOutlineObject) {
        this._myTools = [];
        this._myTools[ToolType.GRAB] = new GrabTool(this._myToolSettings, this._myWallSettings);
        this._myTools[ToolType.TRANSLATE] = new TranslateTool(this._myToolSettings, this._myWallSettings);
        this._myTools[ToolType.ROTATE] = new RotateTool(this._myToolSettings, this._myWallSettings);
        this._myTools[ToolType.SCALE] = new ScaleTool(this._myToolSettings, this._myWallSettings);
        this._myTools[ToolType.CREATE] = new CreateTool(this._myToolSettings, this._myWallSettings, this._mySceneObject);
        this._myTools[ToolType.SELECT] = new SelectTool(shapeOutlineObject);
    }

    save(data) {
        this._myToolSettings.save(data);
    }

    load(data) {
        this._myToolSettings.load(data);
    }
}

var ToolType = {
    NONE: 0,
    GRAB: 1,
    TRANSLATE: 2,
    ROTATE: 3,
    SCALE: 4,
    CREATE: 5,
    SELECT: 6
};