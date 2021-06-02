var ShapeType = {
    NONE: 0,
    BOX: 1,
    WALL: 2
};

class SketchShape {
    constructor(parent, type) {
        this._myParentObject = parent;

        this._myColor = [1, 1, 1, 1];
        this._mySelected = false;
        this._mySelectedTimer = 0;

        this._myType = type;

        //Setup
        this._mySelectedShadeFactor = 0.4;
        this._mySelectedSpeedFactor = 2.5;
    }

    snapPosition(snapValue) {
        let position = this.getPosition();
        for (let i = 0; i < position.length; i++) {
            if (snapValue[i] != 0) {
                position[i] = Math.round(position[i] / snapValue[i]) * snapValue[i];
            }
        }
        this.setPosition(position);
    }

    snapRotation(snapValue) {
        let rotation = this.getEulerRotation();
        for (let i = 0; i < rotation.length; i++) {
            if (snapValue[i] != 0) {
                rotation[i] = Math.round(rotation[i] / snapValue[i]) * snapValue[i];
            }
        }
        this.setEulerRotation(rotation);
    }

    snapScale(snapValue) {
        let scale = this.getScale();
        for (let i = 0; i < scale.length; i++) {
            if (snapValue[i] != 0) {
                scale[i] = Math.max(snapValue[i], Math.round(scale[i] / snapValue[i]) * snapValue[i]);
            }
        }
        this.setScale(scale);
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

    getType() {
        return this._myType;
    }

    getObject() {
        return this._myObject;
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

    getEulerRotation() {
        return PP.MathUtils.quaternionToEuler(this._myObject.transformWorld);
    }

    getScale() {
        return this._myObject.scalingWorld.slice(0);
    }


    getColor() {
        return this._myColor;
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

    setEulerRotation(value) {
        this._myObject.resetRotation();
        this._myObject.rotateObject(PP.MathUtils.eulerToQuaternion(value));
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

    save(data) {
        let type = this.getType();
        let position = this.getPosition();
        let rotation = this.getEulerRotation();
        let scale = this.getScale();
        let color = this.getColor();

        data.push(type);

        data.push(position[0]);
        data.push(position[1]);
        data.push(position[2]);

        data.push(rotation[0]);
        data.push(rotation[1]);
        data.push(rotation[2]);

        data.push(scale[0]);
        data.push(scale[1]);
        data.push(scale[2]);

        data.push(color[0]);
        data.push(color[1]);
        data.push(color[2]);
    }

    load(data) {
        let position = [];
        let rotation = [];
        let scale = [];
        let color = [];

        position[0] = data.shift();
        position[1] = data.shift();
        position[2] = data.shift();

        rotation[0] = data.shift();
        rotation[1] = data.shift();
        rotation[2] = data.shift();

        scale[0] = data.shift();
        scale[1] = data.shift();
        scale[2] = data.shift();

        color[0] = data.shift();
        color[1] = data.shift();
        color[2] = data.shift();

        this.setPosition(position);
        this.setEulerRotation(rotation);
        this.setScale(scale);
        this.setColor(color);
    }
}