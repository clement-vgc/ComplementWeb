class Enemy {
    constructor(rawEnemy = {}, options = {}) {
        this.id = rawEnemy.id;
        this.name = rawEnemy.name || "Unknown Enemy";
        this.category = options.category || "enemy";
        this.type = rawEnemy.type || this.category;
        this.health = rawEnemy.health ?? rawEnemy.hp ?? null;
        this.hp = rawEnemy.hp ?? rawEnemy.health ?? null;
        this.armor = rawEnemy.armor ?? null;
        this.speed = rawEnemy.speed ?? null;
        this.magicResistance = rawEnemy.magicResistance ?? null;
        this.damage = rawEnemy.damage ?? null;
        this.attackRate = rawEnemy.attackRate ?? null;
        this.livesTaken = rawEnemy.livesTaken ?? 1;
        this.bounty = rawEnemy.bounty ?? rawEnemy.gold ?? 0;
        this.gold = this.bounty;
        this.image = rawEnemy.image || null;
        this.description = rawEnemy.description || "";
    }

    get hpByDifficulty() {
        if (!this.hp || typeof this.hp !== "string") {
            return null;
        }

        const [normal, veteran, impossible] = this.hp.split("/");
        return {
            normal: normal || null,
            veteran: veteran || null,
            impossible: impossible || null
        };
    }

    static fromApi(rawEnemy, options = {}) {
        return new Enemy(rawEnemy, options);
    }

    static listFromApi(rawEnemies = [], options = {}) {
        return rawEnemies.map(rawEnemy => Enemy.fromApi(rawEnemy, options));
    }
}

export { Enemy };
