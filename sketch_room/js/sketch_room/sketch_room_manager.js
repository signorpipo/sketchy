class SketchRoomManager {
    constructor(sceneObject, lightObject) {
        this._mySceneObject = sceneObject;
        this._myToolManager = new ToolManager(this._mySceneObject);
        this._mySketchRoomWidget = new SketchRoomWidget(this._myToolManager.getToolSettings());
        this._myWallManager = new WallManager(this._mySceneObject, lightObject);

        this._myShapes = [];
        this._mySelectedShape = null;
    }

    start() {
        this._registerToolsEventListeners();
        this._registerWidgetEventListeners();


        this._myToolManager.start();

        let widgetAdditionalSetup = {};
        widgetAdditionalSetup.myShowOnStart = true;
        widgetAdditionalSetup.myShowVisibilityButton = true;
        widgetAdditionalSetup.myPlaneMaterial = WidgetData.myPlaneMaterial;
        widgetAdditionalSetup.myTextMaterial = WidgetData.myTextMaterial;
        this._mySketchRoomWidget.start(PlayerPose.myLeftHandObject, PlayerPose.myRightHandObject, widgetAdditionalSetup);

        this._myWallManager.start();

        this._toolSelected(ToolType.CREATE);
    }

    update(dt) {
        this._myToolManager.update(dt);
        this._mySketchRoomWidget.update(dt);
        this._myWallManager.update(dt);

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

    _registerWidgetEventListeners() {
        this._mySketchRoomWidget.registerToolSelectedChangedEventListener(this, this._toolSelected.bind(this));
    }

    //Tool Event Related
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
        this._mySketchRoomWidget.setSelectedShape(this._mySelectedShape);
    }

    //Widget Event Related
    _toolSelected(toolType) {
        this._myToolManager.selectTool(toolType);
        this._mySketchRoomWidget.setSelectedTool(toolType);
    }
}