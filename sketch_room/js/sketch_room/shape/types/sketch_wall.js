class SketchWall extends SketchShape {
    constructor(parent, wallType) {
        super(parent, ShapeType.WALL);

        this._myWallType = wallType;

        this._buildObject();
    }

    setScale(value) {
        super.setScale(value);
        if (this._myFloorCollision) {
            value = value.slice(0);
            //prevent going to close to the walls
            value[0] -= 0.5;
            value[2] -= 0.5;
            this._myFloorCollision.extents = value;
        }
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
            this._myFloorCollision = this._myObject.addComponent('collision');
            this._myFloorCollision.collider = WL.Collider.Box;
            this._myFloorCollision.group = 1 << WallSetup.myFloorCollisionGroup;
            this._myFloorCollision.extents = [1, 1, 1];
        }
    }
}