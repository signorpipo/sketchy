
class ToolSettings {
    constructor() {
        this.mySnapSettings = new SnapSettings();
    }
}

class SnapSettings {
    constructor() {
        this.myPositionSnap = [0, 0, 0];
        this.myRotationSnap = [0, 0, 0]; //Euler Rotation
        this.myScaleSnap = [0, 0, 0];
    }
}