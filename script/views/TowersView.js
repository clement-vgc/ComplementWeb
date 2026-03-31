import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';
import { isFavoriteTower } from '../store/favoritesStore.js';

export default class TowersView {
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

            let html = `
                <section class="page page-towers">
                    <h2>Arsenal des Tours</h2>
                    <p class="section-subtitle">Toutes les tours avec leurs statistiques principales.</p>
                    <div class="towers-container">
            `;

            towers.forEach(tower => {
                const isFavorite = isFavoriteTower(tower.id);

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
                        ${tower.health ? `<p><strong>PV :</strong> ${tower.health} | <strong>Armure :</strong> ${tower.armor}</p>` : ''}
                        
                        ${tower.hasSkills ? `
                            <hr>
                            <h4>Compétences :</h4>
                            <ul class="skills-list">
                                ${tower.skills.map(skill => `
                                    <li><strong>${skill.name}:</strong> ${skill.description}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                        
                        <button class="fav-btn ${isFavorite ? 'is-favorite' : ''}" data-type="tower" data-id="${tower.id}" type="button">
                            ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </button>
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
            return `<p>Erreur lors du chargement des tours. L'API est-elle bien lancée ?</p>`;
        }
    }
}