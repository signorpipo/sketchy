class SketchBox {
    constructor(parent) {
        this._myParentObject = parent;

        this._buildObject();
    }

    translate(amount) {
        //get string version to put in url 
    }

    rotate(amount) {
        //get string version to put in url 
    }

    scale(amount) {
        //scale collision too
    }

    setPosition(value) {

    }

    setRotation(value) {

    }

    setScale(value) {

    }

    setColor(value) {

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
        this.myNextButtonCollisionComponent.collider = WL.Collider.Box;
        this.myNextButtonCollisionComponent.group = 1 << SketchObjectData.myCollisionGroup;
        this.myNextButtonCollisionComponent.extents = [1, 1, 1];
    }
}