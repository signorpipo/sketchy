
class ToolsWidgetUI {

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

        this.myToolsLabelText = WL.scene.addObject(this.myMainPanel);

        this._createSnapSkeleton();
        this._createColorSkeleton();
        this._createPointerSkeleton();
    }

    _createSnapSkeleton() {

        this.mySnapPanel = WL.scene.addObject(this.myMainPanel);
        this.mySnapLabelText = WL.scene.addObject(this.mySnapPanel);

        this.mySnapValuesPanel = WL.scene.addObject(this.mySnapPanel);

        this.myPositionLabelText = WL.scene.addObject(this.mySnapValuesPanel);
        this.myPositionValueText = WL.scene.addObject(this.mySnapValuesPanel);
        this.myPositionValueCursorTarget = WL.scene.addObject(this.mySnapValuesPanel);

        this.myRotationLabelText = WL.scene.addObject(this.mySnapValuesPanel);
        this.myRotationValueText = WL.scene.addObject(this.mySnapValuesPanel);
        this.myRotationValueCursorTarget = WL.scene.addObject(this.mySnapValuesPanel);
    }

    _createColorSkeleton() {
        this.myColorPanel = WL.scene.addObject(this.myMainPanel);
        this.myColorLabelText = WL.scene.addObject(this.myColorPanel);

        this.myColorButtonsPanel = WL.scene.addObject(this.myColorPanel);

        this.myColorButtons = [];
        this.myColorButtonsBackgrounds = [];
        this.myColorButtonsCursorTargets = [];
        this.myColorButtonsSelectedBackgrounds = [];

        for (let i = 0; i < this._mySetup.myColors.length; i++) {
            let colorButton = WL.scene.addObject(this.myColorButtonsPanel);
            let colorButtonBackground = WL.scene.addObject(colorButton);
            let colorButtonCursorTarget = WL.scene.addObject(colorButton);
            let colorButtonSelectedBackground = WL.scene.addObject(colorButton);

            this.myColorButtons.push(colorButton);
            this.myColorButtonsBackgrounds.push(colorButtonBackground);
            this.myColorButtonsCursorTargets.push(colorButtonCursorTarget);
            this.myColorButtonsSelectedBackgrounds.push(colorButtonSelectedBackground);
        }
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPosition);

        this.myMainPanel.setTranslationLocal(this._mySetup.myMainPanelPosition);
        this.myMainPanelBackground.scale(this._mySetup.myMainPanelBackgroundScale);

        this.myToolsLabelText.setTranslationLocal(this._mySetup.myToolsLabelTextPosition);
        this.myToolsLabelText.scale(this._mySetup.myToolsLabelTextScale);

        this._setSnapTransforms();
        this._setColorTransforms();
        this._setPointerTransform();
    }

    _setSnapTransforms() {
        this.mySnapPanel.setTranslationLocal(this._mySetup.mySnapPanelPosition);
        this.mySnapLabelText.setTranslationLocal(this._mySetup.mySnapLabelTextPosition);
        this.mySnapLabelText.scale(this._mySetup.mySnapLabelTextScale);

        this.mySnapValuesPanel.setTranslationLocal(this._mySetup.mySnapValuesPanelPosition);

        this.myPositionLabelText.setTranslationLocal(this._mySetup.myPositionLabelTextPosition);
        this.myPositionLabelText.scale(this._mySetup.myPositionLabelTextScale);
        this.myPositionValueText.setTranslationLocal(this._mySetup.myPositionValueTextPosition);
        this.myPositionValueText.scale(this._mySetup.myPositionValueTextScale);
        this.myPositionValueCursorTarget.setTranslationLocal(this._mySetup.myPositionValueCursorTargetPosition);

        this.myRotationLabelText.setTranslationLocal(this._mySetup.myRotationLabelTextPosition);
        this.myRotationLabelText.scale(this._mySetup.myRotationLabelTextScale);
        this.myRotationValueText.setTranslationLocal(this._mySetup.myRotationValueTextPosition);
        this.myRotationValueText.scale(this._mySetup.myRotationValueTextScale);
        this.myRotationValueCursorTarget.setTranslationLocal(this._mySetup.myRotationValueCursorTargetPosition);
    }

    _setColorTransforms() {
        this.myColorPanel.setTranslationLocal(this._mySetup.myColorPanelPosition);
        this.myColorLabelText.setTranslationLocal(this._mySetup.myColorLabelTextPosition);
        this.myColorLabelText.scale(this._mySetup.myColorLabelTextScale);

        this.myColorButtonsPanel.setTranslationLocal(this._mySetup.myColorButtonsPanelPosition);

        for (let i = 0; i < this._mySetup.myColors.length; i++) {
            this.myColorButtons[i].setTranslationLocal(this._mySetup.myColorsButtonPositions[i]);
            this.myColorButtonsBackgrounds[i].scale(this._mySetup.myColorButtonScale);
            this.myColorButtonsCursorTargets[i].setTranslationLocal(this._mySetup.myColorCursorTargetPosition);
            this.myColorButtonsSelectedBackgrounds[i].setTranslationLocal(this._mySetup.myColorSelectedBackgroundPosition);
            this.myColorButtonsSelectedBackgrounds[i].scale([0, 0, 0]);
        }
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

        this.myToolsLabelTextComponent = this.myToolsLabelText.addComponent('text');
        this._setupTextComponent(this.myToolsLabelTextComponent);
        this.myToolsLabelTextComponent.text = this._mySetup.myToolsLabelText;

        this._addSnapComponents();
        this._addColorComponents();
        this._addPointerComponents();
    }

    _addSnapComponents() {
        this.mySnapLabelTextComponent = this.mySnapLabelText.addComponent('text');
        this._setupTextComponent(this.mySnapLabelTextComponent);
        this.mySnapLabelTextComponent.text = this._mySetup.mySnapLabelText;
        this.mySnapLabelTextComponent.alignment = WL.Alignment.Left;

        //Position
        this.myPositionLabelTextComponent = this.myPositionLabelText.addComponent('text');
        this._setupTextComponent(this.myPositionLabelTextComponent);
        this.myPositionLabelTextComponent.text = this._mySetup.myPositionLabelText;
        this.myPositionLabelTextComponent.alignment = WL.Alignment.Left;

        this.myPositionValueTextComponent = this.myPositionValueText.addComponent('text');
        this._setupTextComponent(this.myPositionValueTextComponent);
        this.myPositionValueTextComponent.text = "9.999";
        this.myPositionValueTextComponent.alignment = WL.Alignment.Right;

        this.myPositionValueCursorTargetComponent = this.myPositionValueCursorTarget.addComponent('cursor-target');
        this.myPositionValueCollisionComponent = this.myPositionValueCursorTarget.addComponent('collision');
        this.myPositionValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPositionValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPositionValueCollisionComponent.extents = this._mySetup.myPositionValueCollisionExtents;

        //Rotation
        this.myRotationLabelTextComponent = this.myRotationLabelText.addComponent('text');
        this._setupTextComponent(this.myRotationLabelTextComponent);
        this.myRotationLabelTextComponent.text = this._mySetup.myRotationLabelText;
        this.myRotationLabelTextComponent.alignment = WL.Alignment.Left;

        this.myRotationValueTextComponent = this.myRotationValueText.addComponent('text');
        this._setupTextComponent(this.myRotationValueTextComponent);
        this.myRotationValueTextComponent.text = "90";
        this.myRotationValueTextComponent.alignment = WL.Alignment.Right;

        this.myRotationValueCursorTargetComponent = this.myRotationValueCursorTarget.addComponent('cursor-target');
        this.myRotationValueCollisionComponent = this.myRotationValueCursorTarget.addComponent('collision');
        this.myRotationValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myRotationValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myRotationValueCollisionComponent.extents = this._mySetup.myRotationValueCollisionExtents;
    }

    _addColorComponents() {
        this.myColorLabelTextComponent = this.myColorLabelText.addComponent('text');
        this._setupTextComponent(this.myColorLabelTextComponent);
        this.myColorLabelTextComponent.text = this._mySetup.myColorLabelText;
        this.myColorLabelTextComponent.alignment = WL.Alignment.Left;

        this.myColorButtonsBackgroundComponents = [];
        this.myColorButtonsCursorTargetComponents = [];
        this.myColorButtonsCursorCollisionComponents = [];
        this.myColorButtonsSelectedBackgroundComponents = [];

        for (let i = 0; i < this._mySetup.myColors.length; i++) {
            let backgroundComponent = this.myColorButtonsBackgrounds[i].addComponent('mesh');
            backgroundComponent.mesh = this._myPlaneMesh;
            backgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            backgroundComponent.material.color = this._mySetup.myColors[i];

            let cursorTargetComponent = this.myColorButtonsCursorTargets[i].addComponent('cursor-target');
            let collisionComponent = this.myColorButtonsCursorTargets[i].addComponent('collision');
            collisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
            collisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
            collisionComponent.extents = this._mySetup.myColorCollisionExtents;

            let selectedBackgroundComponent = this.myColorButtonsSelectedBackgrounds[i].addComponent('mesh');
            selectedBackgroundComponent.mesh = this._myPlaneMesh;
            selectedBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
            selectedBackgroundComponent.material.color = this._mySetup.myColorSelectedBackgroundColor;

            this.myColorButtonsBackgroundComponents.push(backgroundComponent);
            this.myColorButtonsCursorTargetComponents.push(cursorTargetComponent);
            this.myColorButtonsCursorCollisionComponents.push(collisionComponent);
            this.myColorButtonsSelectedBackgroundComponents.push(selectedBackgroundComponent);
        }
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