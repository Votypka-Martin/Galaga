class Projectile extends GameObject{
    constructor(image, position, damage, speed, moveDir) {
        super(image);
        this.damage = damage;
        this.position = position;
        this.collider.position = position;
        this.speed = speed;
        this.moveDir = moveDir;
    }
}