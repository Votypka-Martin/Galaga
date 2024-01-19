class RectCollider {
    constructor(position, size, offset) {
        this.position = position;
        this.size = size;
        this.halfSize = size.copy();
        this.halfSize.divideByNumber(2);
        this.offset = offset;
        this.offset.subtract(this.halfSize);
    }

    setSize(size) {
        this.size = size;
        this.offset.add(this.halfSize);
        this.halfSize = size.copy();
        this.halfSize.divideByNumber(2);
        this.offset.subtract(this.halfSize);
    }

    collidesWith(other) {
        let x1 = this.position.x + this.offset.x;
        let x2 = other.position.x + other.offset.x;
        let y1 = this.position.y + this.offset.y;
        let y2 = other.position.y + other.offset.y;
        return (
            x1 + this.size.x > x2 &&
            x2 + other.size.x > x1 &&
            y1 + this.size.y > y2 &&
            y2 + other.size.y > y1
            );
    }

    draw(context) {
        context.globalAlpha = 0.3;
        context.fillStyle = "white";
        context.fillRect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size.x, this.size.y)
        context.globalAlpha = 1;
    }
}