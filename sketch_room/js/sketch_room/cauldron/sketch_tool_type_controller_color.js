WL.registerComponent('sketch_tool_type_controller_color', {
    _myControllerBodyMaterial: { type: WL.Type.Material, default: null },
    _myControllerButtonMaterial: { type: WL.Type.Material, default: null },
}, {
    init: function () {
        this._myToolType = ToolType.NONE;
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myToolType != CurrentToolType) {
            this._myToolType = CurrentToolType;

            let color = [1, 1, 1, 1];

            switch (this._myToolType) {
                case ToolType.GRAB:
                    color = Colors[8];
                    break;
                case ToolType.TRANSLATE:
                    color = Colors[4];
                    break;
                case ToolType.ROTATE:
                    color = Colors[3];
                    break;
                case ToolType.SCALE:
                    color = Colors[13];
                    break;
                case ToolType.CREATE:
                    color = Colors[9];
                    break;
                default:
                    color = Colors[0];
                    break;
            }

            let darkerColor = color.slice(0);
            glMatrix.vec3.scale(darkerColor, darkerColor, 0.5);

            let darkerDarkerColor = darkerColor.slice(0);
            glMatrix.vec3.scale(darkerDarkerColor, darkerDarkerColor, 0.5);

            this._myControllerBodyMaterial.diffuseColor = color;
            this._myControllerBodyMaterial.ambientColor = darkerColor;

            this._myControllerButtonMaterial.diffuseColor = darkerColor;
            this._myControllerButtonMaterial.ambientColor = darkerDarkerColor;
        }
    },
});