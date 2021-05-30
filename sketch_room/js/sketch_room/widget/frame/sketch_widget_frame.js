
class SketchWidgetFrame {
    constructor() {
        this.myIsWidgetVisible = true;
        this.myIsPinned = false;

        this._mySetup = new SketchWidgetFrameSetup();
        this._myAdditionalSetup = null;

        this._myUI = new SketchWidgetFrameUI();

        this._myWidgetVisibleChangedCallbacks = new Map();
        this._myPinnedChangedCallbacks = new Map();
        this._myWidgetChangedCallbacks = new Map();

        this._myCurrentSketchWidget = SketchWidgetType.NONE;
    }

    getWidgetObject() {
        return this._myUI.myWidgetObject;
    }

    toggleVisibility() {
        this._toggleVisibility(false);
    }

    togglePin() {
        this._togglePin(false);
    }

    registerWidgetVisibleChangedEventListener(id, callback) {
        this._myWidgetVisibleChangedCallbacks.set(id, callback);
    }

    unregisterWidgetVisibleChangedEventListener(id) {
        this._myWidgetVisibleChangedCallbacks.delete(id);
    }

    registerPinnedChangedEventListener(id, callback) {
        this._myPinnedChangedCallbacks.set(id, callback);
    }

    unregisterPinnedChangedEventListener(id) {
        this._myPinnedChangedCallbacks.delete(id);
    }

    registerWidgetChangedEventListener(id, callback) {
        this._myWidgetChangedCallbacks.set(id, callback);
    }

    unregisterWidgetChangedEventListener(id) {
        this._myWidgetChangedCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._myUI.setVisibilityButtonVisible(additionalSetup.myShowVisibilityButton);
        if (!additionalSetup.myShowOnStart) {
            this._toggleVisibility(false);
        }

        this._addListeners();
    }

    update(dt) {
        //this._myUI.update(dt);
    }

    _addListeners() {
        let ui = this._myUI;

        if (this._myAdditionalSetup.myShowVisibilityButton) {
            ui.myVisibilityButtonCursorTargetComponent.addClickFunction(this._toggleVisibility.bind(this, true));
            ui.myVisibilityButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
            ui.myVisibilityButtonCursorTargetComponent.addUnHoverFunction(this._visibilityUnHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
        }

        ui.myPinButtonCursorTargetComponent.addClickFunction(this._togglePin.bind(this, true));
        ui.myPinButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPinButtonBackgroundComponent.material));
        ui.myPinButtonCursorTargetComponent.addUnHoverFunction(this._pinUnHover.bind(this, ui.myPinButtonBackgroundComponent.material));

        ui.myShapeButtonCursorTargetComponent.addClickFunction(this._selectShape.bind(this, true));
        ui.myShapeButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myShapeButtonBackgroundComponent.material));
        ui.myShapeButtonCursorTargetComponent.addUnHoverFunction(this._shapeUnHover.bind(this, ui.myShapeButtonBackgroundComponent.material));

        ui.myToolsButtonCursorTargetComponent.addClickFunction(this._selectTools.bind(this, true));
        ui.myToolsButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myToolsButtonBackgroundComponent.material));
        ui.myToolsButtonCursorTargetComponent.addUnHoverFunction(this._shapeUnHover.bind(this, ui.myToolsButtonBackgroundComponent.material));
    }

    _toggleVisibility(isButton) {
        this.myIsWidgetVisible = !this.myIsWidgetVisible;

        this._myUI.setWidgetVisible(this.myIsWidgetVisible);

        let textMaterial = this._myUI.myVisibilityButtonTextComponent.material;
        let backgroundMaterial = this._myUI.myVisibilityButtonBackgroundComponent.material;
        if (this.myIsWidgetVisible) {
            textMaterial.color = this._mySetup.myDefaultTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myBackgroundColor;
            }
        } else {
            textMaterial.color = this._mySetup.myButtonDisabledTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
            }
        }

        for (let value of this._myWidgetVisibleChangedCallbacks.values()) {
            value(this.myIsWidgetVisible);
        }
    }

    _togglePin(isButton) {
        if (this.myIsWidgetVisible) {
            this.myIsPinned = !this.myIsPinned;

            this._myUI.setPinned(this.myIsPinned);

            let textMaterial = this._myUI.myPinButtonTextComponent.material;
            let backgroundMaterial = this._myUI.myPinButtonBackgroundComponent.material;
            if (this.myIsPinned) {
                textMaterial.color = this._mySetup.myDefaultTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myBackgroundColor;
                }
            } else {
                textMaterial.color = this._mySetup.myButtonDisabledTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
                }
            }

            for (let value of this._myPinnedChangedCallbacks.values()) {
                value(this.myIsPinned);
            }
        }
    }

    _selectShape() {
        if (this.myIsWidgetVisible && this._myCurrentSketchWidget != SketchWidgetType.SHAPE) {
            this._myCurrentSketchWidget = SketchWidgetType.SHAPE;

            this._deselectAllWidgetTypeButtons();

            let textMaterial = this._myUI.myShapeButtonTextComponent.material;
            textMaterial.color = this._mySetup.myDefaultTextColor;

            for (let value of this._myWidgetChangedCallbacks.values()) {
                value(this._myCurrentSketchWidget);
            }
        }
    }

    _selectTools() {
        if (this.myIsWidgetVisible && this._myCurrentSketchWidget != SketchWidgetType.TOOLS) {
            this._myCurrentSketchWidget = SketchWidgetType.TOOLS;

            this._deselectAllWidgetTypeButtons();

            let textMaterial = this._myUI.myToolsButtonTextComponent.material;
            textMaterial.color = this._mySetup.myDefaultTextColor;

            for (let value of this._myWidgetChangedCallbacks.values()) {
                value(this._myCurrentSketchWidget);
            }
        }
    }

    _deselectAllWidgetTypeButtons() {
        {
            let textMaterial = this._myUI.myShapeButtonTextComponent.material;
            textMaterial.color = this._mySetup.myButtonDisabledTextColor;

            let backgroundMaterial = this._myUI.myShapeButtonBackgroundComponent.material;
            backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
        }

        {
            let textMaterial = this._myUI.myToolsButtonTextComponent.material;
            textMaterial.color = this._mySetup.myButtonDisabledTextColor;

            let backgroundMaterial = this._myUI.myToolsButtonBackgroundComponent.material;
            backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _visibilityUnHover(material) {
        if (this.myIsWidgetVisible) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }

    _pinUnHover(material) {
        if (this.myIsPinned) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }

    _shapeUnHover(material) {
        if (this._myCurrentSketchWidget == SketchWidgetType.SHAPE) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }
}

var SketchWidgetType = {
    NONE: 0,
    SHAPE: 1,
    TOOLS: 2,
};