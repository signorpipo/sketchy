
class ToolSettings {
    constructor() {
        this.mySnapSettings = new SnapSettings();
        this.myAxesSettings = new AxesSettings();
    }
}

class SnapSettings {
    constructor() {
        this.myPositionSnap = [0, 0, 0];
        this.myRotationSnap = [0, 0, 0]; //Euler Rotation
        this.myScaleSnap = [0, 0, 0];
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