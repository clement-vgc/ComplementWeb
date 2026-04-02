import HomeView from "./views/HomeView.js";
import TowersView from "./views/TowersView.js";
import EnemiesView from "./views/EnemiesView.js";
import FavoritesView from "./views/FavoritesView.js";
import EnemyDetailView from "./views/EnemyDetailView.js";
import TowerDetailView from "./views/TowerDetailView.js";

const routes = [
    { path: "/", view: HomeView },
    { path: "/towers", view: TowersView },
    { path: "/tower/:id", view: TowerDetailView },
    { path: "/enemies", view: EnemiesView },
    { path: "/enemy/:id", view: EnemyDetailView },
    { path: "/boss/:id", view: EnemyDetailView },
    { path: "/favorites", view: FavoritesView }
];

const normalizePath = (path) => {
    if (!path) return "/";
    const withoutTrailingSlash = path.replace(/\/+$/, "");
    return withoutTrailingSlash || "/";
};

const matchRoute = (currentPath) => {
    const normalizedCurrentPath = normalizePath(currentPath);

    for (let route of routes) {
        const normalizedRoutePath = normalizePath(route.path);

        if (route.path.includes(":")) {
            const pattern = normalizedRoutePath.replace(/:[^/]+/g, "([^/]+)");
            const regex = new RegExp(`^${pattern}$`);
            const match = normalizedCurrentPath.match(regex);
            if (match) {
                return { route, params: match.slice(1) };
            }
        } else if (normalizedRoutePath === normalizedCurrentPath) {
            return { route, params: [] };
        }
    }
    return null;
};

export const router = async () => { 
    const currentPath = window.location.pathname;

    let matchResult = matchRoute(currentPath);

    if (!matchResult) {
        matchResult = { route: routes[0], params: [] };
    }

    const { route, params } = matchResult;
    const view = params.length > 0 ? new route.view(params[0]) : new route.view();

    document.querySelector("#app").innerHTML = await view.render(); 
};

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};