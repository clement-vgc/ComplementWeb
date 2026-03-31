import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';
import { Enemy } from '../models/Enemy.js';
import { getFavoriteTowerIds, getFavoriteEnemyIds, isFavoriteTower, isFavoriteEnemy } from '../store/favoritesStore.js';

export default class FavoritesView {
    async render() {
        try {
            const favTowersIds = getFavoriteTowerIds();
            const favEnemiesIds = getFavoriteEnemyIds();

            if (favTowersIds.length === 0 && favEnemiesIds.length === 0) {
                return `
                    <section class="page page-favorites">
                        <h2>Mon Build</h2>
                        <article class="placeholder-card">
                            <h3>Aucun favori pour le moment</h3>
                            <p>Ajoutez des tours ou des ennemis depuis l'Arsenal ou le Bestiaire.</p>
                        </article>
                    </section>
                `;
            }

            const [rawTowers, towerTypes, specialSkills, towerSkills, rawEnemies] = await Promise.all([
                api.getTowers(),
                api.getTowerTypes(),
                api.getSpecialSkills(),
                api.getTowerSkills(),
                api.getEnemies()
            ]);

            let html = `<section class="page page-favorites"><h2>Mon Build</h2>`;

            // --- ZONE TOURS ---
            if (favTowersIds.length > 0) {
                const relations = Tower.buildRelations({ towerTypes, specialSkills, towerSkills });
                const favoriteTowers = Tower.listFromApi(rawTowers, relations)
                    .filter(tower => isFavoriteTower(tower.id));

                if (favoriteTowers.length > 0) {
                    html += `<h3 class="fav-section-title">Mes Tours</h3>`;
                    html += `<div class="favorites-container" style="margin-bottom: 40px;">`; 
                    
                    favoriteTowers.forEach(tower => {
                        html += `
                            <article class="tower-card" style="--tower-color: ${tower.typeColor};">
                                ${tower.imagePath ? `<img class="tower-image" src="${tower.imagePath}" alt="${tower.name}">` : ''}
                                <h3 class="tower-title">${tower.name} <span>(Lvl ${tower.level})</span></h3>
                                <p><strong>Type :</strong> ${tower.typeName}</p>
                                
                                <p style="font-size: 0.9em; color: var(--muted); margin-top: -10px; margin-bottom: 15px;"><em>${tower.typeDescription}</em></p>
                                
                                <p><strong>Dégâts :</strong> ${tower.damageLabel}</p>
                                <p><strong>Vitesse d'attaque :</strong> ${tower.attackSpeed}</p>
                                
                                ${tower.range ? `<p><strong>Portée :</strong> ${tower.rangeLabel}</p>` : ''}
                                ${tower.health ? `<p><strong>PV :</strong> ${tower.health} | <strong>Armure :</strong> ${tower.armor}</p>` : ''}
                                
                                ${tower.hasSkills ? `
                                    <hr>
                                    <h4>Compétences :</h4>
                                    <ul class="skills-list">
                                        ${tower.skills.map(skill => `<li><strong>${skill.name}:</strong> ${skill.description}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                
                                <button class="fav-btn remove-fav-btn" data-type="tower" data-id="${tower.id}">Retirer des favoris</button>
                            </article>
                        `;
                    });
                    html += `</div>`;
                }
            }

            // --- ZONE ENNEMIS ---
            if (favEnemiesIds.length > 0) {
                const favoriteEnemies = Enemy.listFromApi(rawEnemies)
                    .filter(enemy => isFavoriteEnemy(enemy.id));

                if (favoriteEnemies.length > 0) {
                    html += `<h3 class="fav-section-title">Mes Ennemis</h3>`;
                    html += `<div class="favorites-container">`; 
                    
                    favoriteEnemies.forEach(enemy => {
                        html += `
                            <article class="enemy-card placeholder-card" style="border-left: 6px solid #d32f2f;">
                                <h3 class="enemy-title" style="color: #d32f2f;">${enemy.name}</h3>
                                
                                <p style="font-size: 0.9em; color: var(--muted); margin-bottom: 15px;"><em>${enemy.description}</em></p>
                                
                                <p><strong>Points de vie :</strong> ${enemy.health}</p>
                                <p><strong>Dégâts :</strong> ${enemy.damage}</p>
                                <p><strong>Vitesse :</strong> ${enemy.speed}</p>
                                <p><strong>Armure :</strong> ${enemy.armor} | <strong>Résistance magique :</strong> ${enemy.magicResistance}</p>
                                <p><strong>Prime :</strong> ${enemy.bounty} or | <strong>Vies prises :</strong> ${enemy.livesTaken}</p>
                                
                                <button class="fav-btn remove-fav-btn" data-type="enemy" data-id="${enemy.id}">Retirer des favoris</button>
                            </article>
                        `;
                    });
                    html += `</div>`;
                }
            }

            html += `</section>`;
            return html;

        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement des favoris.</p>`;
        }
    }
}