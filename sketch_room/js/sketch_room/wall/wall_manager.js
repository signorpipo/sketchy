
class WallManager {
    constructor(sceneObject, lightObject) {
        this._mySceneObject = sceneObject;
        this._myWallSettings = new WallSettings();
        this._myLightObject = lightObject;

        this._myWalls = [];
    }

    getWalls(type) {
        return this._myWalls;
    }

    getWallSettings() {
        return this._myWallSettings;
    }

    start() {
        this._createWalls();
    }

    update(dt) {
        for (let shape of this._myWalls) {
            shape.update(dt);
        }
    }

    _createWalls() {
        let thickness = 0.1;
        let halfThickness = thickness / 2;

        let height = this._myWallSettings.myHeight;
        let width = this._myWallSettings.myWidth;
        let depth = this._myWallSettings.myDepth;

        let halfHeight = height / 2;
        let halfWidth = width / 2;
        let halfDepth = depth / 2;

        let color = Colors[7];

        {
            let wall = new SketchWall(this._mySceneObject, WallType.FLOOR);
            wall.setPosition([0, - halfThickness, 0]);
            wall.setScale([halfWidth, halfThickness, halfDepth]);
            wall.setColor(color);

            this._myWalls[WallType.FLOOR] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.CEILING);
            wall.setPosition([0, height + halfThickness, 0]);
            wall.setScale([halfWidth, halfThickness, halfDepth]);
            wall.setColor(color);

            this._myWalls[WallType.CEILING] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.WEST);
            wall.setPosition([-halfWidth - halfThickness, halfHeight, 0]);
            wall.setScale([halfThickness, halfHeight, halfDepth]);
            wall.setColor(color);

            this._myWalls[WallType.WEST] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.EAST);
            wall.setPosition([halfWidth + halfThickness, halfHeight, 0]);
            wall.setScale([halfThickness, halfHeight, halfDepth]);
            wall.setColor(color);

            this._myWalls[WallType.EAST] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.NORTH);
            wall.setPosition([0, halfHeight, halfDepth + halfThickness]);
            wall.setScale([halfWidth, halfHeight, halfThickness]);
            wall.setColor(color);

            this._myWalls[WallType.NORTH] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.SOUTH);
            wall.setPosition([0, halfHeight, -halfDepth - halfThickness]);
            wall.setScale([halfWidth, halfHeight, halfThickness]);
            wall.setColor(color);

            this._myWalls[WallType.SOUTH] = wall;
        }

        this._myLightObject.setTranslationLocal([0, height - 0.5, 0]);
    }
}

var WallType = {
    FLOOR: 0,
    CEILING: 1,
    WEST: 2,
    EAST: 3,
    NORTH: 4,
    SOUTH: 5,
};