
class ToolSettings {
    constructor() {
        this.mySnapSettings = new SnapSettings();
        this.myAxesSettings = new AxesSettings();
        this.myCreateSettings = new CreateSettings();
    }
}

class SnapSettings {
    constructor() {
        this.myPositionSnap = [0.005, 0.005, 0.005];
        this.myRotationSnap = [PP.MathUtils.toRadians(1), PP.MathUtils.toRadians(1), PP.MathUtils.toRadians(1)]; //Euler Rotation
        this.myScaleSnap = [0.005, 0.005, 0.005];
    }
}

class AxesSettings {
    constructor() {
        this.myTranslationAxes = [true, true, true];
        this.myRotationAxes = [true, true, true];
        this.myScaleAxes = [true, true, true];
        this.myAreLocal = false;
    }
}

class CreateSettings {
    constructor() {
        this.myColor = Colors[9];
        this.myScale = [0.075, 0.075, 0.075];
    }
}