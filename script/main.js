import { router, navigateTo } from './router.js';
import { 
    toggleFavoriteTower, 
    removeFavoriteTower, 
    toggleFavoriteEnemy, 
    removeFavoriteEnemy 
} from './store/favoritesStore.js';

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", e => {
        
        const linkTarget = e.target.closest("[data-link]");
        if (linkTarget) {
            e.preventDefault();
            navigateTo(linkTarget.href);
            return;
        }

        const favoriteButton = e.target.closest(".fav-btn");
        if (favoriteButton) {
            const itemId = Number(favoriteButton.dataset.id);
            const itemType = favoriteButton.dataset.type;

            if (!Number.isInteger(itemId) || !itemType) {
                return;
            }

            if (favoriteButton.classList.contains("remove-fav-btn")) {
                if (itemType === "tower") removeFavoriteTower(itemId);
                if (itemType === "enemy") removeFavoriteEnemy(itemId);

                if (window.location.pathname === "/favorites") {
                    router();
                }
                return;
            }

            let nowFavorite = false;
            if (itemType === "tower") {
                nowFavorite = toggleFavoriteTower(itemId);
            } else if (itemType === "enemy") {
                nowFavorite = toggleFavoriteEnemy(itemId);
            }

            favoriteButton.classList.toggle("is-favorite", nowFavorite);
            favoriteButton.textContent = nowFavorite
                ? "Retirer des favoris"
                : "Ajouter aux favoris";
            return;
        }
    });

    router();
});