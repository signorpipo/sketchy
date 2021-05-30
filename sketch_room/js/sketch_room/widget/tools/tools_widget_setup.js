class ToolsWidgetSetup extends SketchWidgetSetup {

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

        this.myToolsLabelTextPosition = [0, this.myMainPanelBackgroundScale[1] - 0.025, panelZ];
        this.myToolsLabelTextScale = [0.19, 0.19, 0.19];
        this.myToolsLabelText = "Tools";

        this.mySnapPanelPosition = [-this.myMainPanelBackgroundScale[0] + 0.015, this.myMainPanelBackgroundScale[1] - 0.07, panelZ];

        this.mySnapLabelTextPosition = [0, 0, 0];
        this.mySnapLabelTextScale = [0.18, 0.18, 0.18];
        this.mySnapLabelText = "Snap";

        let snapValuesTextScale = [0.144, 0.144, 0.144];
        let valueCursorExtraWidth = 0.005;
        let valueCursorExtraHeight = 0.02;

        this.mySnapValuesPanelPosition = [0.020, -0.03, 0];

        this.myPositionLabelTextPosition = [0, 0, 0];
        this.myPositionLabelTextScale = snapValuesTextScale;
        this.myPositionLabelText = "Position:";

        this.myPositionValueTextPosition = [this.myPositionLabelTextPosition[0] + 0.11, 0, 0];
        this.myPositionValueTextScale = snapValuesTextScale;

        this.myPositionValueCursorTargetPosition = [this.myPositionLabelTextPosition[0] + 0.11 / 2, 0, 0];
        this.myPositionValueCollisionExtents = [0.11 / 2 + valueCursorExtraWidth, valueCursorExtraHeight, 1];
        this.myPositionValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myRotationLabelTextPosition = [0.135, 0, 0];
        this.myRotationLabelTextScale = snapValuesTextScale;
        this.myRotationLabelText = "Rotation:";

        this.myRotationValueTextPosition = [this.myRotationLabelTextPosition[0] + 0.09, 0, 0];
        this.myRotationValueTextScale = snapValuesTextScale;

        this.myRotationValueCursorTargetPosition = [this.myRotationLabelTextPosition[0] + 0.9 / 2, 0, 0];
        this.myRotationValueCollisionExtents = [0.9 / 2 + valueCursorExtraWidth, valueCursorExtraHeight, 1];
        this.myRotationValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myColorPanelPosition = [-this.myMainPanelBackgroundScale[0] + 0.015, this.myMainPanelBackgroundScale[1] - 0.15, panelZ];

        this.myColorLabelTextPosition = [0, 0, 0];
        this.myColorLabelTextScale = [0.18, 0.18, 0.18];
        this.myColorLabelText = "Create Color";

        this.myColorButtonsPanelPosition = [0.016, -0.04, 0];

        this.myColorButtonScale = [0.0125, 0.0125, 1];

        this.myColors = [
            [15 / 255, 17 / 255, 12 / 255, 1],
            [20 / 255, 79 / 255, 118 / 255, 1],
            [82 / 255, 40 / 255, 75 / 255, 1],
            [216 / 255, 62 / 255, 88 / 255, 1],
            [242 / 255, 149 / 255, 89 / 255, 1],
            [74 / 255, 45 / 255, 35 / 255, 1],
            [31 / 255, 132 / 255, 122 / 255, 1],

            [239 / 255, 240 / 255, 244 / 255, 1],
            [21 / 255, 173 / 255, 224 / 255, 1],
            [215 / 255, 170 / 255, 208 / 255, 1],
            [255 / 255, 130 / 255, 169 / 255, 1],
            [255 / 255, 209 / 255, 102 / 255, 1],
            [134 / 255, 81 / 255, 50 / 255, 1],
            [6 / 255, 214 / 255, 160 / 255, 1],
        ];

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
        this.myModifyPositionThumbstickStepPerSecond = 0.1;
        this.myModifyRotationThumbstickStepPerSecond = 15;
    }
}