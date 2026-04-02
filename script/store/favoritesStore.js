const STORAGE_KEY_TOWERS = "kb_fav_towers";
const STORAGE_KEY_ENEMIES = "kb_fav_enemies";
const STORAGE_KEY_BOSSES = "kb_fav_bosses"; // Nouvelle clé

const getFavs = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveFavs = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- TOWERS ---
export const getFavoriteTowerIds = () => getFavs(STORAGE_KEY_TOWERS);
export const isFavoriteTower = (id) => getFavoriteTowerIds().includes(Number(id));
export const toggleFavoriteTower = (id) => {
    const favs = getFavoriteTowerIds();
    const index = favs.indexOf(Number(id));
    if (index === -1) favs.push(Number(id));
    else favs.splice(index, 1);
    saveFavs(STORAGE_KEY_TOWERS, favs);
    return index === -1;
};
export const removeFavoriteTower = (id) => {
    const favs = getFavoriteTowerIds().filter(favId => favId !== Number(id));
    saveFavs(STORAGE_KEY_TOWERS, favs);
};

// --- ENEMIES ---
export const getFavoriteEnemyIds = () => getFavs(STORAGE_KEY_ENEMIES);
export const isFavoriteEnemy = (id) => getFavoriteEnemyIds().includes(Number(id));
export const toggleFavoriteEnemy = (id) => {
    const favs = getFavoriteEnemyIds();
    const index = favs.indexOf(Number(id));
    if (index === -1) favs.push(Number(id));
    else favs.splice(index, 1);
    saveFavs(STORAGE_KEY_ENEMIES, favs);
    return index === -1;
};
export const removeFavoriteEnemy = (id) => {
    const favs = getFavoriteEnemyIds().filter(favId => favId !== Number(id));
    saveFavs(STORAGE_KEY_ENEMIES, favs);
};

export const getFavoriteBossIds = () => getFavs(STORAGE_KEY_BOSSES);
export const isFavoriteBoss = (id) => getFavoriteBossIds().includes(Number(id));
export const toggleFavoriteBoss = (id) => {
    const favs = getFavoriteBossIds();
    const index = favs.indexOf(Number(id));
    if (index === -1) favs.push(Number(id));
    else favs.splice(index, 1);
    saveFavs(STORAGE_KEY_BOSSES, favs);
    return index === -1;
};
export const removeFavoriteBoss = (id) => {
    const favs = getFavoriteBossIds().filter(favId => favId !== Number(id));
    saveFavs(STORAGE_KEY_BOSSES, favs);
};