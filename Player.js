class Player extends GameObject {
    constructor(image) {
        super(image);
        this.targetDir = new Vector2(0, 0);
        this.resetToDefault();
    }

    setProjectileImage(image) {
        this.projectileImage = image;
    }

    setTargetDir(targetDir) {
        this.targetDir = targetDir;
    }

    moveBySpeed(dt) {
        if (!this.moveDir.isEqual(this.targetDir)) {
            this.moveDir.lerp(this.targetDir, dt * this.acceleration);
        }
        super.moveBySpeed(dt);
    }

    resetToDefault() {
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.damage = 11;
        this.fireInterval = 0.7;
        this.lastTime = 0;
        this.projectileSpeed = -3;
        this.acceleration = 2.1;
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    fire() {
        let currentTime = performance.now() / 1000;
        if (currentTime - this.lastTime > this.fireInterval) {
            this.lastTime = currentTime;
            let pPos = this.position.copy();
            pPos.y -= this.projectileImage.height / 2;
            return new Projectile(this.projectileImage, pPos, this.damage, 210, new Vector2(0, this.projectileSpeed));
        }
        return null;
    }

    drawHealthBar(context) {
        let spritePosition = this.getSpritePosition();
        let barHeight = this.size.x / 17;
        context.fillStyle = "gray";
        context.fillRect(spritePosition.x, spritePosition.y + this.size.y * 1.1, this.size.x, barHeight);
        let red = (this.maxHealth - this.health) / this.maxHealth * 255;
        let green = this.health / this.maxHealth * 255;
        let color = "rgb(" + red + "," + green + ",0)";
        context.fillStyle = color;
        context.fillRect(spritePosition.x, spritePosition.y + this.size.y * 1.1, this.size.x * this.health / this.maxHealth, barHeight);
    }
}