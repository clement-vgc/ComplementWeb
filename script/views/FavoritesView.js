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
                        <p>Aucun favori pour le moment. Ajoutez des tours ou des ennemis depuis l'Arsenal ou le Bestiaire.</p>
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

            // --- AFFICHAGE DES TOURS ---
            if (favTowersIds.length > 0) {
                const relations = Tower.buildRelations({ towerTypes, specialSkills, towerSkills });
                
                const favoriteTowers = Tower.listFromApi(rawTowers, relations)
                    .filter(tower => isFavoriteTower(tower.id));

                if (favoriteTowers.length > 0) {
                    html += `<h3 class="fav-section-title">Mes Tours</h3><div class="towers-container">`;
                    favoriteTowers.forEach(tower => {
                        html += `
                            <article class="tower-card" style="--tower-color: ${tower.typeColor};">
                                ${tower.imagePath ? `<img class="tower-image" src="${tower.imagePath}" alt="${tower.name}">` : ''}
                                <h3 class="tower-title">${tower.name}</h3>
                                <p><strong>Dégâts :</strong> ${tower.damageLabel}</p>
                                <button class="fav-btn remove-fav-btn" data-type="tower" data-id="${tower.id}">Retirer</button>
                            </article>
                        `;
                    });
                    html += `</div>`;
                }
            }

            // --- AFFICHAGE DES ENNEMIS ---
            if (favEnemiesIds.length > 0) {
                
                const favoriteEnemies = Enemy.listFromApi(rawEnemies)
                    .filter(enemy => isFavoriteEnemy(enemy.id));

                if (favoriteEnemies.length > 0) {
                    html += `<h3 class="fav-section-title">Mes Ennemis</h3><div class="enemies-container">`;
                    favoriteEnemies.forEach(enemy => {
                        html += `
                            <article class="enemy-card">
                                <h3 class="enemy-title">${enemy.name}</h3>
                                <p>${enemy.description}</p>
                                <button class="fav-btn remove-fav-btn" data-type="enemy" data-id="${enemy.id}">Retirer</button>
                            </article>
                        `;
                    });
                    html += `</div>`;
                }
            }

            html += `</section>`;
            return html;

        } catch (error) {
            console.error("Erreur dans FavoritesView:", error);
            return `<p>Une erreur est survenue lors du chargement de vos favoris.</p>`;
        }
    }
}