import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';
import { getFavoriteTowerIds } from '../store/favoritesStore.js';

export default class FavoritesView {
    async render() {
        try {
            const favoriteIds = getFavoriteTowerIds();

            if (favoriteIds.length === 0) {
                return `
                    <section class="page page-favorites">
                        <h2>Mon Build</h2>
                        <p class="section-subtitle">Tes tours favorites seront affichées ici.</p>

                        <article class="placeholder-card">
                            <h3>Aucun favori pour le moment</h3>
                            <p>Ajoute des tours depuis l'arsenal pour construire ton équipe.</p>
                        </article>
                    </section>
                `;
            }

            const [rawTowers, towerTypes, specialSkills, towerSkills] = await Promise.all([
                api.getTowers(),
                api.getTowerTypes(),
                api.getSpecialSkills(),
                api.getTowerSkills()
            ]);

            const relations = Tower.buildRelations({ towerTypes, specialSkills, towerSkills });
            const towers = Tower.listFromApi(rawTowers, relations)
                .filter(tower => favoriteIds.includes(tower.id));

            if (towers.length === 0) {
                return `
                    <section class="page page-favorites">
                        <h2>Mon Build</h2>
                        <p class="section-subtitle">Tes tours favorites seront affichées ici.</p>

                        <article class="placeholder-card">
                            <h3>Favoris introuvables</h3>
                            <p>Certains IDs favoris ne correspondent plus aux données actuelles.</p>
                        </article>
                    </section>
                `;
            }

            let html = `
                <section class="page page-favorites">
                    <h2>Mon Build</h2>
                    <p class="section-subtitle">Retrouve ici toutes les tours que tu as ajoutées en favoris.</p>
                    <div class="towers-container">
            `;

            towers.forEach(tower => {
                html += `
                    <article class="tower-card" style="--tower-color: ${tower.typeColor};">
                        ${tower.imagePath ? `
                            <img class="tower-image" src="${tower.imagePath}" alt="${tower.name}">
                        ` : ''}
                        <h3 class="tower-title">${tower.name} <span>(Lvl ${tower.level})</span></h3>
                        <p><strong>Type :</strong> ${tower.typeName}</p>
                        <p><strong>Dégâts :</strong> ${tower.damageLabel}</p>
                        <p><strong>Vitesse d'attaque :</strong> ${tower.attackSpeed}</p>
                        ${tower.range ? `<p><strong>Portée :</strong> ${tower.rangeLabel}</p>` : ''}

                        <button class="fav-btn remove-fav-btn" data-id="${tower.id}" type="button">Retirer des favoris</button>
                    </article>
                `;
            });

            html += `
                    </div>
                </section>
            `;

            return html;
        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement des favoris.</p>`;
        }
    }
}