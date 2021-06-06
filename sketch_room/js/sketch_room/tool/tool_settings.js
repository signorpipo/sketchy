
class ToolSettings {
    constructor() {
        this.mySnapSettings = new SnapSettings();
        this.myCreateSettings = new CreateSettings();
        this.myAxisLockSettings = new AxisLockSettings();
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
        this.myRotationSnap = [PP.MathUtils.toRadians(5), PP.MathUtils.toRadians(5), PP.MathUtils.toRadians(5)]; //Euler Rotation
        this.myScaleSnap = this.myPositionSnap.slice(0);
        glMatrix.vec3.scale(this.myScaleSnap, this.myScaleSnap, 0.5);
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

class AxisLockSettings {
    constructor() {
        this.myAxisLockType = [];
        this.myAxisLockType[ToolType.GRAB] = AxisLockType.FREE;
        this.myAxisLockType[ToolType.TRANSLATE] = AxisLockType.FREE;
        this.myAxisLockType[ToolType.ROTATE] = AxisLockType.FREE;
        this.myAxisLockType[ToolType.SCALE] = AxisLockType.LOCAL;
    }
}

var AxisLockType = {
    FREE: 0,
    LOCAL: 1,
    GLOBAL: 2
};

class CreateSettings {
    constructor() {
        this.myColor = Colors[11];
        this.myScale = [0.075, 0.075, 0.075];
    }
}