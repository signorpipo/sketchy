class SketchWidgetSetup {
    _initializeBuildSetup() {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];
        this.myLightBackgroundColor = [70 / 255, 70 / 255, 70 / 255, 1];

        this.myCursorTargetCollisionCollider = WL.Collider.Box; // box
        this.myCursorTargetCollisionGroup = 2;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = WL.Alignment.Center; // center
        this.myTextJustification = WL.Justification.Middle; // middle
        this.myTextOutlineRange = [0.45, 0.45];
        this.myTextColor = this.myDefaultTextColor;
        this.myTextOutlineColor = this.myDefaultTextColor;
    }

    _initializeRuntimeSetup() {
        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = [110 / 255, 110 / 255, 110 / 255, 1];
    }
}