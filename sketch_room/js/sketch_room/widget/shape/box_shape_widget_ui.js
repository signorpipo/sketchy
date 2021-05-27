
class BoxShapeWidgetUI {

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

        this._createMainSkeleton();
        this._createPointerSkeleton();
    }

    _createMainSkeleton() {
        this.myMainPanel = WL.scene.addObject(this.myPivotObject);
        this.myMainPanelBackground = WL.scene.addObject(this.myMainPanel);

        this.myShapeTypeLabelText = WL.scene.addObject(this.myMainPanel);

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

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPosition);

        this._setMainTransforms();
        this._setPointerTransform();
    }

    _setMainTransforms() {
        this.myMainPanel.setTranslationLocal(this._mySetup.myMainPanelPosition);
        this.myMainPanelBackground.scale(this._mySetup.myMainPanelBackgroundScale);

        this.myShapeTypeLabelText.setTranslationLocal(this._mySetup.myShapeTypeLabelTextPosition);
        this.myShapeTypeLabelText.scale(this._mySetup.myShapeTypeLabelTextScale);

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

    _setPointerTransform() {
        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this._addMainComponents();
        this._addPointerComponents();
    }

    _addMainComponents() {
        this.myMainPanelBackgroundComponent = this.myMainPanelBackground.addComponent('mesh');
        this.myMainPanelBackgroundComponent.mesh = this._myPlaneMesh;
        this.myMainPanelBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myMainPanelBackgroundComponent.material.color = this._mySetup.myLightBackgroundColor;

        this.myShapeTypeLabelTextComponent = this.myShapeTypeLabelText.addComponent('text');
        this._setupTextComponent(this.myShapeTypeLabelTextComponent);
        this.myShapeTypeLabelTextComponent.text = "Box";

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