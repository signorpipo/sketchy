WL.registerComponent('sketch-room-component', {
    _myMaterial: { type: WL.Type.Material, default: null },
}, {
    init: function () {
        this._initializeSketchShapeData();

        this._mySceneObject = WL.scene.addObject(this.object);
        this._myManager = new SketchRoomManager(this._mySceneObject);
    },
    start: function () {
        this._myManager.start();
    },
    update: function (dt) {
        this._myManager.update(dt);
    },
    _initializeSketchShapeData: function () {
        SketchShapeData.myCubeMesh = PP.MeshUtils.createCubeMesh();
        SketchShapeData.myMaterial = this._myMaterial;
        SketchShapeData.myCollisionGroup = 1;
    }
});