
import { router, navigateTo } from './router.js';
import { toggleFavoriteTower, removeFavoriteTower } from './store/favoritesStore.js';

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", e => {
        const favoriteButton = e.target.closest(".fav-btn");

        if (favoriteButton) {
            const towerId = Number(favoriteButton.dataset.id);

            if (!Number.isInteger(towerId)) {
                return;
            }

            if (favoriteButton.classList.contains("remove-fav-btn")) {
                removeFavoriteTower(towerId);

                if (window.location.pathname === "/favorites") {
                    router();
                }
                return;
            }

            const nowFavorite = toggleFavoriteTower(towerId);
            favoriteButton.classList.toggle("is-favorite", nowFavorite);
            favoriteButton.textContent = nowFavorite
                ? "Retirer des favoris"
                : "Ajouter aux favoris";
            return;
        }

        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});