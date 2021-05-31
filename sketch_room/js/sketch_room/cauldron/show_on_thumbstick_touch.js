WL.registerComponent('show_on_thumbstick_touch', {
}, {
    init: function () {
    },
    start: function () {
        this.object.scale([0, 0, 0]);
        this.object.setTranslationLocal([0, -7777, 0]);
    },
    update: function (dt) {
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isTouchStart()) {
            //this.object.resetScaling();
            //this.object.resetTransform();

        } else if (PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isTouchEnd()) {
            this.object.scale([0, 0, 0]);
            this.object.setTranslationLocal([0, -7777, 0]);
        }
    },
});