class SketchWall extends SketchShape {
    constructor(parent, wallType) {
        super(parent, ShapeType.WALL);

        this._myWallType = wallType;

        this._buildObject();
    }

    _buildObject() {
        this._myObject = WL.scene.addObject(this._myParentObject);

        this._myShape = this._myObject.addComponent('sketch-shape');
        this._myShape.myShape = this;

        this._myMesh = this._myObject.addComponent('mesh');
        this._myMesh.mesh = SketchShapeData.myCubeMesh;
        this._myMesh.material = SketchShapeData.myMaterial.clone();

        this._myCursorTarget = this._myObject.addComponent('cursor-target');
        this._myCollision = this._myObject.addComponent('collision');
        this._myCollision.collider = WL.Collider.Box;
        this._myCollision.group = 1 << SketchShapeData.myCollisionGroup;
        this._myCollision.extents = [1, 1, 1];

        if (this._myWallType == WallType.FLOOR) {
            this._myCollision.group |= 1 << WallSetup.myFloorCollisionGroup;
        }
    }
}