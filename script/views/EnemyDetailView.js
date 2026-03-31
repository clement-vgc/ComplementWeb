import { api } from '../api/api.js';
import { Enemy } from '../models/Enemy.js';

export default class EnemyDetailView {
    constructor(enemyId) {
        this.enemyId = Number(enemyId);
        // On regarde l'URL actuelle pour savoir s'il faut chercher un boss
        this.isBossRoute = window.location.pathname.startsWith('/boss');
    }

    async render() {
        try {
            const { enemies: rawEnemies, bosses: rawBosses } = await api.getEnemiesAndBosses();
            
            const enemies = Enemy.listFromApi(rawEnemies, { category: "enemy" });
            const bosses = Enemy.listFromApi(rawBosses, { category: "boss" });
            
            let enemy;

            // On cherche au bon endroit ! Fini le conflit d'ID !
            if (this.isBossRoute) {
                enemy = bosses.find(b => b.id === this.enemyId);
            } else {
                enemy = enemies.find(e => e.id === this.enemyId);
            }

            if (!enemy) {
                return `<section class="page"><p>Créature non trouvée.</p></section>`;
            }

            const isBoss = enemy.category === "boss";
            const colorTheme = isBoss ? "#d32f2f" : "var(--accent)";

            return `
                <section class="page page-tower-detail">
                    <div class="detail-header">
                        <a href="/enemies" class="back-btn" data-link>← Retour au Bestiaire</a>
                    </div>

                    <article class="tower-detail-card" style="border-left: 6px solid ${colorTheme};">
                        
                        ${enemy.imageBigPath ? `<img class="tower-detail-image" src="${enemy.imageBigPath}" alt="${enemy.name}" style="object-fit: contain; padding: 20px; background: transparent; border: none;">` : ''}
                        
                        <div class="detail-content">
                            <h2 class="tower-detail-title" style="color: ${colorTheme};">${enemy.name} ${isBoss ? '<span>(Boss)</span>' : ''}</h2>
                            
                            <p style="font-size: 1.1em; color: var(--muted); margin-top: -5px; margin-bottom: 20px;"><em>${enemy.description}</em></p>
                            
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <strong>Points de vie</strong>
                                    <span>${enemy.health}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Dégâts</strong>
                                    <span>${enemy.damage}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Vitesse de base</strong>
                                    <span>${enemy.speed}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Armure physique</strong>
                                    <span>${enemy.armor}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Résistance magique</strong>
                                    <span>${enemy.magicResistance}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Vies perdues</strong>
                                    <span>${enemy.livesTaken} ❤️</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Récompense</strong>
                                    <span>${enemy.bounty} 💰</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            `;

        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement des détails.</p>`;
        }
    }
}