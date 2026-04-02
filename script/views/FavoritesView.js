import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';
import { Enemy } from '../models/Enemy.js';
import { 
    getFavoriteTowerIds, getFavoriteEnemyIds, getFavoriteBossIds,
    isFavoriteTower, isFavoriteEnemy, isFavoriteBoss 
} from '../store/favoritesStore.js';

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

export default class FavoritesView {
    async render() {
        try {
            const favTowersIds = getFavoriteTowerIds();
            const favEnemiesIds = getFavoriteEnemyIds();
            const favBossesIds = getFavoriteBossIds();

            if (favTowersIds.length === 0 && favEnemiesIds.length === 0 && favBossesIds.length === 0) {
                return `
                    <section class="page page-favorites">
                        <h2>Mon Build</h2>
                        <article class="placeholder-card">
                            <h3>Ton arsenal est vide !</h3>
                            <p>Ajoute des tours ou des ennemis depuis l'Arsenal ou le Bestiaire pour préparer ton build.</p>
                        </article>
                    </section>`;
            }

            const [rawTowers, towerTypes, specialSkills, towerSkills, rawEnemies, rawBosses] = await Promise.all([
                api.getTowers(),
                api.getTowerTypes(),
                api.getSpecialSkills(),
                api.getTowerSkills(),
                api.getEnemies(),
                api.getBosses()
            ]);

            let html = `<section class="page page-favorites"><h2>Mon Build</h2>`;

            // --- SECTION TOURS ---
            if (favTowersIds.length > 0) {
                const relations = Tower.buildRelations({ towerTypes, specialSkills, towerSkills });
                const favoriteTowers = Tower.listFromApi(rawTowers, relations)
                    .filter(tower => isFavoriteTower(tower.id));

                if (favoriteTowers.length > 0) {
                    html += `<h3 class="fav-section-title">Mes Tours</h3>`;
                    html += `<div class="favorites-container" style="margin-bottom: 50px;">`; 
                    
                    favoriteTowers.forEach(tower => {
                        html += `
                            <article class="tower-detail-card" style="--tower-color: ${tower.typeColor}; margin-bottom: 20px;">
                                ${tower.imagePath ? `<img class="tower-detail-image" src="${tower.imagePath}" alt="${tower.name}">` : ''}
                                <div class="detail-content">
                                    <h3 class="tower-detail-title">${tower.name} <span>(Lvl ${tower.level})</span></h3>
                                    <p><strong>Type :</strong> ${tower.typeName}</p>
                                    <p style="font-size: 0.9em; color: var(--muted);"><em>${tower.typeDescription}</em></p>
                                    
                                    <div class="stats-grid">
                                        <div class="stat-item"><strong>Dégâts</strong><span>${tower.damageLabel}</span></div>
                                        <div class="stat-item"><strong>Vitesse</strong><span>${tower.attackSpeed}</span></div>
                                        ${tower.range ? `<div class="stat-item"><strong>Portée</strong><span>${tower.rangeLabel}</span></div>` : ''}
                                        ${tower.health ? `<div class="stat-item"><strong>PV</strong><span>${tower.health}</span></div>` : ''}
                                        ${tower.armor && tower.armor !== "None" ? `<div class="stat-item"><strong>Armure</strong><span>${tower.armor}</span></div>` : ''}
                                    </div>

                                    ${tower.hasSkills ? `
                                        <hr>
                                        <div class="skills-detail">
                                            ${tower.skills.map(skill => {
                                                const skillImg = this.getSkillImagePath(tower.typeId, skill.id);
                                                return `
                                                    <div class="skill-card" style="display: flex; align-items: center; gap: 15px; padding: 10px;">
                                                        ${skillImg ? `<img src="${skillImg}" alt="${skill.name}" style="width: 48px; height: 48px; object-fit: contain;">` : ''}
                                                        <div>
                                                            <h4 style="margin: 0; font-size: 1rem;">${skill.name}</h4>
                                                            <p style="margin: 4px 0 0; font-size: 0.85rem; line-height: 1.2;">${skill.description}</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    ` : ''}

                                    <button class="fav-btn remove-fav-btn" data-type="tower" data-id="${tower.id}" style="margin-top: 15px;">Retirer</button>
                                </div>
                            </article>`;
                    });
                    html += `</div>`;
                }
            }

            // --- SECTION ENNEMIS ---
            const enemies = Enemy.listFromApi(rawEnemies, { category: "enemy" }).filter(e => isFavoriteEnemy(e.id));
            const bosses = Enemy.listFromApi(rawBosses, { category: "boss" }).filter(b => isFavoriteBoss(b.id));
            const allFavCreatures = [...enemies, ...bosses];

            if (allFavCreatures.length > 0) {
                html += `<h3 class="fav-section-title">Mes ennemis</h3>`;
                html += `<div class="favorites-container">`;
                allFavCreatures.forEach(creature => {
                    const type = creature.category;
                    const color = type === "boss" ? "#d32f2f" : "var(--accent)";

                    html += `
                        <article class="tower-detail-card" style="border-left: 6px solid ${color}; margin-bottom: 20px;">
                            <div style="text-align: center;">
                                <img class="tower-detail-image" src="${creature.imageBigPath}" alt="${creature.name}" style="background: transparent; border: none;">
                            </div>
                            <div class="detail-content">
                                <h3 class="tower-detail-title" style="color: ${color};">${creature.name} ${type === "boss" ? '<span>(Boss)</span>' : ''}</h3>
                                <p style="font-size: 0.95em; color: var(--muted);"><em>${creature.description}</em></p>
                                
                                <div class="stats-grid">
                                    <div class="stat-item"><strong>PV</strong><span>${creature.health}</span></div>
                                    <div class="stat-item"><strong>Dégâts</strong><span>${creature.damage}</span></div>
                                    <div class="stat-item"><strong>Vitesse</strong><span>${creature.speed}</span></div>
                                    <div class="stat-item"><strong>Armure</strong><span>${creature.armor}</span></div>
                                    <div class="stat-item"><strong>Vies prises</strong><span>${creature.livesTaken}</span></div>
                                    <div class="stat-item"><strong>Récompense</strong><span>${creature.bounty}</span></div>
                                </div>

                                ${creature.abilities && creature.abilities.length > 0 ? `
                                    <hr>
                                    <h4>Capacités spéciales :</h4>
                                    <ul class="skills-list" style="color: ${color};">
                                        ${creature.abilities.map(a => `<li><strong>${a}</strong></li>`).join('')}
                                    </ul>
                                ` : ''}

                                <button class="fav-btn remove-fav-btn" data-type="${type}" data-id="${creature.id}" style="margin-top: 15px;">Retirer</button>
                            </div>
                        </article>`;
                });
                html += `</div>`;
            }

            return html + `</section>`;
        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement de ton build.</p>`;
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