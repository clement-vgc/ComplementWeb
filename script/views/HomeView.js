import { api } from '../api/api.js';

export default class HomeView {
    async render() {
        try {
            const [towerTypes, towers, specialSkills] = await Promise.all([
                api.getTowerTypes(),
                api.getTowers(),
                api.getSpecialSkills()
            ]);

            return `
                <section class="page page-home">
                    <section class="home-hero">
                        <div class="home-hero-content">
                            <img class="home-logo" src="/images/accueil/Rush_Logo.webp" alt="Logo Kingdom Rush">
                            <h2>Kingdom Rush, l'art de la défense</h2>
                            <p class="section-subtitle">Construis, améliore et combine tes tours pour arrêter des vagues d'ennemis toujours plus dangereuses.</p>

                            <div class="home-kpi-grid">
                                <article class="kpi-card">
                                    <strong>${towerTypes.length}</strong>
                                    <span>types de tours</span>
                                </article>
                                <article class="kpi-card">
                                    <strong>${towers.length}</strong>
                                    <span>tours référencées</span>
                                </article>
                                <article class="kpi-card">
                                    <strong>${specialSkills.length}</strong>
                                    <span>upgrades spéciaux</span>
                                </article>
                            </div>
                        </div>

                        <figure class="home-hero-media">
                            <img src="/images/accueil/KR_Title_Screen.PNG.webp" alt="Écran titre Kingdom Rush">
                        </figure>
                    </section>
                </section>
            `;
        } catch (error) {
            console.error(error);
            return `
                <section class="page page-home">
                    <h2>Accueil</h2>
                    <p class="section-subtitle">Impossible de charger les données du jeu pour le moment.</p>
                </section>
            `;
        }
    }
}