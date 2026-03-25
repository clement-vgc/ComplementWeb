export default class HomeView {
    async render() {
        return `
            <section class="page page-home">
                <h2>Accueil</h2>
                <p class="section-subtitle">Bienvenue dans l'encyclopédie Kingdom Rush.</p>

                <div class="info-grid">
                    <article class="info-card">
                        <h3>Explore</h3>
                        <p>Découvre les tours, leurs statistiques et leurs compétences spéciales.</p>
                    </article>
                    <article class="info-card">
                        <h3>Compare</h3>
                        <p>Observe rapidement les différences de type, dégâts et portée.</p>
                    </article>
                    <article class="info-card">
                        <h3>Prépare ton build</h3>
                        <p>Utilise la section Favoris pour préparer ta composition idéale.</p>
                    </article>
                </div>
            </section>
        `;
    }
}