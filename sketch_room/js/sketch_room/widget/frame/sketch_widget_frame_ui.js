
class SketchWidgetFrameUI {

    constructor() {
        this._myIsWidgetVisible = true;

        this._myParentObject = null;
        this._myIsPinned = false;
    }

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;
        this._myPlaneMesh = WidgetData.myPlaneMesh;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setWidgetVisible(visible) {
        this._myIsWidgetVisible = visible;
        if (this._myIsWidgetVisible) {
            this.myWidgetObject.resetTransform();
            this.myButtonsPanel.resetTransform();
        } else {
            this.myWidgetObject.scale([0, 0, 0]);
            this.myWidgetObject.setTranslationLocal([0, -7777, 0]);

            this.myButtonsPanel.scale([0, 0, 0]);
            this.myButtonsPanel.setTranslationLocal([0, -7777, 0]);
        }
    }

    setVisibilityButtonVisible(visible) {
        if (visible) {
            this.myVisibilityButtonPanel.resetTransform();
            this.myVisibilityButtonPanel.setTranslationLocal(this._mySetup.myVisibilityButtonPosition);
        } else {
            this.myVisibilityButtonPanel.scale([0, 0, 0]);
            this.myVisibilityButtonPanel.setTranslationLocal([0, -7777, 0]);
        }
    }

    setPinned(pinned) {
        if (pinned != this._myIsPinned) {
            this._myIsPinned = pinned;
            if (this._myIsPinned) {
                PP.ObjectUtils.reparentKeepTransform(this.myPivotObject, null);
            } else {
                PP.ObjectUtils.reparentKeepTransform(this.myPivotObject, this._myParentObject);
                this.myPivotObject.resetRotation();
                this.myPivotObject.rotateObject(this._mySetup.myPivotObjectRotation);
                this.myPivotObject.resetTranslation(this._mySetup.myPivotObjectRotation);
            }
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);
        this.myLocalPivotObject = WL.scene.addObject(this.myPivotObject);
        this.myWidgetObject = WL.scene.addObject(this.myLocalPivotObject);

        this.myVisibilityButtonPanel = WL.scene.addObject(this.myLocalPivotObject);
        this.myVisibilityButtonBackground = WL.scene.addObject(this.myVisibilityButtonPanel);
        this.myVisibilityButtonText = WL.scene.addObject(this.myVisibilityButtonPanel);
        this.myVisibilityButtonCursorTarget = WL.scene.addObject(this.myVisibilityButtonPanel);

        this.myButtonsPanel = WL.scene.addObject(this.myLocalPivotObject);

        this.myPinButtonPanel = WL.scene.addObject(this.myButtonsPanel);
        this.myPinButtonBackground = WL.scene.addObject(this.myPinButtonPanel);
        this.myPinButtonText = WL.scene.addObject(this.myPinButtonPanel);
        this.myPinButtonCursorTarget = WL.scene.addObject(this.myPinButtonPanel);

        this.myWallButtonPanel = WL.scene.addObject(this.myButtonsPanel);
        this.myWallButtonBackground = WL.scene.addObject(this.myWallButtonPanel);
        this.myWallButtonText = WL.scene.addObject(this.myWallButtonPanel);
        this.myWallButtonCursorTarget = WL.scene.addObject(this.myWallButtonPanel);

        this.myShapeButtonPanel = WL.scene.addObject(this.myButtonsPanel);
        this.myShapeButtonBackground = WL.scene.addObject(this.myShapeButtonPanel);
        this.myShapeButtonText = WL.scene.addObject(this.myShapeButtonPanel);
        this.myShapeButtonCursorTarget = WL.scene.addObject(this.myShapeButtonPanel);

        this.myToolsButtonPanel = WL.scene.addObject(this.myButtonsPanel);
        this.myToolsButtonBackground = WL.scene.addObject(this.myToolsButtonPanel);
        this.myToolsButtonText = WL.scene.addObject(this.myToolsButtonPanel);
        this.myToolsButtonCursorTarget = WL.scene.addObject(this.myToolsButtonPanel);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.resetRotation();
        this.myPivotObject.rotateObject(this._mySetup.myPivotObjectRotation);
        this.myLocalPivotObject.setTranslationLocal(this._mySetup.myLocalPivotObjectPosition);

        this.myVisibilityButtonPanel.setTranslationLocal(this._mySetup.myVisibilityButtonPosition);
        this.myVisibilityButtonBackground.scale(this._mySetup.myVisibilityButtonBackgroundScale);
        this.myVisibilityButtonText.setTranslationLocal(this._mySetup.myVisibilityButtonTextPosition);
        this.myVisibilityButtonText.scale(this._mySetup.myVisibilityButtonTextScale);
        this.myVisibilityButtonCursorTarget.setTranslationLocal(this._mySetup.myVisibilityButtonCursorTargetPosition);

        this.myPinButtonPanel.setTranslationLocal(this._mySetup.myPinButtonPosition);
        this.myPinButtonBackground.scale(this._mySetup.myPinButtonBackgroundScale);
        this.myPinButtonText.setTranslationLocal(this._mySetup.myPinButtonTextPosition);
        this.myPinButtonText.scale(this._mySetup.myPinButtonTextScale);
        this.myPinButtonCursorTarget.setTranslationLocal(this._mySetup.myPinButtonCursorTargetPosition);

        this.myWallButtonPanel.setTranslationLocal(this._mySetup.myWallButtonPosition);
        this.myWallButtonBackground.scale(this._mySetup.myWallButtonBackgroundScale);
        this.myWallButtonText.setTranslationLocal(this._mySetup.myWallButtonTextPosition);
        this.myWallButtonText.scale(this._mySetup.myWallButtonTextScale);
        this.myWallButtonCursorTarget.setTranslationLocal(this._mySetup.myWallButtonCursorTargetPosition);

        this.myShapeButtonPanel.setTranslationLocal(this._mySetup.myShapeButtonPosition);
        this.myShapeButtonBackground.scale(this._mySetup.myShapeButtonBackgroundScale);
        this.myShapeButtonText.setTranslationLocal(this._mySetup.myShapeButtonTextPosition);
        this.myShapeButtonText.scale(this._mySetup.myShapeButtonTextScale);
        this.myShapeButtonCursorTarget.setTranslationLocal(this._mySetup.myShapeButtonCursorTargetPosition);

        this.myToolsButtonPanel.setTranslationLocal(this._mySetup.myToolsButtonPosition);
        this.myToolsButtonBackground.scale(this._mySetup.myToolsButtonBackgroundScale);
        this.myToolsButtonText.setTranslationLocal(this._mySetup.myToolsButtonTextPosition);
        this.myToolsButtonText.scale(this._mySetup.myToolsButtonTextScale);
        this.myToolsButtonCursorTarget.setTranslationLocal(this._mySetup.myToolsButtonCursorTargetPosition);
    }

