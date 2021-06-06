
class WallWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;
        this._myPlaneMesh = WidgetData.myPlaneMesh;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setVisible(visible) {
        if (visible) {
            this.myPivotObject.resetTransform();
            this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPosition);
        } else {
            this.myPivotObject.scale([0, 0, 0]);
            this.myPivotObject.setTranslationLocal([0, -7777, 0]);
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);
        this.myMainPanel = WL.scene.addObject(this.myPivotObject);
        this.myMainPanelBackground = WL.scene.addObject(this.myMainPanel);

        this.myWallLabelText = WL.scene.addObject(this.myMainPanel);

        this._createSizeSkeleton();
        this._createButtonSkeleton();
        this._createPointerSkeleton();
    }

    _createSizeSkeleton() {
        this.mySizePanel = WL.scene.addObject(this.myMainPanel);
        this.mySizeLabelText = WL.scene.addObject(this.mySizePanel);

        this.mySizeValuesPanel = WL.scene.addObject(this.mySizePanel);

        this.myHeightLabelText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myHeightValueText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myHeightValueCursorTarget = WL.scene.addObject(this.mySizeValuesPanel);

        this.myWidthLabelText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myWidthValueText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myWidthValueCursorTarget = WL.scene.addObject(this.mySizeValuesPanel);

        this.myDepthLabelText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myDepthValueText = WL.scene.addObject(this.mySizeValuesPanel);
        this.myDepthValueCursorTarget = WL.scene.addObject(this.mySizeValuesPanel);
    }

    _createButtonSkeleton() {
        this.myButtonPanel = WL.scene.addObject(this.myMainPanel);

        this.myClearButtonPanel = WL.scene.addObject(this.myButtonPanel);
        this.myClearButtonBackground = WL.scene.addObject(this.myClearButtonPanel);
        this.myClearButtonText = WL.scene.addObject(this.myClearButtonPanel);
        this.myClearButtonCursorTarget = WL.scene.addObject(this.myClearButtonPanel);

        this.myExportButtonPanel = WL.scene.addObject(this.myButtonPanel);
        this.myExportButtonBackground = WL.scene.addObject(this.myExportButtonPanel);
        this.myExportButtonText = WL.scene.addObject(this.myExportButtonPanel);
        this.myExportButtonCursorTarget = WL.scene.addObject(this.myExportButtonPanel);

        this.myExportResultText = WL.scene.addObject(this.myButtonPanel);
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPosition);

        this.myMainPanel.setTranslationLocal(this._mySetup.myMainPanelPosition);
        this.myMainPanelBackground.scale(this._mySetup.myMainPanelBackgroundScale);

        this.myWallLabelText.setTranslationLocal(this._mySetup.myWallLabelTextPosition);
        this.myWallLabelText.scale(this._mySetup.myWallLabelTextScale);

        this._setSizeTransforms();
        this._setButtonTransforms();
        this._setPointerTransform();
    }

    _setSizeTransforms() {
        this.mySizePanel.setTranslationLocal(this._mySetup.mySizePanelPosition);
        this.mySizeLabelText.setTranslationLocal(this._mySetup.mySizeLabelTextPosition);
        this.mySizeLabelText.scale(this._mySetup.mySizeLabelTextScale);

        this.mySizeValuesPanel.setTranslationLocal(this._mySetup.mySizeValuesPanelPosition);

        this.myHeightLabelText.setTranslationLocal(this._mySetup.myHeightLabelTextPosition);
        this.myHeightLabelText.scale(this._mySetup.myHeightLabelTextScale);
        this.myHeightValueText.setTranslationLocal(this._mySetup.myHeightValueTextPosition);
        this.myHeightValueText.scale(this._mySetup.myHeightValueTextScale);
        this.myHeightValueCursorTarget.setTranslationLocal(this._mySetup.myHeightValueCursorTargetPosition);

        this.myWidthLabelText.setTranslationLocal(this._mySetup.myWidthLabelTextPosition);
        this.myWidthLabelText.scale(this._mySetup.myWidthLabelTextScale);
        this.myWidthValueText.setTranslationLocal(this._mySetup.myWidthValueTextPosition);
        this.myWidthValueText.scale(this._mySetup.myWidthValueTextScale);
        this.myWidthValueCursorTarget.setTranslationLocal(this._mySetup.myWidthValueCursorTargetPosition);

        this.myDepthLabelText.setTranslationLocal(this._mySetup.myDepthLabelTextPosition);
        this.myDepthLabelText.scale(this._mySetup.myDepthLabelTextScale);
        this.myDepthValueText.setTranslationLocal(this._mySetup.myDepthValueTextPosition);
        this.myDepthValueText.scale(this._mySetup.myDepthValueTextScale);
        this.myDepthValueCursorTarget.setTranslationLocal(this._mySetup.myDepthValueCursorTargetPosition);
    }

    _setButtonTransforms() {
        this.myButtonPanel.setTranslationLocal(this._mySetup.myButtonPanelPosition);

        this.myClearButtonPanel.setTranslationLocal(this._mySetup.myClearButtonPosition);
        this.myClearButtonBackground.scale(this._mySetup.myClearButtonBackgroundScale);
        this.myClearButtonText.setTranslationLocal(this._mySetup.myClearButtonTextPosition);
        this.myClearButtonText.scale(this._mySetup.myClearButtonTextScale);
        this.myClearButtonCursorTarget.setTranslationLocal(this._mySetup.myClearButtonCursorTargetPosition);

        this.myExportButtonPanel.setTranslationLocal(this._mySetup.myExportButtonPosition);
        this.myExportButtonBackground.scale(this._mySetup.myExportButtonBackgroundScale);
        this.myExportButtonText.setTranslationLocal(this._mySetup.myExportButtonTextPosition);
        this.myExportButtonText.scale(this._mySetup.myExportButtonTextScale);
        this.myExportButtonCursorTarget.setTranslationLocal(this._mySetup.myExportButtonCursorTargetPosition);

        this.myExportResultText.setTranslationLocal(this._mySetup.myExportResultTextPosition);
        this.myExportResultText.scale(this._mySetup.myExportResultTextScale);
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this.myMainPanelBackgroundComponent = this.myMainPanelBackground.addComponent('mesh');
        this.myMainPanelBackgroundComponent.mesh = this._myPlaneMesh;
        this.myMainPanelBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myMainPanelBackgroundComponent.material.color = this._mySetup.myLightBackgroundColor;

        this.myWallLabelTextComponent = this.myWallLabelText.addComponent('text');
        this._setupTextComponent(this.myWallLabelTextComponent);
        this.myWallLabelTextComponent.text = "Room";

        this._addSizeComponents();
        this._addButtonComponents();
        this._addPointerComponents();
    }

    _addSizeComponents() {
        this.mySizeLabelTextComponent = this.mySizeLabelText.addComponent('text');
        this._setupTextComponent(this.mySizeLabelTextComponent);
        this.mySizeLabelTextComponent.text = this._mySetup.mySizeLabelText;
        this.mySizeLabelTextComponent.alignment = WL.Alignment.Left;

        //Height
        this.myHeightLabelTextComponent = this.myHeightLabelText.addComponent('text');
        this._setupTextComponent(this.myHeightLabelTextComponent);
        this.myHeightLabelTextComponent.text = this._mySetup.myHeightLabelText;
        this.myHeightLabelTextComponent.alignment = WL.Alignment.Left;

        this.myHeightValueTextComponent = this.myHeightValueText.addComponent('text');
        this._setupTextComponent(this.myHeightValueTextComponent);
        this.myHeightValueTextComponent.text = "99.999";
        this.myHeightValueTextComponent.alignment = WL.Alignment.Right;

        this.myHeightValueCursorTargetComponent = this.myHeightValueCursorTarget.addComponent('cursor-target');
        this.myHeightValueCollisionComponent = this.myHeightValueCursorTarget.addComponent('collision');
        this.myHeightValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myHeightValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myHeightValueCollisionComponent.extents = this._mySetup.myHeightValueCollisionExtents;

        //Width
        this.myWidthLabelTextComponent = this.myWidthLabelText.addComponent('text');
        this._setupTextComponent(this.myWidthLabelTextComponent);
        this.myWidthLabelTextComponent.text = this._mySetup.myWidthLabelText;
        this.myWidthLabelTextComponent.alignment = WL.Alignment.Left;

        this.myWidthValueTextComponent = this.myWidthValueText.addComponent('text');
        this._setupTextComponent(this.myWidthValueTextComponent);
        this.myWidthValueTextComponent.text = "99.999";
        this.myWidthValueTextComponent.alignment = WL.Alignment.Right;

        this.myWidthValueCursorTargetComponent = this.myWidthValueCursorTarget.addComponent('cursor-target');
        this.myWidthValueCollisionComponent = this.myWidthValueCursorTarget.addComponent('collision');
        this.myWidthValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myWidthValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myWidthValueCollisionComponent.extents = this._mySetup.myWidthValueCollisionExtents;

        //Depth
        this.myDepthLabelTextComponent = this.myDepthLabelText.addComponent('text');
        this._setupTextComponent(this.myDepthLabelTextComponent);
        this.myDepthLabelTextComponent.text = this._mySetup.myDepthLabelText;
        this.myDepthLabelTextComponent.alignment = WL.Alignment.Left;

        this.myDepthValueTextComponent = this.myDepthValueText.addComponent('text');
        this._setupTextComponent(this.myDepthValueTextComponent);
        this.myDepthValueTextComponent.text = "99.999";
        this.myDepthValueTextComponent.alignment = WL.Alignment.Right;

        this.myDepthValueCursorTargetComponent = this.myDepthValueCursorTarget.addComponent('cursor-target');
        this.myDepthValueCollisionComponent = this.myDepthValueCursorTarget.addComponent('collision');
        this.myDepthValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myDepthValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myDepthValueCollisionComponent.extents = this._mySetup.myDepthValueCollisionExtents;
    }

    _addButtonComponents() {
        this.myClearButtonBackgroundComponent = this.myClearButtonBackground.addComponent('mesh');
        this.myClearButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myClearButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myClearButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myClearButtonTextComponent = this.myClearButtonText.addComponent('text');
        this._setupTextComponent(this.myClearButtonTextComponent);
        this.myClearButtonTextComponent.text = this._mySetup.myClearButtonText;

        this.myClearButtonCursorTargetComponent = this.myClearButtonCursorTarget.addComponent('cursor-target');

        this.myClearButtonCollisionComponent = this.myClearButtonCursorTarget.addComponent('collision');
        this.myClearButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myClearButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myClearButtonCollisionComponent.extents = this._mySetup.myClearButtonCollisionExtents;

        this.myExportButtonBackgroundComponent = this.myExportButtonBackground.addComponent('mesh');
        this.myExportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myExportButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myExportButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myExportButtonTextComponent = this.myExportButtonText.addComponent('text');
        this._setupTextComponent(this.myExportButtonTextComponent);
        this.myExportButtonTextComponent.text = this._mySetup.myExportButtonText;

        this.myExportButtonCursorTargetComponent = this.myExportButtonCursorTarget.addComponent('cursor-target');

        this.myExportButtonCollisionComponent = this.myExportButtonCursorTarget.addComponent('collision');
        this.myExportButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myExportButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myExportButtonCollisionComponent.extents = this._mySetup.myExportButtonCollisionExtents;

        this.myExportResultTextComponent = this.myExportResultText.addComponent('text');
        this._setupTextComponent(this.myExportResultTextComponent);
    }

    _addPointerComponents() {
        this.myPointerCollisionComponent = this.myPointerCursorTarget.addComponent('collision');
        this.myPointerCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._mySetup.myPointerCollisionExtents;
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.outlineRange = this._mySetup.myTextOutlineRange;
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
        textComponent.text = "";
    }
};