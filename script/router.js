import HomeView from "./views/HomeView.js";
import TowersView from "./views/TowersView.js";
import EnemiesView from "./views/EnemiesView.js";
import FavoritesView from "./views/FavoritesView.js";

const routes = [
    { path: "/", view: HomeView },
    { path: "/towers", view: TowersView },
    { path: "/enemies", view: EnemiesView },
    { path: "/favorites", view: FavoritesView }
];

export const router = async () => { 
    const currentPath = window.location.pathname;

    let match = routes.find(route => route.path === currentPath);

    if (!match) {
        match = routes[0];
    }

    const view = new match.view();

    document.querySelector("#app").innerHTML = await view.render(); 
};

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};