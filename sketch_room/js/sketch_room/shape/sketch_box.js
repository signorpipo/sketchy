class SketchBox {
    constructor(parent) {
        this._myParentObject = parent;

        this._myColor = [1, 1, 1, 1];
        this._mySelected = false;
        this._mySelectedTimer = 0;

        this._buildObject();

        //Setup
        this._mySelectedShadeFactor = 0.4;
        this._mySelectedSpeedFactor = 2.5;
    }

    setSelected(selected) {
        if (this._mySelected == selected) {
            return;
        }

        this._mySelected = selected;
        if (!this._mySelected) {
            this.setColor(this._myColor);
        } else {
            this._mySelectedTimer = 0;
        }
    }

    getTransform() {
        return this._myObject.transformWorld.slice(0);
    }

    getPosition() {
        let tempVector = [];
        this._myObject.getTranslationWorld(tempVector);

        return tempVector;
    }

    getRotation() {
        return this._myObject.transformWorld.slice(0, 4);
    }

    getScale() {
        return this._myObject.scalingWorld.slice(0);
    }

    setTransform(value) {
        let position = [];
        glMatrix.quat2.getTranslation(position, value);
        this.setPosition(position);
        this.setRotation(value);
    }

    setPosition(value) {
        this._myObject.setTranslationWorld(value);
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
        this._myColor = value;
        this._myMesh.material.diffuseColor = value;
        let ambientColor = this._myColor.slice(0);
        glMatrix.vec3.scale(ambientColor, ambientColor, 0.5);
        this._myMesh.material.ambientColor = ambientColor;
    }

    getData() {
        //export string version to put in url 
    }

    delete() {
        this._myObject.destroy();
    }

    update(dt) {
        if (this._mySelected) {
            this._selectedUpdate(dt);
        }
    }

    _selectedUpdate(dt) {
        this._mySelectedTimer += dt;
        let currentShadeFactor = Math.sin(this._mySelectedTimer * this._mySelectedSpeedFactor) * this._mySelectedShadeFactor;
        let selectedColor = [];
        if (currentShadeFactor >= 0) {
            //Darker
            for (let i = 0; i < 3; ++i) {
                selectedColor[i] = this._myColor[i] * (1 - currentShadeFactor);
            }
        } else {
            //Lighter
            for (let i = 0; i < 3; ++i) {
                selectedColor[i] = Math.min(1, this._myColor[i] + (1 - this._myColor[i]) * (-currentShadeFactor));
            }
        }
        this._myMesh.material.diffuseColor = selectedColor;
        let ambientColor = selectedColor.slice(0);
        glMatrix.vec3.scale(ambientColor, ambientColor, 0.5);
        this._myMesh.material.ambientColor = ambientColor;
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
    }
}