class BoxShapeWidget {
    constructor() {
        this._myAdditionalSetup = null;
        this._mySetup = new BoxShapeWidgetSetup();
        this._myUI = new BoxShapeWidgetUI();

        this._mySelectedShape = null;
        this._myIsVisible = false;
    }

    setSelectedShape(shape) {
        this._mySelectedShape = shape;
        this._refreshShapeData();
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
        if (visible) {
            this._refreshShapeData();
        }
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._addListeners();
    }

    isUsingThumbstick() {
        return false;
    }

    update(dt) {
        if (this._myIsVisible) {
            this._updateGamepad(dt);
            this._refreshShapeData();
        }
    }

    _updateGamepad(dt) {
        //change size on thumbstick
    }

    _refreshShapeData() {

    }

    _addListeners() {
        //hover size for gamepad stuff
        //color stuff
    }
}