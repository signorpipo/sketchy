WL.registerComponent('set-local-floor', {
}, {
    init: function () {
    },
    start: function () {
        if (WL.xrSession) {
            this._setupVREvents(WL.xrSession);
        } else {
            WL.onXRSessionStart.push(this._setupVREvents.bind(this));
        }
    },
    update: function (dt) {
    },
    _setupVREvents: function (session) {
        session.requestReferenceSpace('local-floor').then(function (refSpace) {
            WebXR._coordinateSystem = refSpace;
        });
    }
});