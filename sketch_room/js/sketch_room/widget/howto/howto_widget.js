class HowToWidget {
    constructor() {
        this._myAdditionalSetup = null;
        this._mySetup = new HowToWidgetSetup();
        this._myUI = new HowToWidgetUI();

        this._myIsVisible = false;
    }

    setSelectedShape(shape) {
    }

    setSelectedTool(toolType) {
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
    }

    isUsingThumbstick() {
        return false;
    }

    update(dt) {
    }
}