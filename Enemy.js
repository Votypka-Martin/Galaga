class Enemy extends GameObject{
    constructor(image, level, path) {
        super(image);
        this.speed = 100  + 3 * level;
        this.path = this.createPath(path);
        this.maxHealth = 70 + 10 * level;
        this.health = this.maxHealth;
        this.damage = 9 + 3 * level;
        this.projectileSpeed = 100;
        this.startWaitTime = 3 - 0.1 * level;
        this.waitTime = this.startWaitTime;
        this.canFire = false;
        this.fired = false;
    }

    setTarget(target) {
        this.target = target;
    }

    setProjectileImage(projectileImage) {
        this.projectileImage = projectileImage;
    }

    fire() {
        if (this.canFire) {
            this.canFire = false;
            this.fired = true;
            let pPos = this.position.copy();

            let dir;
            if (this.target) {
                dir = this.target.copy();
                dir.subtract(this.position);
                dir.normalize();
            } else {
                dir = new Vector2(0, 1);
            }
            return new Projectile(this.projectileImage, pPos, this.damage, this.projectileSpeed, dir);
        }
        return null;
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    moveOnPath(dt) {
        if (this.position.isEqual(this.path.position)) {
            this.waitTime -= dt;
            if (this.waitTime < this.startWaitTime / 2 && !this.fired) {
                this.canFire = true;
            }
            if (this.waitTime < 0) {
                this.fired = false;
                this.waitTime = this.startWaitTime;
                this.path = this.path.child;
            }
        } else {
            this.position.lerp(this.path.position, this.speed * dt);
        }
    }

    createPath(path) {
        let startNode = new PathNode(path[0]);
        let pathNode = startNode;
        for (let i = 1; i < path.length; i++) {
            pathNode.setChild(new PathNode(path[i]));
            pathNode = pathNode.child;
        }
        pathNode.setChild(startNode);
        return startNode;
    }

    drawHealthBar(context) {
        let spritePosition = this.getSpritePosition();
        let barHeight = this.size.x / 17;
        context.fillStyle = "gray";
        context.fillRect(spritePosition.x, spritePosition.y - this.size.y * 0.3, this.size.x, barHeight);
        let red = (this.maxHealth - this.health) / this.maxHealth * 255;
        let green = this.health / this.maxHealth * 255;
        let color = "rgb(" + red + "," + green + ",0)";
        context.fillStyle = color;
        context.fillRect(spritePosition.x, spritePosition.y - this.size.y * 0.3, this.size.x * this.health / this.maxHealth, barHeight);
    }

    draw(context) {
        if (this.target) {
            this.angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x) - Math.PI / 2;
        }
        super.draw(context);
    }
}

class PathNode {
    constructor(position) {
        this.position = position;
    }

    setChild(child) {
        this.child = child;
    }
}