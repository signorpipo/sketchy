
class ToolSettings {
    constructor() {
        this.mySnapSettings = new SnapSettings();
        this.myCreateSettings = new CreateSettings();
    }

    save(data) {
        this.mySnapSettings.save(data);
    }

    load(data) {
        this.mySnapSettings.load(data);
    }
}

class SnapSettings {
    constructor() {
        this.myPositionSnap = [0.05, 0.05, 0.05];
        this.myRotationSnap = [PP.MathUtils.toRadians(15), PP.MathUtils.toRadians(15), PP.MathUtils.toRadians(15)]; //Euler Rotation
        this.myScaleSnap = this.myPositionSnap.slice(0);
    }

    save(data) {
        data.push(this.myPositionSnap[0]);
        data.push(this.myPositionSnap[1]);
        data.push(this.myPositionSnap[2]);

        data.push(this.myRotationSnap[0]);
        data.push(this.myRotationSnap[1]);
        data.push(this.myRotationSnap[2]);

        data.push(this.myScaleSnap[0]);
        data.push(this.myScaleSnap[1]);
        data.push(this.myScaleSnap[2]);
    }

    load(data) {
        this.myPositionSnap[0] = data.shift();
        this.myPositionSnap[1] = data.shift();
        this.myPositionSnap[2] = data.shift();

        this.myRotationSnap[0] = data.shift();
        this.myRotationSnap[1] = data.shift();
        this.myRotationSnap[2] = data.shift();

        this.myScaleSnap[0] = data.shift();
        this.myScaleSnap[1] = data.shift();
        this.myScaleSnap[2] = data.shift();
    }
}

class CreateSettings {
    constructor() {
        this.myColor = Colors[9];
        this.myScale = [0.075, 0.075, 0.075];
    }
}