    //Components
    _addComponents() {
        //Visibility
        this.myVisibilityButtonBackgroundComponent = this.myVisibilityButtonBackground.addComponent('mesh');
        this.myVisibilityButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myVisibilityButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myVisibilityButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myVisibilityButtonTextComponent = this.myVisibilityButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myVisibilityButtonTextComponent);
        this.myVisibilityButtonTextComponent.text = this._mySetup.myVisibilityButtonText;

        this.myVisibilityButtonCursorTargetComponent = this.myVisibilityButtonCursorTarget.addComponent('cursor-target');
        this.myVisibilityButtonCollisionComponent = this.myVisibilityButtonCursorTarget.addComponent('collision');
        this.myVisibilityButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVisibilityButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVisibilityButtonCollisionComponent.extents = this._mySetup.myVisibilityButtonCollisionExtents;

        //Pin
        this.myPinButtonBackgroundComponent = this.myPinButtonBackground.addComponent('mesh');
        this.myPinButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPinButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPinButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myPinButtonTextComponent = this.myPinButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myPinButtonTextComponent);
        this.myPinButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myPinButtonTextComponent.text = this._mySetup.myPinButtonText;

        this.myPinButtonCursorTargetComponent = this.myPinButtonCursorTarget.addComponent('cursor-target');

        this.myPinButtonCollisionComponent = this.myPinButtonCursorTarget.addComponent('collision');
        this.myPinButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPinButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPinButtonCollisionComponent.extents = this._mySetup.myPinButtonCollisionExtents;

        //Walls
        this.myWallButtonBackgroundComponent = this.myWallButtonBackground.addComponent('mesh');
        this.myWallButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myWallButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myWallButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myWallButtonTextComponent = this.myWallButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myWallButtonTextComponent);
        this.myWallButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myWallButtonTextComponent.text = this._mySetup.myWallButtonText;

        this.myWallButtonCursorTargetComponent = this.myWallButtonCursorTarget.addComponent('cursor-target');

        this.myWallButtonCollisionComponent = this.myWallButtonCursorTarget.addComponent('collision');
        this.myWallButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myWallButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myWallButtonCollisionComponent.extents = this._mySetup.myWallButtonCollisionExtents;

        //Shape
        this.myShapeButtonBackgroundComponent = this.myShapeButtonBackground.addComponent('mesh');
        this.myShapeButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myShapeButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myShapeButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myShapeButtonTextComponent = this.myShapeButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myShapeButtonTextComponent);
        this.myShapeButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myShapeButtonTextComponent.text = this._mySetup.myShapeButtonText;

        this.myShapeButtonCursorTargetComponent = this.myShapeButtonCursorTarget.addComponent('cursor-target');

        this.myShapeButtonCollisionComponent = this.myShapeButtonCursorTarget.addComponent('collision');
        this.myShapeButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myShapeButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myShapeButtonCollisionComponent.extents = this._mySetup.myShapeButtonCollisionExtents;

        //Tools
        this.myToolsButtonBackgroundComponent = this.myToolsButtonBackground.addComponent('mesh');
        this.myToolsButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myToolsButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myToolsButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myToolsButtonTextComponent = this.myToolsButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myToolsButtonTextComponent);
        this.myToolsButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myToolsButtonTextComponent.text = this._mySetup.myToolsButtonText;

        this.myToolsButtonCursorTargetComponent = this.myToolsButtonCursorTarget.addComponent('cursor-target');

        this.myToolsButtonCollisionComponent = this.myToolsButtonCursorTarget.addComponent('collision');
        this.myToolsButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myToolsButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myToolsButtonCollisionComponent.extents = this._mySetup.myToolsButtonCollisionExtents;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.outlineRange = this._mySetup.myTextOutlineRange;
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
        textComponent.text = "";
    }
};