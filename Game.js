let canvas = document.createElement("canvas");
canvas.width = 700;
canvas.height = 700;
canvas.className = "Game";
document.body.appendChild(canvas);
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.font = "61px Arial";
context.textAlign = "center";
let lastTime = 0;

let imageLoader = new ImageLoader(onImageLoad, "playerShip.png", "playerProjectile.png", "enemy.png", "enemy1.png", "enemyProjectile1.png", "explosion-playerProjectile.png", "explosion-enemy.png", "background.png");
let player;
let enemies = [];
let gameStats = {money: 0, score: 0, level: 0, enemyCount: 4};
let background;
let menu;
let path = [new Vector2(100, 100), new Vector2(600, 300), new Vector2(600, 100), new Vector2(100, 299)];
let playerProjectiles = [];
let enemyProjectiles = [];
let explosions = [];
let keys = [];
let levelDone = false;
let gameOver = false;

let explosionSound = new Audio("explosion-sound.mp3");
let enemyProjectileExplosion = new Audio("enemy-projectile-explosion.mp3");
let shipExplosion = new Audio("ship-explosion.mp3");

function onImageLoad() {
    imageLoader.resizeImage("playerShip.png", 100, 100);
    imageLoader.resizeImage("playerProjectile.png", 20, 70);
    imageLoader.resizeImage("enemy.png", 100, 100);
    imageLoader.resizeImage("enemy1.png", 100, 100);
    imageLoader.resizeImage("enemyProjectile1.png", 30, 30);
    imageLoader.resizeImage("explosion-playerProjectile.png", 43, 43);
    imageLoader.resizeImage("explosion-enemy.png", 70, 70);
    imageLoader.resizeImage("background.png", canvas.width, canvas.height * 2);
    let playerImage = imageLoader.getImage("playerShip.png");
    let projectileImage = imageLoader.getImage("playerProjectile.png");
    player = new Player(playerImage);
    player.setProjectileImage(projectileImage);
    player.setColliderSize(new Vector2(50, 70));
    player.moveTo(new Vector2(canvas.width / 2, canvas.height / 2));
    background = new Background(imageLoader.getImage("background.png"));
    menu = new UpgradeMenu(player, gameStats);
    createEnemies(gameStats.enemyCount, gameStats.level);
    requestAnimationFrame(drawFrame);

    document.getElementById("nextLevelButton").onclick = () => {
        playerProjectiles = [];
        enemyProjectiles = [];
        player.moveTo(new Vector2(canvas.width / 2, canvas.height / 2));
        gameStats.level++;
        menu.hideMenu();
        if (gameStats.level % 2 == 0) gameStats.enemyCount++;
        createEnemies(gameStats.enemyCount, gameStats.level);
        levelDone = false;
    }
}

function createEnemies(count, level) {
    let enemyImage = imageLoader.getImage("enemy.png");
    let enemyImage1 = imageLoader.getImage("enemy1.png"); 
    let enemyProjectileImage = imageLoader.getImage("enemyProjectile1.png");
    let rows = Math.floor(count / 4);
    for (var i = 0; i < rows; i++) {
        let right = true;
        for (let j = 0; j < 4; j++) {
            if (j == 2) right = false;
            let enemy = new Enemy(enemyImage, level, getPath((j + 1) * canvas.width / 5, canvas.height / 5 * (i + 1), right));
            enemy.moveTo(new Vector2((j + 1) * canvas.width / 5, -canvas.height / 5 * (rows - i + 1)));
            enemy.setProjectileImage(enemyProjectileImage);
            enemies.push(enemy);
        }
    }

    let c = count % 4;
    let right = true;
    for (let k = 0; k < c; k++) {
        let pos = k % 2 == 0 ? k / 2 : 4 - k;
        let enemy = new Enemy(enemyImage1, level, getPath((pos + 1) * canvas.width / 5, canvas.height / 5  * (i + 1), right));
        enemy.moveTo(new Vector2((pos + 1) * canvas.width / 5, -canvas.height / 5));
        enemy.setProjectileImage(enemyProjectileImage);
        enemy.setTarget(player.position);
        enemies.push(enemy);
        right = !right;
    }
}

function getPath(x, y, right) {
    let m = right ? 1 : -1;
    return [new Vector2(x, y), new Vector2(x + (canvas.width / 5 * 2) * m, y + canvas.width / 5), new Vector2(x + (canvas.width / 5 * 2) * m, y), new Vector2(x, y + canvas.width / 5)];
}

document.onkeydown = (event) => {
    keys[event.key] = true;
}

document.onkeyup = (event) => {
    keys[event.key] = false;
}

function drawFrame(time) {
    let dt = (time - lastTime) / 1000;
    lastTime = time;
    handleInput();
    background.draw(context, dt);
    if (levelDone){ 
        requestAnimationFrame(drawFrame);
        return;
    }
    context.fillStyle = "white";
    context.font = "27px Arial";
    context.fillText("Score: " + gameStats.score + "   Credits: " + gameStats.money + "C" + "   Level: " + gameStats.level + "/15", canvas.width / 2, canvas.height / 21);
    drawPlayerProjectiles(dt);
    drawEnemyProjectiles(dt);
    drawAndMoveEnemies(dt);
    if (gameOver) {
        context.fillStyle = "white";
        context.font = "61px Arial";
        context.fillText("Press R to restart.", canvas.width / 2, canvas.height / 2);
    } else {
        handleCollisions();
        drawAndMovePlayer(dt);
    }
    drawExplosions(dt);
    requestAnimationFrame(drawFrame);
}

