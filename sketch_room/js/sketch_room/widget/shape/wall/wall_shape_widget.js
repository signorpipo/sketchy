class WallShapeWidget extends BoxShapeWidget {
    constructor(toolSettings) {
        super(toolSettings);
    }

    start(parentObject, additionalSetup) {
        super.start(parentObject, additionalSetup);
        this._myUI.myShapeTypeLabelTextComponent.text = "Wall";
    }

    _updateGamepad(dt) {
    }


    _sizeHover(labelTextComponent, valueTextComponent) {
    }

    _sizeUnHover(labelTextComponent, valueTextComponent) {
    }
}