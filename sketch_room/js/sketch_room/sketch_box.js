class SketchBox {
    constructor(parent) {
        this._myParentObject = parent;

        this._buildObject();
    }

    setPosition(value) {
        this._myObject.setTranslationLocal(value);
    }

    setRotation(value) {
        this._myObject.resetRotation();
        this._myObject.rotateObject(value);
    }

    setScale(value) {
        this._myObject.resetScaling();
        this._myObject.scale(value);
        this._myCollision.extents = value;
    }

    setColor(value) {
        this._myMesh.material.ambientColor = value;
    }

    getData() {
        //export string version to put in url 
    }

    _buildObject() {
        this._myObject = WL.scene.addObject(this._myParentObject);

        this._myMesh = this._myObject.addComponent('mesh');
        this._myMesh.mesh = SketchObjectData.myCubeMesh;
        this._myMesh.material = SketchObjectData.myMaterial.clone();

        this._myCursorTarget = this._myObject.addComponent('cursor-target');
        this._myCollision = this._myObject.addComponent('collision');
        this._myCollision.collider = WL.Collider.Box;
        this._myCollision.group = 1 << SketchObjectData.myCollisionGroup;
        this._myCollision.extents = [1, 1, 1];
    }
}