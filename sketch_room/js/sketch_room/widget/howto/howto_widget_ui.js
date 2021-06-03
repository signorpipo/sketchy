
class HowToWidgetUI {

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

        this.myHowToLabelText = WL.scene.addObject(this.myMainPanel);

        this._createHowToSkeleton();
        this._createPointerSkeleton();
    }

    _createHowToSkeleton() {
        this.myHowToTextPanel = WL.scene.addObject(this.myMainPanel);
        this.myHowToTextText = WL.scene.addObject(this.myHowToTextPanel);
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPosition);

        this.myMainPanel.setTranslationLocal(this._mySetup.myMainPanelPosition);
        this.myMainPanelBackground.scale(this._mySetup.myMainPanelBackgroundScale);

        this.myHowToLabelText.setTranslationLocal(this._mySetup.myHowToLabelTextPosition);
        this.myHowToLabelText.scale(this._mySetup.myHowToLabelTextScale);

        this._setHowToTransforms();
        this._setPointerTransform();
    }

    _setHowToTransforms() {
        this.myHowToTextPanel.setTranslationLocal(this._mySetup.myHowToTextPanelPosition);
        this.myHowToTextText.setTranslationLocal(this._mySetup.myHowToTextPosition);
        this.myHowToTextText.scale(this._mySetup.myHowToTextScale);
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

        this.myHowToLabelTextComponent = this.myHowToLabelText.addComponent('text');
        this._setupTextComponent(this.myHowToLabelTextComponent);
        this.myHowToLabelTextComponent.text = this._mySetup.myHowToLabelText;

        this._addHowToComponents();
        this._addPointerComponents();
    }

    _addHowToComponents() {
        this.myHowToTextTextComponent = this.myHowToTextText.addComponent('text');
        this._setupTextComponent(this.myHowToTextTextComponent);
        this.myHowToTextTextComponent.text = this._mySetup.myHowToText;
        this.myHowToTextTextComponent.alignment = WL.Alignment.Left;
        this.myHowToTextTextComponent.justification = WL.Justification.Top;
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