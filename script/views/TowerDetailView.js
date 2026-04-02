import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';
import { isFavoriteTower, toggleFavoriteTower } from '../store/favoritesStore.js';

const abilityFolderByTypeId = {
    1: 'archer',
    2: 'infanterie',
    3: 'mage',
    4: 'artillerie'
};

const abilityFileBySkillId = {
    1: 'PoisonArrow.webp',
    2: 'WrathForest.webp',
    3: 'SniperShot.webp',
    4: 'Shrapnel.webp',
    5: 'HealingLight.webp',
    6: 'HolyStrike.webp',
    7: 'ShieldValour.webp',
    8: 'ThrowAxes.webp',
    9: 'HuntingNets.webp',
    10: 'MoreAxes.webp',
    11: 'DeathRay.webp',
    12: 'Teleport.webp',
    13: 'Polymorph.webp',
    14: 'SummonElement.webp',
    15: 'DragonBreath.webp',
    16: 'ClusterBomb.webp',
    17: 'SuperCharge.webp',
    18: 'Overcharge.webp'
};

export default class TowerDetailView {
    constructor(towerId) {
        this.towerId = Number(towerId);
    }

    async render() {
        try {
            const [rawTowers, towerTypes, specialSkills, towerSkills] = await Promise.all([
                api.getTowers(),
                api.getTowerTypes(),
                api.getSpecialSkills(),
                api.getTowerSkills()
            ]);

            const relations = Tower.buildRelations({ towerTypes, specialSkills, towerSkills });
            const towers = Tower.listFromApi(rawTowers, relations);
            
            const tower = towers.find(t => t.id === this.towerId);
            
            if (!tower) {
                return `<p>Tour non trouvée.</p>`;
            }

            const isFavorite = isFavoriteTower(tower.id);

            return `
                <section class="page page-tower-detail">
                    <div class="detail-header">
                        <a href="/towers" class="back-btn" data-link>← Retour à l'arsenal</a>
                    </div>

                    <article class="tower-detail-card" style="--tower-color: ${tower.typeColor};">
                        ${tower.imagePath ? `<img class="tower-detail-image" src="${tower.imagePath}" alt="${tower.name}">` : ''}
                        
                        <div class="detail-content">
                            <h2 class="tower-detail-title">${tower.name} <span>(Lvl ${tower.level})</span></h2>
                            
                            <p><strong>Type :</strong> ${tower.typeName}</p>
                            <p style="font-size: 0.95em; color: var(--muted); margin-top: -5px; margin-bottom: 20px;"><em>${tower.typeDescription}</em></p>
                            
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <strong>Dégâts</strong>
                                    <span>${tower.damageLabel}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Vitesse d'attaque</strong>
                                    <span>${tower.attackSpeed}</span>
                                </div>
                                ${tower.range ? `
                                    <div class="stat-item">
                                        <strong>Portée</strong>
                                        <span>${tower.rangeLabel}</span>
                                    </div>
                                ` : ''}
                                ${tower.health ? `
                                    <div class="stat-item">
                                        <strong>PV</strong>
                                        <span>${tower.health}</span>
                                    </div>
                                ` : ''}
                                ${tower.armor ? `
                                    <div class="stat-item">
                                        <strong>Armure</strong>
                                        <span>${tower.armor}</span>
                                    </div>
                                ` : ''}
                                ${tower.cost ? `
                                    <div class="stat-item">
                                        <strong>Coût</strong>
                                        <span>${tower.cost}</span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            ${tower.hasSkills ? `
                                <hr>
                                <h3>Compétences spéciales</h3>
                                <div class="skills-detail">
                                    ${tower.skills.map(skill => `
                                        <div class="skill-card">
                                            ${this.getSkillImagePath(tower.typeId, skill.id)
                                                ? `<img class="skill-image" src="${this.getSkillImagePath(tower.typeId, skill.id)}" alt="${skill.name}">`
                                                : ''}
                                            <h4>${skill.name}</h4>
                                            <p>${skill.description}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <button class="fav-btn ${isFavorite ? 'is-favorite' : ''}" data-type="tower" data-id="${tower.id}" type="button">
                                ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </button>
                        </div>
                    </article>
                </section>
            `;

        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement de la tour.</p>`;
        }
    }

    getSkillImagePath(typeId, skillId) {
        const folder = abilityFolderByTypeId[typeId];
        const fileName = abilityFileBySkillId[skillId];

        if (!folder || !fileName) {
            return null;
        }

        return `/images/abilities/${folder}/${fileName}`;
    }
}
