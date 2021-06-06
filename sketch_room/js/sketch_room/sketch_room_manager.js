class SketchRoomManager {
    constructor(sceneObject, lightObject) {
        this._mySceneObject = sceneObject;
        this._myWallManager = new WallManager(this._mySceneObject, lightObject);
        this._myToolManager = new ToolManager(this._mySceneObject, this._myWallManager.getWallSettings());
        this._mySketchRoomWidget = new SketchRoomWidget(this._myToolManager.getToolSettings(), this._myWallManager.getWallSettings());

        this._myShapes = [];
        this._mySelectedShape = null;

        this.myHasExportedWithTrick = false;
    }

    start() {
        this._myToolManager.start();

        let widgetAdditionalSetup = {};
        widgetAdditionalSetup.myShowOnStart = true;
        widgetAdditionalSetup.myShowVisibilityButton = true;
        widgetAdditionalSetup.myPlaneMaterial = WidgetData.myPlaneMaterial;
        widgetAdditionalSetup.myTextMaterial = WidgetData.myTextMaterial;
        this._mySketchRoomWidget.start(PlayerPose.myLeftHandObject, PlayerPose.myRightHandObject, widgetAdditionalSetup);

        this._myWallManager.start();

        this._registerToolsEventListeners();
        this._registerWidgetEventListeners();

        this._toolSelected(ToolType.CREATE);

        this._checkLoad();
    }

    update(dt) {
        this._myToolManager.update(dt);
        this._mySketchRoomWidget.update(dt);
        this._myWallManager.update(dt);

        for (let shape of this._myShapes) {
            shape.update(dt);
        }

        this._updateExportTrick();
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
        this._mySketchRoomWidget.registerExportEventListener(this, this._export.bind(this));
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

    _export() {
        let result = "Room copied in clipboard";

        let data = [];
        this._save(data);

        let float32Data = Float32Array.from(data);
        let uint8Data = new Uint8Array(float32Data.buffer);
        var stringData = "";
        for (let i = 0; i < uint8Data.length; i++) {
            stringData = stringData.concat(String.fromCharCode(uint8Data[i]));
        }

        let stringDataBase64 = btoa(stringData);

        let url = document.URL;
        let startIndex = url.indexOf('?');
        if (startIndex >= 0) {
            url = url.substring(0, startIndex); //remove the data
        }

        url = url.concat("?").concat(stringDataBase64);

        if (navigator.clipboard) {
            if (WL.xrSession) {
                WL.xrSession.end();
            }
            navigator.clipboard.writeText(url);
        } else {
            result = "Export failed";
        }

        return result;
    }

    _checkLoad() {
        let url = document.URL;
        let startIndex = url.indexOf('?');

        if (startIndex >= 0) {
            let loadString = url.substring(startIndex + 1);
            let loadArray = new Float32Array(Uint8Array.from(atob(loadString), function (c) {
                return c.charCodeAt(0);
            }).buffer);

            let data = Array.from(loadArray);

            this._load(data);
        }
    }

    _load(data) {
        //load functions remove the loaded data from the array
        try {
            this._myToolManager.load(data);
            this._myWallManager.load(data);
            this._loadShapes(data);
        } catch (error) {
            console.log(error);
            console.log("Failed to load room");
        }
    }

    _loadShapes(data) {
        while (data.length > 0) {
            let type = data.shift();
            switch (type) {
                case ShapeType.BOX:
                    let shape = new SketchBox(this._mySceneObject);
                    shape.load(data);
                    this._myShapes.push(shape);
                    break;
                default:
                    throw 'Shape type not found';
            }
        }
    }

    _save(data) {
        this._myToolManager.save(data);
        this._myWallManager.save(data);
        this._saveShapes(data);

        return data;
    }

    _saveShapes(data) {
        for (let i = 0; i < this._myShapes.length; i++) {
            let shape = this._myShapes[i];
            shape.save(data);
        }
    }

    _updateExportTrick() {
        if (!this.myHasExportedWithTrick && PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed && PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            this.myHasExportedWithTrick = true;
            this._export();
        }

        if (!PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {

            this.myHasExportedWithTrick = false;
        }
    }
}