import { router, navigateTo } from './router.js';
import { 
    toggleFavoriteTower, 
    removeFavoriteTower, 
    toggleFavoriteEnemy, 
    removeFavoriteEnemy,
    toggleFavoriteBoss,
    removeFavoriteBoss 
} from './store/favoritesStore.js';

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const link = e.target.closest("[data-link]");
        if (link) {
            e.preventDefault();
            navigateTo(link.getAttribute("href"));
            return;
        }

        const favoriteButton = e.target.closest(".fav-btn");
        if (favoriteButton) {
            const itemId = Number(favoriteButton.dataset.id);
            const itemType = favoriteButton.dataset.type;

            if (favoriteButton.classList.contains("remove-fav-btn")) {
                if (itemType === "tower") removeFavoriteTower(itemId);
                if (itemType === "enemy") removeFavoriteEnemy(itemId);
                if (itemType === "boss") removeFavoriteBoss(itemId);

                if (window.location.pathname === "/favorites") router();
                return;
            }

            let nowFavorite = false;
            if (itemType === "tower") nowFavorite = toggleFavoriteTower(itemId);
            else if (itemType === "enemy") nowFavorite = toggleFavoriteEnemy(itemId);
            else if (itemType === "boss") nowFavorite = toggleFavoriteBoss(itemId);

            favoriteButton.classList.toggle("is-favorite", nowFavorite);
            favoriteButton.textContent = nowFavorite ? "Retirer" : "Ajouter";
        }
    });

    router();
});