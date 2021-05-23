var SketchShapeData = {
    myCubeMesh: null,
    myMaterial: null,
    myCollisionGroup: 0
};

var PlayerPose = {
    myHeadTransform: [0, 0, 0.1, 0, 0, 0, 1],
    myHeadPosition: [0, 0, 0],
    myHeadRotation: [0, 0, 0, 1],
    myLeftHandTransform: [0, 0, 0.1, 0, 0, 0, 1],
    myLeftHandPosition: [0, 0, 0],
    myLeftHandRotation: [0, 0, 0, 1],
    myRightHandTransform: [0, 0, 0.1, 0, 0, 0, 1],
    myRightHandPosition: [0, 0, 0],
    myRightHandRotation: [0, 0, 0, 1]
};

var HandCursor = {
    myLeftCursor: null,
    myRightCursor: null
};

var CurrentToolType = null;