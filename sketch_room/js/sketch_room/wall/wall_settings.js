
class WallSettings {
    constructor() {
        this.myHeight = 4;
        this.myWidth = 5;
        this.myDepth = 5;
    }

    save(data) {
        data.push(this.myHeight);
        data.push(this.myWidth);
        data.push(this.myDepth);
    }

    load(data) {
        this.myHeight = data.shift();
        this.myWidth = data.shift();
        this.myDepth = data.shift();
    }
}