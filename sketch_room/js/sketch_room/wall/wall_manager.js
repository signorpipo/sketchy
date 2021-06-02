
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

        this._updateWalls();
    }

    _updateWalls() {
        let thickness = 0.1;
        let halfThickness = thickness / 2;

        let height = this._myWallSettings.myHeight;
        let width = this._myWallSettings.myWidth;
        let depth = this._myWallSettings.myDepth;

        let halfHeight = height / 2;
        let halfWidth = width / 2;
        let halfDepth = depth / 2;

        this._myWalls[WallType.FLOOR].setPosition([0, - halfThickness, 0]);
        this._myWalls[WallType.FLOOR].setScale([halfWidth, halfThickness, halfDepth]);

        this._myWalls[WallType.CEILING].setPosition([0, height + halfThickness, 0]);
        this._myWalls[WallType.CEILING].setScale([halfWidth, halfThickness, halfDepth]);

        this._myWalls[WallType.WEST].setPosition([-halfWidth - halfThickness, halfHeight, 0]);
        this._myWalls[WallType.WEST].setScale([halfThickness, halfHeight, halfDepth]);

        this._myWalls[WallType.EAST].setPosition([halfWidth + halfThickness, halfHeight, 0]);
        this._myWalls[WallType.EAST].setScale([halfThickness, halfHeight, halfDepth]);

        this._myWalls[WallType.NORTH].setPosition([0, halfHeight, halfDepth + halfThickness]);
        this._myWalls[WallType.NORTH].setScale([halfWidth, halfHeight, halfThickness]);

        this._myWalls[WallType.SOUTH].setPosition([0, halfHeight, -halfDepth - halfThickness]);
        this._myWalls[WallType.SOUTH].setScale([halfWidth, halfHeight, halfThickness]);

        this._myLightObject.setTranslationLocal([0, height - 0.5, 0]);
    }

    _createWalls() {
        let color = Colors[7];

        {
            let wall = new SketchWall(this._mySceneObject, WallType.FLOOR);
            wall.setColor(color);
            this._myWalls[WallType.FLOOR] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.CEILING);
            wall.setColor(color);
            this._myWalls[WallType.CEILING] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.WEST);
            wall.setColor(color);
            this._myWalls[WallType.WEST] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.EAST);
            wall.setColor(color);
            this._myWalls[WallType.EAST] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.NORTH);
            wall.setColor(color);
            this._myWalls[WallType.NORTH] = wall;
        }

        {
            let wall = new SketchWall(this._mySceneObject, WallType.SOUTH);
            wall.setColor(color);
            this._myWalls[WallType.SOUTH] = wall;
        }

        this._updateWalls();
    }

    save(data) {
        this._myWallSettings.save(data);

        for (let i = 0; i < this._myWalls.length; i++) {
            let color = this._myWalls[i].getColor();
            data.push(color[0]);
            data.push(color[1]);
            data.push(color[2]);
        }
    }

    load(data) {
        this._myWallSettings.load(data);

        for (let i = 0; i < this._myWalls.length; i++) {
            let color = [];
            color[0] = data.shift();
            color[1] = data.shift();
            color[2] = data.shift();
            color[3] = 1;
            this._myWalls[i].setColor(color);
        }
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