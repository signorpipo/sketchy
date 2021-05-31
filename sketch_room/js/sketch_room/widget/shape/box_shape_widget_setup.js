class BoxShapeWidgetSetup extends SketchWidgetSetup {

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

        this.myShapeTypeLabelTextPosition = [0, this.myMainPanelBackgroundScale[1] - 0.025, panelZ];
        this.myShapeTypeLabelTextScale = [0.19, 0.19, 0.19];

        this.mySizePanelPosition = [-this.myMainPanelBackgroundScale[0] + 0.015, this.myMainPanelBackgroundScale[1] - 0.07, panelZ];

        this.mySizeLabelTextPosition = [0, 0, 0];
        this.mySizeLabelTextScale = [0.18, 0.18, 0.18];
        this.mySizeLabelText = "Size";

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

        this.myColorPanelPosition = [-this.myMainPanelBackgroundScale[0] + 0.015, this.myMainPanelBackgroundScale[1] - 0.15, panelZ];

        this.myColorLabelTextPosition = [0, 0, 0];
        this.myColorLabelTextScale = [0.18, 0.18, 0.18];
        this.myColorLabelText = "Color";

        this.myColorButtonsPanelPosition = [0.016, -0.04, 0];

        this.myColorButtonScale = [0.0125, 0.0125, 1];

        this.myColors = Colors;

        let colorsPerRow = 7;
        let spaceBetweenColors = (((this.myMainPanelBackgroundScale[0] * 2) - ((0.015 + this.myColorButtonsPanelPosition[0]) * 2)) - (this.myColorButtonScale[0] * 2 * colorsPerRow)) / (colorsPerRow - 1);

        this.myColorsButtonPositions = [];
        for (let i = 0; i < this.myColors.length; i++) {
            let verticalSpace = - Math.floor(i / colorsPerRow) * (spaceBetweenColors + this.myColorButtonScale[1] * 2);
            let horizontalSpace = (i % colorsPerRow) * spaceBetweenColors + ((i % colorsPerRow) * 2 + 1) * this.myColorButtonScale[0];
            let colorPosition = [horizontalSpace, verticalSpace, 0];

            this.myColorsButtonPositions.push(colorPosition);
        }

        this.myColorSelectedBackgroundPosition = [0, 0, -0.002];
        this.myColorSelectedBackgroundScale = [this.myColorButtonScale[0] + 0.0025, this.myColorButtonScale[1] + 0.0025, this.myColorButtonScale[2] + 0.0025];
        this.myColorSelectedBackgroundColor = [200 / 255, 200 / 255, 200 / 255, 1];

        this.myColorCursorTargetPosition = [0, 0, 0];
        this.myColorCollisionExtents = this.myColorButtonScale.slice(0);
        this.myColorCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myPointerCursorTargetPosition = [0, 0, panelZ - 0.0001];
        this.myPointerCollisionExtents = [this.myMainPanelBackgroundScale[0], this.myMainPanelBackgroundScale[1], this.myCursorTargetCollisionThickness];
    }

    _initializeRuntimeSetup() {
        super._initializeRuntimeSetup();

        this.myHoverTextColor = [210 / 255, 210 / 255, 210 / 255, 1];
        this.myModifyThumbstickMinThreshold = 0.2;
        this.myModifyThumbstickStepPerSecond = 0.1;
    }
}