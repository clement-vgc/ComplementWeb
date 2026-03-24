class Tower {
    constructor(rawTower, relations = {}) {
        this.id = rawTower.id;
        this.typeId = rawTower.typeId;
        this.level = rawTower.level;
        this.name = rawTower.name;
        this.damage = rawTower.damage;
        this.attackSpeed = rawTower.attackSpeed;
        this.range = rawTower.range ?? null;
        this.cost = rawTower.cost;
        this.health = rawTower.health ?? null;
        this.armor = rawTower.armor ?? null;
        this.respawn = rawTower.respawn ?? null;
        this.image = rawTower.image;

        const typeById = relations.typeById || new Map();
        const skillsByTowerId = relations.skillsByTowerId || new Map();

        this.type = typeById.get(this.typeId) || null;
        this.typeName = this.type ? this.type.name : "Type inconnu";
        this.typeColor = this.type ? this.type.color : "#999999";
        this.imagePath = Tower.buildImagePath(this.typeId, this.image);

        this.skills = skillsByTowerId.get(this.id) || [];
    }

    get damageLabel() {
        if (Array.isArray(this.damage) && this.damage.length === 2) {
            return `${this.damage[0]}-${this.damage[1]}`;
        }

        return String(this.damage ?? "-");
    }

    get rangeLabel() {
        return this.range === null ? "-" : String(this.range);
    }

    get hasSkills() {
        return this.skills.length > 0;
    }

    static fromApi(rawTower, relations = {}) {
        return new Tower(rawTower, relations);
    }

    static buildRelations({ towerTypes = [], specialSkills = [], towerSkills = [] } = {}) {
        const typeById = new Map(towerTypes.map(type => [type.id, type]));
        const skillById = new Map(specialSkills.map(skill => [skill.id, skill]));
        const skillsByTowerId = new Map();

        for (const link of towerSkills) {
            const skill = skillById.get(link.skillId);

            if (!skill) {
                continue;
            }

            if (!skillsByTowerId.has(link.towerId)) {
                skillsByTowerId.set(link.towerId, []);
            }

            skillsByTowerId.get(link.towerId).push(skill);
        }

        return {
            typeById,
            skillsByTowerId
        };
    }

    static listFromApi(rawTowers = [], relations = {}) {
        return rawTowers.map(rawTower => Tower.fromApi(rawTower, relations));
    }

    static buildImagePath(typeId, imageName) {
        if (!imageName) {
            return null;
        }

        const folderByTypeId = {
            1: "archer",
            2: "infanterie",
            3: "mage",
            4: "artillerie"
        };

        const folder = folderByTypeId[typeId] || "archer";
        return `images/towers/${folder}/${imageName}`;
    }
}

export { Tower };