function drawExplosions(dt) {
    for (let i = 0; i < explosions.length; i++) {
        if (explosions[i].done) {
         explosions.splice(i, 1);
         i--;
        } else {
         explosions[i].draw(context, dt);
        } 
     }
}

function drawAndMoveEnemies(dt) {
    enemies.forEach(enemy => {
        enemy.moveOnPath(dt);
        enemy.draw(context);
        enemy.drawHealthBar(context);
        let projectile = enemy.fire();
        if (projectile != null) {
            enemyProjectiles.push(projectile);
        }
    });
}

function drawAndMovePlayer(dt) {
    player.moveBySpeed(dt);
    player.moveInBoundary(0, 0, canvas.width, canvas.height);
    player.draw(context);
    player.drawHealthBar(context);
}

function drawPlayerProjectiles(dt) {
    for (let i = 0; i < playerProjectiles.length; i++) {
        playerProjectiles[i].moveBySpeed(dt);
        if (playerProjectiles[i].outsideBoundary(0, 0, canvas.width, canvas.height)) {
            playerProjectiles.splice(i,1);
            i--;
        } else {
            playerProjectiles[i].draw(context);
        }
    }
}

function drawEnemyProjectiles(dt) {
    for (let i = 0; i < enemyProjectiles.length; i++) {
        enemyProjectiles[i].moveBySpeed(dt);
        if (enemyProjectiles[i].outsideBoundary(0, 0, canvas.width, canvas.height)) {
            enemyProjectiles.splice(i,1);
            i--;
        } else {
            enemyProjectiles[i].draw(context);
        }
    }
}

function handleCollisions() {
    for (let i = 0; i < enemyProjectiles.length; i++) {
        if (player.collidesWith(enemyProjectiles[i])) {
            playSound(enemyProjectileExplosion);
            player.takeDamage(enemyProjectiles[i].damage);
            if (player.health <= 0) {
                playSound(shipExplosion);
                gameOver = true;
                explosions.push(new Explosion(imageLoader.getImage("explosion-enemy.png"), player.position, 1));
            }
            explosions.push(new Explosion(imageLoader.getImage("enemyProjectile1.png"), enemyProjectiles[i].position, 1));
            enemyProjectiles.splice(i, 1);
            i--;
        }     
    }

    for (let i = 0; i < playerProjectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j].collidesWith(playerProjectiles[i])) {
                playSound(explosionSound);
                enemies[j].takeDamage(playerProjectiles[i].damage);
                if (enemies[j].health < 0) {
                    playSound(shipExplosion);
                    gameStats.money += 50;
                    gameStats.score += 50;
                    explosions.push(new Explosion(imageLoader.getImage("explosion-enemy.png"), enemies[j].position, 1));
                    enemies.splice(j, 1);
                    j--;
                    if (enemies.length == 0) {
                        playerProjectiles[i].position.y -= playerProjectiles[i].size.y / 2;
                        explosions.push(new Explosion(imageLoader.getImage("explosion-playerProjectile.png"), playerProjectiles[i].position, 1));
                        playerProjectiles.splice(i, 1);
                        i--;
                        if (gameStats.level == 15) {
                            gameOver = true;
                            return;
                        }
                        setTimeout(()=> {
                            levelDone = true;
                            menu.showMenu();
                        }, 1000);
                        return;
                    }
                }
                playerProjectiles[i].position.y -= playerProjectiles[i].size.y / 2;
                explosions.push(new Explosion(imageLoader.getImage("explosion-playerProjectile.png"), playerProjectiles[i].position, 1));
                playerProjectiles.splice(i, 1);
                i--;
                if (playerProjectiles.length == 0) return;
                break;
            }
        }
    }
}

function handleInput() {
    let dir = new Vector2(0, 0);
    if (keys["a"]) {
        dir.add(new Vector2(-1, 0));
    }
    if (keys["d"]) {
        dir.add(new Vector2(1, 0));
    }
    if (keys["w"]) {
        dir.add(new Vector2(0, -1));
    }
    if (keys["s"]) {
        dir.add(new Vector2(0, 1));
    }
    if (keys[" "]) {
        let projectile = player.fire();
        if (projectile != null) {
            playerProjectiles.push(projectile);
        }
    }
    if (keys["r"]) {
        gameStats.level = 0;
        gameStats.enemyCount = 4;
        player.resetToDefault();
        player.moveTo(new Vector2(canvas.width / 2, canvas.height / 2));
        gameStats.money = 0;
        gameStats.score = 0;
        menu.reset();
        enemies = [];
        createEnemies(gameStats.enemyCount, gameStats.level);
        playerProjectiles = [];
        enemyProjectiles = [];
        gameOver = false;
    }
    dir.normalize();
    player.setTargetDir(dir);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}