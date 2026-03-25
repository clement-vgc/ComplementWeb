
import { api } from '../api/api.js';
import { Tower } from '../models/Tower.js';

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
                <h2>Arsenal des Tours</h2>
                <div class="towers-container" style="display: flex; flex-wrap: wrap; gap: 20px;">
            `;

            towers.forEach(tower => {
                html += `
                    <div class="tower-card" style="border: 2px solid ${tower.typeColor}; padding: 15px; border-radius: 8px; width: 300px;">
                        <h3 style="color: ${tower.typeColor}; margin-top: 0;">${tower.name} (Lvl ${tower.level})</h3>
                        <p><strong>Type :</strong> ${tower.typeName}</p>
                        <p><strong>Dégâts :</strong> ${tower.damageLabel}</p>
                        <p><strong>Vitesse d'attaque :</strong> ${tower.attackSpeed}</p>
                        
                        ${tower.range ? `<p><strong>Portée :</strong> ${tower.rangeLabel}</p>` : ''}
                        ${tower.health ? `<p><strong>PV :</strong> ${tower.health} | <strong>Armure :</strong> ${tower.armor}</p>` : ''}
                        
                        ${tower.hasSkills ? `
                            <hr>
                            <h4>Compétences :</h4>
                            <ul style="padding-left: 20px; font-size: 0.9em;">
                                ${tower.skills.map(skill => `
                                    <li><strong>${skill.name}:</strong> ${skill.description}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                        
                        <button class="fav-btn" data-id="${tower.id}">⭐ Favoris</button>
                    </div>
                `;
            });

            html += `</div>`;
            return html;

        } catch (error) {
            console.error(error);
            return `<p>Erreur lors du chargement des tours. L'API est-elle bien lancée ?</p>`;
        }
    }
}