
class HomeView { render() { return "<h2>Accueil</h2><p>Bienvenue dans l'encyclopédie Kingdom Rush !</p>"; } }
class TowersView { render() { return "<h2>Arsenal des Tours</h2><p>La liste des tours apparaîtra ici.</p>"; } }
class EnemiesView { render() { return "<h2>Bestiaire</h2><p>Les ennemis apparaîtront ici.</p>"; } }
class FavoritesView { render() { return "<h2>Mon Build</h2><p>Tes tours favorites seront ici.</p>"; } }

const routes = [
    { path: "/", view: HomeView },
    { path: "/towers", view: TowersView },
    { path: "/enemies", view: EnemiesView },
    { path: "/favorites", view: FavoritesView }
];

export const router = () => {
    const currentPath = window.location.pathname;

    let match = routes.find(route => route.path === currentPath);

    if (!match) {
        match = routes[0];
    }

    const view = new match.view();

    document.querySelector("#app").innerHTML = view.render();
};

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};