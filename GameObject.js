class GameObject {
    constructor(image) {
        this.image = image;
        this.size = new Vector2(image.width, image.height);
        this.halfSize = this.size.copy();
        this.halfSize.divideByNumber(2);
        this.position = new Vector2(0, 0);
        this.collider = new RectCollider(this.position, this.size, new Vector2(0, 0));
        this.speed = 110;
        this.moveDir = new Vector2(0, 0);
        this.lastPosition = this.position.copy();
        this.angle = 0;
    }

    setColliderSize(size) {
        this.collider.setSize(size);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setMoveDir(dir) {
        this.moveDir = dir;
    }

    moveBy(other) {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x += other.x;
        this.position.y += other.y;
    }

    moveTo(other) {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x = other.x;
        this.position.y = other.y;
    }

    moveToLastPosition() {
        this.position.x = this.lastPosition.x;
        this.position.y = this.lastPosition.y;
    }

    moveInBoundary(x, y, w, h) {
        let spritePosition = this.position.copy();
        spritePosition.subtract(this.halfSize);
        if (spritePosition.x < x) {
            this.moveDir.x = 0;
            this.position.x = this.halfSize.x;
        }
        if (spritePosition.y < y) {
            this.moveDir.y = 0;
            this.position.y = this.halfSize.y;
        }
        if (spritePosition.x + this.size.x > w) {
            this.moveDir.x = 0;
            this.position.x = w - this.halfSize.x;
        }
        if (spritePosition.y + this.size.y > h) {
            this.moveDir.y = 0;
            this.position.y = h - this.halfSize.y;
        }
        
    }

    moveBySpeed(dt) {
        let m = this.moveDir.copy();
        m.multiplyByNumber(dt * this.speed);
        this.moveBy(m);
    }

    collidesWith(object) {
        return this.collider.collidesWith(object.collider);
    }
    
    draw(context) {
        if (this.angle == 0) {
            context.drawImage(this.image, this.position.x - this.halfSize.x, this.position.y - this.halfSize.y);
        } else {
            context.translate(this.position.x, this.position.y);
            context.rotate(this.angle);
            context.drawImage(this.image,-this.halfSize.x,-this.halfSize.y);
            context.resetTransform();
        }
    }

    inBoundary(x, y, w, h) {
        let spritePosition = this.getSpritePosition();
        return spritePosition.x >= x && spritePosition.y >= y && spritePosition.x + this.size.x <= w && spritePosition.y + this.size.y <= h;
    }

    outsideBoundary(x, y, w, h) {
        let spritePosition = this.getSpritePosition();
        return spritePosition.x + this.size.x < x || spritePosition.y + this.size.y < y || spritePosition.x > w || spritePosition.y > h;
    }

    getSpritePosition() {
        let spritePosition = this.position.copy();
        spritePosition.subtract(this.halfSize);
        return spritePosition;
    }
}