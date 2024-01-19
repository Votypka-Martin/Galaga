class Explosion {
    constructor(image, position, duration) {
        this.image = image;
        this.position = position;
        this.size = new Vector2(image.width, image.height);
        this.halfSize = this.size.copy();
        this.halfSize.divideByNumber(2);
        this.alpha = 1;
        this.duration = duration;
        this.done = false;
    }

    draw(constext, dt) {
        if (this.alpha < 0) {
            this.done = true;
            return;
        }
        constext.globalAlpha = this.alpha;
        constext.drawImage(this.image, this.position.x - this.halfSize.x, this.position.y - this.halfSize.y, this.size.x, this.size.y);
        constext.globalAlpha = 1;
        this.size.multiplyByNumber(1 + dt / this.duration);
        this.halfSize.multiplyByNumber(1 + dt / this.duration)
        this.alpha -= dt / this.duration;
    }
}