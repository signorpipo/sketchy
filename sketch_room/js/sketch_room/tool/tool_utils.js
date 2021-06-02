var ToolUtils = {
    applyAxesTranslationSettings(value, axesSettings, shapeTransform) {
        return ToolUtils.applyAxesSettings(value, axesSettings.myTranslationAxes, axesSettings.myAreLocal, shapeTransform);
    },
    applyAxesScaleSettings(value, axesSettings, shapeTransform) {
        return ToolUtils.applyAxesSettings(value, axesSettings.myScaleAxes, axesSettings.myAreLocal, shapeTransform);
    },
    applyAxesRotationSettings(value, axesSettings, shapeTransform) {
        return ToolUtils.applyAxesSettings(value, axesSettings.myRotationAxes, axesSettings.myAreLocal, shapeTransform);
    },
    applyAxesSettings(value, activeAxes, areLocal, shapeTransform) {
        let referenceAxes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        if (areLocal) {
            referenceAxes = PP.MathUtils.getAxes(shapeTransform);
        }

        let adjustedValue = [0, 0, 0];
        for (let i = 0; i < activeAxes.length; i++) {
            if (activeAxes[i]) {
                let componentAlongAxis = PP.MathUtils.getComponentAlongAxis(value, referenceAxes[i]);
                glMatrix.vec3.add(adjustedValue, adjustedValue, componentAlongAxis);
            }
        }

        return adjustedValue;
    }
};