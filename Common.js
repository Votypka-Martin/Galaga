class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isEqual(other) {
        return this.x == other.x && this.y == other.y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
    }

    multiplyByNumber(n) {
        this.x *= n;
        this.y *= n;
    }

    divideByNumber(n) {
        this.x /= n;
        this.y /= n;
    }

    divide(other) {
        this.x /= other.x;
        this.y /= other.y;
    }

    normalize() {
        if (this.x == 0 && this.y == 0) return;
        let size = this.getSize();
        this.x /= size;
        this.y /= size;
    }

    getSize() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lerp(target, amount) {
        let dir = target.copy();
        dir.subtract(this);
        let size = dir.getSize();
        if (size < amount) {
            this.x = target.x;
            this.y = target.y;
        } else {
            dir.divideByNumber(size);
            dir.multiplyByNumber(amount);
            this.add(dir);
        }
    }
}

class ImageLoader {
    constructor(afterLoad ,...images) {
        this.images = [];
        this.imagesToLoad = images.length;
        this.loadedImages = 0;
        this.afterLoad = afterLoad;
        for (let imageName of images) {
            let image = new Image();
            image.onload = this.#onLoad.bind(this);
            image.src = imageName;
            this.images[imageName] = image;
        }
    }

    #onLoad() {
        this.loadedImages++;
        if (this.loadedImages == this.imagesToLoad) {
            this.afterLoad();
        }
    }

    getImage(name) {
        return this.images[name];
    }

    resizeImage(name, width, height) {
        let original = this.images[name];
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.drawImage(original, 0, 0, width, height);
        this.images[name] = canvas;
    }
}