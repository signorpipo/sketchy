class WallWidgetSetup extends SketchWidgetSetup {

    constructor() {
        super();

        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        super._initializeBuildSetup();

        this.myPivotObjectPosition = [0, 0.225, 0];

        this.myMainPanelPosition = [0, 0, 0];
        this.myMainPanelBackgroundScale = [0.150, 0.150, 1];

        let panelZ = 0.01;

        this.myWallLabelTextPosition = [0, this.myMainPanelBackgroundScale[1] - 0.025, panelZ];
        this.myWallLabelTextScale = [0.19, 0.19, 0.19];

        this.mySizePanelPosition = [-this.myMainPanelBackgroundScale[0] + 0.015, this.myMainPanelBackgroundScale[1] - 0.07, panelZ];

        this.mySizeLabelTextPosition = [0, 0, 0];
        this.mySizeLabelTextScale = [0.18, 0.18, 0.18];
        this.mySizeLabelText = "Size (meters)";

        let sizeValuesTextScale = [0.144, 0.144, 0.144];
        let spaceFromLabel = 0.07;
        let spaceBetweenSizes = 0.015;
        let valueCursorExtraWidth = 0.005;
        let valueCursorExtraHeight = 0.02;

        this.mySizeValuesPanelPosition = [0.016, -0.03, 0];

        this.myHeightLabelTextPosition = [0, 0, 0];
        this.myHeightLabelTextScale = sizeValuesTextScale;
        this.myHeightLabelText = "H:";

        this.myHeightValueTextPosition = [this.myHeightLabelTextPosition[0] + spaceFromLabel, 0, 0];
        this.myHeightValueTextScale = sizeValuesTextScale;

        this.myHeightValueCursorTargetPosition = [this.myHeightLabelTextPosition[0] + spaceFromLabel / 2, 0, 0];
        this.myHeightValueCollisionExtents = [spaceFromLabel / 2 + valueCursorExtraWidth, valueCursorExtraHeight, 1];
        this.myHeightValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myWidthLabelTextPosition = [this.myHeightValueTextPosition[0] + spaceBetweenSizes, 0, 0];
        this.myWidthLabelTextScale = sizeValuesTextScale;
        this.myWidthLabelText = "W:";

        this.myWidthValueTextPosition = [this.myWidthLabelTextPosition[0] + spaceFromLabel, 0, 0];
        this.myWidthValueTextScale = sizeValuesTextScale;

        this.myWidthValueCursorTargetPosition = [this.myWidthLabelTextPosition[0] + spaceFromLabel / 2, 0, 0];
        this.myWidthValueCollisionExtents = [spaceFromLabel / 2 + valueCursorExtraWidth, valueCursorExtraHeight, 1];
        this.myWidthValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myDepthLabelTextPosition = [this.myWidthValueTextPosition[0] + spaceBetweenSizes, 0, 0];
        this.myDepthLabelTextScale = sizeValuesTextScale;
        this.myDepthLabelText = "D:";

        this.myDepthValueTextPosition = [this.myDepthLabelTextPosition[0] + spaceFromLabel, 0, 0];
        this.myDepthValueTextScale = sizeValuesTextScale;

        this.myDepthValueCursorTargetPosition = [this.myDepthLabelTextPosition[0] + spaceFromLabel / 2, 0, 0];
        this.myDepthValueCollisionExtents = [spaceFromLabel / 2 + valueCursorExtraWidth, valueCursorExtraHeight, 1];
        this.myDepthValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myExportPanelPosition = [0, -0.09, panelZ];
        this.myExportButtonPosition = [0, 0, 0];
        this.myExportButtonBackgroundScale = [0.05, 0.015, 1];
        this.myExportButtonTextPosition = [0, 0, 0.007];
        this.myExportButtonTextScale = [0.18, 0.18, 0.18];
        this.myExportButtonText = "export";

        this.myExportButtonCursorTargetPosition = [0, 0, 0];
        this.myExportButtonCollisionExtents = this.myExportButtonBackgroundScale.slice(0);
        this.myExportButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myExportResultTextPosition = [0, -0.035, 0];
        this.myExportResultTextScale = [0.144, 0.144, 0.144];

        this.myPointerCursorTargetPosition = [0, 0, panelZ - 0.0001];
        this.myPointerCollisionExtents = [this.myMainPanelBackgroundScale[0], this.myMainPanelBackgroundScale[1], this.myCursorTargetCollisionThickness];
    }

    _initializeRuntimeSetup() {
        super._initializeRuntimeSetup();

        this.myHoverTextColor = [210 / 255, 210 / 255, 210 / 255, 1];
        this.myModifyThumbstickMinThreshold = 0.2;
        this.myModifyThumbstickStepPerSecond = 1;

        this.myResultTimer = 10;
    }
}