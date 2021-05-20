class SketchRoomManager {
    constructor(sceneObject) {
        this._mySceneObject = sceneObject;
        this._myToolManager = new ToolManager(this._mySceneObject);

        this._myShapes = [];
        this._mySelectedShape = null;
    }

    start() {
        this._registerToolsEventListeners();

        this._myToolManager.start();
        this._myToolManager.selectTool(ToolType.CREATE);
    }

    update(dt) {
        this._myToolManager.update(dt);

        for (let shape of this._myShapes) {
            shape.update(dt);
        }
    }

    _registerToolsEventListeners() {
        let createTool = this._myToolManager.getTool(ToolType.CREATE);
        createTool.registerShapeCreatedChangedEventListener(this, this._shapeCreated.bind(this));
        createTool.registerShapeDeletedChangedEventListener(this, this._shapeDeleted.bind(this));

        let selectTool = this._myToolManager.getTool(ToolType.SELECT);
        selectTool.registerShapeSelectedChangedEventListener(this, this._shapeSelected.bind(this));
    }

    _shapeCreated(shape) {
        this._myShapes.push(shape);
        this._selectShape(shape);
    }

    _shapeDeleted(shape) {
        if (this._mySelectedShape == shape) {
            this._selectShape(null);
        }

        var index = this._myShapes.indexOf(shape);
        if (index > -1) {
            this._myShapes.splice(index, 1);
        }
    }

    _shapeSelected(shape) {
        this._selectShape(shape);
    }

    _selectShape(shape) {
        if (this._mySelectedShape == shape) {
            return;
        }

        if (this._mySelectedShape) {
            this._mySelectedShape.setSelected(false);
        }

        this._mySelectedShape = shape;
        if (this._mySelectedShape) {
            this._mySelectedShape.setSelected(true);
        }
        this._myToolManager.setSelectedShape(this._mySelectedShape);
    }

}