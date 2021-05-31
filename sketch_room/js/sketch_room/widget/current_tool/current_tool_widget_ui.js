
class CurrentToolWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setVisible(visible) {
        if (visible) {
            this.myWidgetObject.resetTransform();
        } else {
            this.myWidgetObject.scale([0, 0, 0]);
            this.myWidgetObject.setTranslationLocal([0, -7777, 0]);
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);
        this.myLocalPivotObject = WL.scene.addObject(this.myPivotObject);
        this.myWidgetObject = WL.scene.addObject(this.myLocalPivotObject);

        this.myCurrentToolText = WL.scene.addObject(this.myWidgetObject);
        this.myAxisLockText = WL.scene.addObject(this.myWidgetObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.resetRotation();
        this.myPivotObject.rotateObject(this._mySetup.myPivotObjectRotation);
        this.myLocalPivotObject.setTranslationLocal(this._mySetup.myLocalPivotObjectPosition);

        this.myCurrentToolText.setTranslationLocal(this._mySetup.myCurrentToolTextPosition);
        this.myCurrentToolText.scale(this._mySetup.myCurrentToolTextScale);

        this.myAxisLockText.setTranslationLocal(this._mySetup.myAxisLockTextPosition);
        this.myAxisLockText.scale(this._mySetup.myAxisLockTextScale);
    }

    //Components
    _addComponents() {
        this.myCurrentToolTextComponent = this.myCurrentToolText.addComponent('text');
        this._setupTextComponent(this.myCurrentToolTextComponent);

        this.myAxisLockTextComponent = this.myAxisLockText.addComponent('text');
        this._setupTextComponent(this.myAxisLockTextComponent);
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
}