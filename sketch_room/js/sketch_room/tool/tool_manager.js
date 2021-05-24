
class ToolManager {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myToolSettings = new ToolSettings();

        this._createTools();

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Position Snap", 0.01, 0.1, 3));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Rotation Snap", 0, 1, 3));

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("X Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Y Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Z Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("X R Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Y R Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Z R Axis Active", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Use Local Axes", -1, 1));
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

        this._myToolSettings.mySnapSettings.myPositionSnap = [PP.EasyTuneVariables.get("Position Snap").myValue, PP.EasyTuneVariables.get("Position Snap").myValue, PP.EasyTuneVariables.get("Position Snap").myValue];
        let radianValue = PP.MathUtils.toRadians(PP.EasyTuneVariables.get("Rotation Snap").myValue);
        this._myToolSettings.mySnapSettings.myRotationSnap = [radianValue, radianValue, radianValue];
        this._myToolSettings.mySnapSettings.myScaleSnap = [PP.EasyTuneVariables.get("Position Snap").myValue, PP.EasyTuneVariables.get("Position Snap").myValue, PP.EasyTuneVariables.get("Position Snap").myValue];

        this._myToolSettings.myAxesSettings.myTranslationAxes = [
            PP.EasyTuneVariables.get("X Axis Active").myValue >= 0,
            PP.EasyTuneVariables.get("Y Axis Active").myValue >= 0,
            PP.EasyTuneVariables.get("Z Axis Active").myValue >= 0];

        this._myToolSettings.myAxesSettings.myRotationAxes = [
            PP.EasyTuneVariables.get("X R Axis Active").myValue >= 0,
            PP.EasyTuneVariables.get("Y R Axis Active").myValue >= 0,
            PP.EasyTuneVariables.get("Z R Axis Active").myValue >= 0];

        this._myToolSettings.myAxesSettings.myScaleAxes = this._myToolSettings.myAxesSettings.myTranslationAxes;

        this._myToolSettings.myAxesSettings.myAreLocal = PP.EasyTuneVariables.get("Use Local Axes").myValue >= 0;
    }

    _createTools() {
        this._myTools = [];
        this._myTools[ToolType.GRAB] = new GrabTool(this._myToolSettings);
        this._myTools[ToolType.TRANSLATE] = new TranslateTool(this._myToolSettings);
        this._myTools[ToolType.ROTATE] = new RotateTool(this._myToolSettings);
        this._myTools[ToolType.SCALE] = new ScaleTool(this._myToolSettings);
        this._myTools[ToolType.CREATE] = new CreateTool(this._myToolSettings, this._mySceneObject);
        this._myTools[ToolType.SELECT] = new SelectTool();
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