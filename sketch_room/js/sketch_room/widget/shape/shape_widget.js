class ShapeWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myAdditionalSetup = null;

        this._myWidgets = [];

        this._mySelectedShape = null;

        this._myIsVisible = false;
    }

    setSelectedShape(shape) {
        if (this._myIsVisible) {
            for (let widget of this._myWidgets) {
                if (widget) {
                    widget.setVisible(false);
                    widget.setSelectedShape(shape);
                }
            }

            if (shape) {
                this._myWidgets[shape.getType()].setVisible(true);
                this._myWidgets[shape.getType()].setSelectedShape(shape);
            }
        }

        this._mySelectedShape = shape;
    }

    setSelectedTool(toolType) {
    }

    setVisible(visible) {
        if (!visible) {
            for (let widget of this._myWidgets) {
                if (widget) {
                    widget.setVisible(false);
                }
            }
        } else if (this._mySelectedShape) {
            this._myWidgets[this._mySelectedShape.getType()].setVisible(true);
            this._myWidgets[this._mySelectedShape.getType()].setSelectedShape(this._mySelectedShape);
        }

        this._myIsVisible = visible;
    }


    isUsingThumbstick() {
        let isUsing = false;

        for (let widget of this._myWidgets) {
            if (widget) {
                isUsing = isUsing || widget.isUsingThumbstick();
            }
        }

        return isUsing;
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._initializeWidgets(parentObject);
    }

    update(dt) {
        for (let widget of this._myWidgets) {
            if (widget) {
                widget.update(dt);
            }
        }
    }

    _initializeWidgets(parentObject) {
        this._myWidgets[ShapeType.BOX] = new BoxShapeWidget(this._myToolSettings);
        this._myWidgets[ShapeType.WALL] = new WallShapeWidget(this._myToolSettings);

        for (let widget of this._myWidgets) {
            if (widget) {
                widget.start(parentObject, this._myAdditionalSetup);
                widget.setVisible(false);
            }
        }
    }
}