class CurrentToolWidgetSetup {

    constructor() {
        this._initializeBuildSetup();
    }

    _initializeBuildSetup() {
        this.myPivotObjectRotation = [-0.645, -0.425, -0.25, 0.584];
        this.myLocalPivotObjectPosition = [0, 0.125, 0];

        this.myTextAlignment = WL.Alignment.Center;
        this.myTextJustification = WL.Justification.Middle;
        this.myTextOutlineRange = [0.425, 0.3];
        this.myTextColor = [255 / 255, 255 / 255, 255 / 255, 1];
        this.myTextOutlineColor = [50 / 255, 50 / 255, 50 / 255, 1];

        this.myCurrentToolTextPosition = [0, 0.0125, 0];
        this.myCurrentToolTextScale = [0.19, 0.19, 0.19];

        this.myAxisLockTextPosition = [0, -0.0125, 0];
        this.myAxisLockTextScale = [0.16, 0.16, 0.16];
        this.myAxisLockText = "Axis Lock: ";
    }
}