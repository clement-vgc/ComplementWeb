const TOWERS_KEY = "favoriteTowerIds";
const ENEMIES_KEY = "favoriteEnemyIds";

function readFavorites(key) {
    try {
        const rawValue = localStorage.getItem(key);
        const parsed = JSON.parse(rawValue || "[]");
        return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isInteger) : [];
    } catch (_) {
        return [];
    }
}

function saveFavorites(key, ids) {
    localStorage.setItem(key, JSON.stringify(ids));
}

// --- GESTION DES TOURS ---
export const getFavoriteTowerIds = () => readFavorites(TOWERS_KEY);
export const isFavoriteTower = (id) => getFavoriteTowerIds().includes(Number(id));

export const removeFavoriteTower = (towerId) => {
    const id = Number(towerId);
    let ids = getFavoriteTowerIds().filter(val => val !== id);
    saveFavorites(TOWERS_KEY, ids);
};

export const toggleFavoriteTower = (towerId) => {
    const id = Number(towerId);
    let ids = getFavoriteTowerIds();
    
    if (ids.includes(id)) {
        removeFavoriteTower(id);
        return false;
    } else {
        ids.push(id);
        saveFavorites(TOWERS_KEY, ids);
        return true;
    }
};

// --- GESTION DES ENNEMIS ---
export const getFavoriteEnemyIds = () => readFavorites(ENEMIES_KEY);
export const isFavoriteEnemy = (id) => getFavoriteEnemyIds().includes(Number(id));

export const removeFavoriteEnemy = (enemyId) => {
    const id = Number(enemyId);
    let ids = getFavoriteEnemyIds().filter(val => val !== id);
    saveFavorites(ENEMIES_KEY, ids);
};

export const toggleFavoriteEnemy = (enemyId) => {
    const id = Number(enemyId);
    let ids = getFavoriteEnemyIds();
    
    if (ids.includes(id)) {
        removeFavoriteEnemy(id);
        return false;
    } else {
        ids.push(id);
        saveFavorites(ENEMIES_KEY, ids);
        return true;
    }
};