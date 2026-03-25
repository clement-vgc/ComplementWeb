export default class FavoritesView {
    async render() {
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
}