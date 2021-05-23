WL.registerComponent('sketch-tool-type-gui', {

}, {
    init: function () {
        this._myToolType = ToolType.NONE;
    },
    start: function () {
        this._myMaterial = this.object.getComponent("mesh").material.clone();
        this.object.getComponent("mesh").material = this._myMaterial;
    },
    update: function (dt) {
        if (this._myToolType != CurrentToolType) {
            this._myToolType = CurrentToolType;

            let color = [1, 1, 1, 1];

            switch (this._myToolType) {
                case ToolType.GRAB:
                    color = [55 / 255, 210 / 255, 205 / 255, 1];
                    break;
                case ToolType.TRANSLATE:
                    color = [230 / 255, 150 / 255, 25 / 255, 1];
                    break;
                case ToolType.CREATE:
                    color = [140 / 255, 55 / 255, 230 / 255, 1];
                    break;
                default:
                    color = [194 / 255, 194 / 255, 194 / 255, 1];
                    break;
            }

            this._myMaterial.diffuseColor = color;
            let ambientColor = color.slice(0);
            glMatrix.vec3.scale(ambientColor, ambientColor, 0.5);
            this._myMaterial.ambientColor = ambientColor;
        }
    },
});