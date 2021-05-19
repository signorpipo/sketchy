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
        this._mySelected = selected;
        if (!this._mySelected) {
            this._myMesh.material.ambientColor = this._myColor;
        } else {
            this._mySelectedTimer = 0;
        }
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
        this._myColor = value;
        this._myMesh.material.ambientColor = value;
    }

    getData() {
        //export string version to put in url 
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
                selectedColor[i] = Math.min(1, this._myColor[i] + (1 - this._myColor[i]) * (-currentShadeFactor / 2));
            }
        }
        this._myMesh.material.ambientColor = selectedColor;
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