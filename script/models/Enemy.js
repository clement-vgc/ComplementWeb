class Enemy {
    constructor(rawEnemy = {}, options = {}) {
        this.id = Number(rawEnemy.id);
        this.name = rawEnemy.name || "Unknown Enemy";
        this.category = options.category || "enemy";
        this.health = rawEnemy.health ?? rawEnemy.hp ?? null;
        this.hp = rawEnemy.hp ?? rawEnemy.health ?? null;
        this.armor = rawEnemy.armor ?? null;
        this.speed = rawEnemy.speed ?? null;
        this.magicResistance = rawEnemy.magicResistance ?? null;
        this.damage = rawEnemy.damage ?? null;
        this.attackRate = rawEnemy.attackRate ?? null;
        this.livesTaken = rawEnemy.livesTaken ?? 1;
        this.bounty = rawEnemy.bounty ?? rawEnemy.gold ?? 0;
        this.description = rawEnemy.description || "";
        
        this.abilities = rawEnemy.abilities || [];

        this.image = rawEnemy.image || null;
        this.imageBig = rawEnemy.imageBig || null;
        this.imagePath = Enemy.buildImagePath(this.category, this.image, false);
        this.imageBigPath = Enemy.buildImagePath(this.category, this.imageBig, true);
    }

    get hpByDifficulty() {
        if (!this.hp || typeof this.hp !== "string") return null;
        const [normal, veteran, impossible] = this.hp.split("/");
        return { normal, veteran, impossible };
    }

    static fromApi(rawEnemy, options = {}) {
        return new Enemy(rawEnemy, options);
    }

    static listFromApi(rawEnemies = [], options = {}) {
        return rawEnemies.map(rawEnemy => Enemy.fromApi(rawEnemy, options));
    }

    static buildImagePath(category, imageName, isBig = false) {
        if (!imageName) return null;
        const typeFolder = category === "boss" ? "bosses" : "ennemies"; 
        const sizeFolder = isBig ? "big" : "small";
        return `/images/${typeFolder}/${sizeFolder}/${imageName}`;
    }
}

export { Enemy };