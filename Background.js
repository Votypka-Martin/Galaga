class Background {
    constructor(image) {
        this.image = image;
        this.size = new Vector2(image.width, image.height / 2);
        this.position = new Vector2(0, this.size.y);
        this.speed = 43;
    }

    draw(constext, dt) {
        constext.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y, 0, 0, this.size.x, this.size.y);
        this.position.y -= dt * this.speed;
        if (this.position.y < 0) this.position.y = this.size.y;
    }
}