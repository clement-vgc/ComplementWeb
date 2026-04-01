import { api } from '../api/api.js';
import { Enemy } from '../models/Enemy.js';
import { isFavoriteEnemy, isFavoriteBoss } from '../store/favoritesStore.js';

export default class EnemyDetailView {
    constructor(enemyId) {
        this.enemyId = Number(enemyId);
        this.isBossRoute = window.location.pathname.startsWith('/boss');
    }

    async render() {
        try {
            const { enemies: rawEnemies, bosses: rawBosses } = await api.getEnemiesAndBosses();
            const enemies = Enemy.listFromApi(rawEnemies, { category: "enemy" });
            const bosses = Enemy.listFromApi(rawBosses, { category: "boss" });
            
            let enemy = this.isBossRoute 
                ? bosses.find(b => b.id === this.enemyId) 
                : enemies.find(e => e.id === this.enemyId);

            if (!enemy) return `<section class="page"><p>Créature non trouvée.</p></section>`;

            const type = enemy.category;
            const isFavorite = type === "boss" ? isFavoriteBoss(enemy.id) : isFavoriteEnemy(enemy.id);
            const colorTheme = type === "boss" ? "#d32f2f" : "var(--accent)";

            return `
                <section class="page page-tower-detail">
                    <div class="detail-header">
                        <a href="/enemies" class="back-btn" data-link>← Retour au Bestiaire</a>
                    </div>
                    <article class="tower-detail-card" style="border-left: 6px solid ${colorTheme};">
                        <img class="tower-detail-image" src="${enemy.imageBigPath}" alt="${enemy.name}" style="background: transparent; border: none;">
                        <div class="detail-content">
                            <h2 class="tower-detail-title" style="color: ${colorTheme};">${enemy.name} ${type === "boss" ? '<span>(Boss)</span>' : ''}</h2>
                            <p><em>${enemy.description}</em></p>
                            <div class="stats-grid">
                                <div class="stat-item"><strong>PV</strong><span>${enemy.health}</span></div>
                                <div class="stat-item"><strong>Dégâts</strong><span>${enemy.damage}</span></div>
                                <div class="stat-item"><strong>Vitesse</strong><span>${enemy.speed}</span></div>
                                <div class="stat-item"><strong>Armure</strong><span>${enemy.armor}</span></div>
                                <div class="stat-item"><strong>Résistance</strong><span>${enemy.magicResistance}</span></div>
                                <div class="stat-item"><strong>Vies prises</strong><span>${enemy.livesTaken}</span></div>
                                <div class="stat-item"><strong>Récompense</strong><span>${enemy.bounty}</span></div>
                            </div>

                            ${enemy.abilities && enemy.abilities.length > 0 ? `
                                <hr>
                                <h3>Capacités spéciales</h3>
                                <ul class="skills-list" style="margin-bottom: 20px; color: ${colorTheme};">
                                    ${enemy.abilities.map(a => `<li><strong>${a}</strong></li>`).join('')}
                                </ul>
                            ` : ''}

                            <button class="fav-btn ${isFavorite ? 'is-favorite' : ''}" data-type="${type}" data-id="${enemy.id}">
                                ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </button>
                        </div>
                    </article>
                </section>`;
        } catch (error) {
            console.error(error);
            return `<p>Erreur de chargement des détails.</p>`;
        }
    }
}