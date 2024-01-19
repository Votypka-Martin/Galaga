class UpgradeMenu {
    constructor(player, gameStats) {
        this.player = player;
        this.gameStats = gameStats;
        this.menu = document.getElementById("menu");
        let menuImage = document.getElementById("menuImage");
        menuImage.appendChild(player.image);
        this.playerStatsLabel = document.getElementById("playerStatsLabel");
        this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";

        this.damageButton = document.getElementById("damageUpgrade");
        this.healthButton = document.getElementById("healthUpgrade");
        this.speedButton = document.getElementById("speedUpgrade");
        this.fireRateButton = document.getElementById("fireRateUpgrade");
        this.repairButton = document.getElementById("repair");

        this.damageButton.onclick = this.damageUpgrade.bind(this);
        this.healthButton.onclick = this.healthUpgrade.bind(this);
        this.speedButton.onclick = this.speedUpgrade.bind(this);
        this.fireRateButton.onclick = this.fireRateUpgrade.bind(this);
        this.repairButton.onclick = this.repair.bind(this);

        this.reset();
    }

    reset() {
        this.damageCost = 100;
        this.healthCost = 100;
        this.speedCost = 100;
        this.fireRateCost = 100;
        this.repairCost = 100;
        this.damageButton.value = this.damageCost + "C"
        this.healthButton.value = this.healthCost + "C"
        this.speedButton.value = this.speedCost + "C"
        this.fireRateButton.value = this.fireRateCost + "C"
    }

    hideMenu() {
        this.menu.style.display = "none";
    }

    showMenu() {
        this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        this.menu.style.display = "block";
    }

    damageUpgrade() {
        if (this.damageCost <= this.gameStats.money) {
            this.gameStats.money -= this.damageCost;
            this.damageCost += 20;
            this.damageButton.value = this.damageCost + "C"
            this.player.damage += 3;
            this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        }
    }

    healthUpgrade() {
        if (this.healthCost <= this.gameStats.money) {
            this.gameStats.money -= this.healthCost;
            this.healthCost += 20;
            this.healthButton.value = this.healthCost + "C"
            this.player.maxHealth += 15;
            this.player.health += 15;
            this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        }
    }

    speedUpgrade() {
        if (this.speedCost <= this.gameStats.money) {
            this.gameStats.money -= this.speedCost;
            this.speedCost += 20;
            this.speedButton.value = this.speedCost + "C"
            this.player.speed += 10;
            this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        }
    }

    fireRateUpgrade() {
        if (this.fireRateCost <= this.gameStats.money) {
            if (this.player.fireInterval < 0.1) return;
            this.gameStats.money -= this.fireRateCost;
            this.fireRateCost += 20;
            this.fireRateButton.value = this.fireRateCost + "C"
            this.player.fireInterval *= 0.9;
            this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        }
    }
    
    repair() {
        if (this.repairCost <= this.gameStats.money) {
            this.gameStats.money -= this.repairCost;
            this.player.health = this.player.maxHealth;
            this.playerStatsLabel.innerHTML = "Credits: " + gameStats.money  + "C";
        }
    }
}
