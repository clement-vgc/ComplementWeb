import { api } from '../api/api.js';
import { Enemy } from '../models/Enemy.js';
import { isFavoriteEnemy, isFavoriteBoss } from '../store/favoritesStore.js';

export default class EnemiesView {
    async render() {
        try {
            const { enemies: rawEnemies, bosses: rawBosses } = await api.getEnemiesAndBosses();

            const enemies = Enemy.listFromApi(rawEnemies, { category: "enemy" });
            const bosses = Enemy.listFromApi(rawBosses, { category: "boss" });

            let html = `
                <section class="page page-enemies">
                    <h2>Bestiaire</h2>
                    <p class="section-subtitle">Apprenez à connaître vos adversaires pour mieux les écraser.</p>

                    <h3 class="fav-section-title">Ennemis de base</h3>
                    <div class="towers-container"> `;

            enemies.forEach(enemy => {
                html += this._renderEnemyCard(enemy, "enemy");
            });

            html += `
                    </div>

                    <h3 class="fav-section-title" style="margin-top: 40px; color: #d32f2f;">Boss Légendaires</h3>
                    <div class="towers-container">
            `;

            bosses.forEach(boss => {
                html += this._renderEnemyCard(boss, "boss");
            });

            html += `
                    </div>
                </section>
            `;

            return html;

        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement du bestiaire. L'API tourne-t-elle ?</p>`;
        }
    }

    _renderEnemyCard(enemy, type) {
        const borderStyle = type === "boss" ? "border: 2px solid #d32f2f;" : "";
        const titleStyle = type === "boss" ? "color: #d32f2f;" : "color: var(--accent);";
        
        const isFavorite = type === "boss" ? isFavoriteBoss(enemy.id) : isFavoriteEnemy(enemy.id);

        return `
            <article class="tower-card" style="${borderStyle} display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: space-between;">
                <div>
                    ${enemy.imagePath ? `<img class="tower-image" src="${enemy.imagePath}" alt="${enemy.name}" style="max-width: 100px; height: auto; border: none; background: transparent; box-shadow: none;">` : ''}
                    <h3 style="${titleStyle} margin-top: 10px;">${enemy.name}</h3>
                    <p style="font-size: 0.9em; color: var(--muted); margin-bottom: 20px;"><em>${enemy.description}</em></p>
                </div>
                
                <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                    <a href="/${type}/${enemy.id}" class="voir-detail-btn" data-link>Voir les détails</a>
                    <button class="fav-btn ${isFavorite ? 'is-favorite' : ''}" 
                            data-type="${type}" data-id="${enemy.id}"> 
                        ${isFavorite ? 'Retirer' : 'Ajouter'}
                    </button>
                </div>
            </article>
        `;
    }
}