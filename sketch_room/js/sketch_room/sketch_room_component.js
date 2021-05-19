WL.registerComponent('sketch-room-component', {
    _myMaterial: { type: WL.Type.Material, default: null },
}, {
    init: function () {
        this._initializeSketchObjectData();

        this._mySceneObject = WL.scene.addObject(this.object);
        this._myManager = new SketchRoomManager(this._mySceneObject);
    },
    start: function () {
        this._myManager.start();
    },
    update: function (dt) {
        this._myManager.update(dt);
    },
    _initializeSketchObjectData: function () {
        SketchObjectData.myCubeMesh = PP.MeshUtils.createCubeMesh();
        SketchObjectData.myMaterial = this._myMaterial;
        SketchObjectData.myCollisionGroup = 1;
    }
});