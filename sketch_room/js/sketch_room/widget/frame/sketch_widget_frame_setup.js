class SketchWidgetFrameSetup extends SketchWidgetSetup {

    constructor() {
        super();

        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        super._initializeBuildSetup();

        this.myPivotObjectRotation = [-0.645, 0.425, 0.25, 0.584];
        glMatrix.quat.normalize(this.myPivotObjectRotation, this.myPivotObjectRotation);

        this.myLocalPivotObjectPosition = [0.015, 0.11, -0.01];
        this.myWidgetPivotObjectPosition = [0, 0.025, 0];

        this.myVisibilityButtonPosition = [-0.02, 0, 0.015];
        this.myVisibilityButtonBackgroundScale = [0.015, 0.015, 1];
        this.myVisibilityButtonTextPosition = [0, 0, 0.007];
        this.myVisibilityButtonTextScale = [0.18, 0.18, 0.18];
        this.myVisibilityButtonText = "X";

        this.myVisibilityButtonCursorTargetPosition = [0, 0, 0];
        this.myVisibilityButtonCursorTargetPosition[2] = this.myVisibilityButtonTextPosition[2];
        this.myVisibilityButtonCollisionExtents = this.myVisibilityButtonBackgroundScale.slice(0);
        this.myVisibilityButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myPinButtonPosition = [0.02, 0, 0.015];
        this.myPinButtonBackgroundScale = [0.015, 0.015, 1];
        this.myPinButtonTextPosition = [0, 0, 0.007];
        this.myPinButtonTextScale = [0.18, 0.18, 0.18];
        this.myPinButtonText = "P";

        this.myPinButtonCursorTargetPosition = [0, 0, 0];
        this.myPinButtonCursorTargetPosition[2] = this.myPinButtonTextPosition[2];
        this.myPinButtonCollisionExtents = this.myPinButtonBackgroundScale.slice(0);
        this.myPinButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myShapeButtonPosition = [-0.052, 0.04 + 0.03 + 0.004, 0.015];
        this.myShapeButtonBackgroundScale = [0.05, 0.015, 1];
        this.myShapeButtonTextPosition = [0, 0, 0.007];
        this.myShapeButtonTextScale = [0.18, 0.18, 0.18];
        this.myShapeButtonText = "shape";

        this.myShapeButtonCursorTargetPosition = [0, 0, 0];
        this.myShapeButtonCursorTargetPosition[2] = this.myShapeButtonTextPosition[2];
        this.myShapeButtonCollisionExtents = this.myShapeButtonBackgroundScale.slice(0);
        this.myShapeButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myToolsButtonPosition = [0.052, 0.04 + 0.03 + 0.004, 0.015];
        this.myToolsButtonBackgroundScale = [0.05, 0.015, 1];
        this.myToolsButtonTextPosition = [0, 0, 0.007];
        this.myToolsButtonTextScale = [0.18, 0.18, 0.18];
        this.myToolsButtonText = "tools";

        this.myToolsButtonCursorTargetPosition = [0, 0, 0];
        this.myToolsButtonCursorTargetPosition[2] = this.myToolsButtonTextPosition[2];
        this.myToolsButtonCollisionExtents = this.myToolsButtonBackgroundScale.slice(0);
        this.myToolsButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myWallButtonPosition = [-0.052, 0.04, 0.015];
        this.myWallButtonBackgroundScale = [0.05, 0.015, 1];
        this.myWallButtonTextPosition = [0, 0, 0.007];
        this.myWallButtonTextScale = [0.18, 0.18, 0.18];
        this.myWallButtonText = "room";

        this.myWallButtonCursorTargetPosition = [0, 0, 0];
        this.myWallButtonCursorTargetPosition[2] = this.myWallButtonTextPosition[2];
        this.myWallButtonCollisionExtents = this.myWallButtonBackgroundScale.slice(0);
        this.myWallButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myHowToButtonPosition = [0.052, 0.04, 0.015];
        this.myHowToButtonBackgroundScale = [0.05, 0.015, 1];
        this.myHowToButtonTextPosition = [0, 0, 0.007];
        this.myHowToButtonTextScale = [0.18, 0.18, 0.18];
        this.myHowToButtonText = "how to";

        this.myHowToButtonCursorTargetPosition = [0, 0, 0];
        this.myHowToButtonCursorTargetPosition[2] = this.myHowToButtonTextPosition[2];
        this.myHowToButtonCollisionExtents = this.myHowToButtonBackgroundScale.slice(0);
        this.myHowToButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;
    }

    _initializeRuntimeSetup() {
        super._initializeRuntimeSetup();
    }
}