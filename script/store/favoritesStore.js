const STORAGE_KEY = "favoriteTowerIds";

function readFavorites() {
    try {
        const rawValue = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(rawValue || "[]");

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map(value => Number(value))
            .filter(value => Number.isInteger(value));
    } catch (_) {
        return [];
    }
}

function saveFavorites(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function getFavoriteTowerIds() {
    return readFavorites();
}

export function isFavoriteTower(towerId) {
    return readFavorites().includes(Number(towerId));
}

export function addFavoriteTower(towerId) {
    const id = Number(towerId);
    const ids = readFavorites();

    if (!ids.includes(id)) {
        ids.push(id);
        saveFavorites(ids);
    }
}

export function removeFavoriteTower(towerId) {
    const id = Number(towerId);
    const ids = readFavorites().filter(value => value !== id);
    saveFavorites(ids);
}

export function toggleFavoriteTower(towerId) {
    if (isFavoriteTower(towerId)) {
        removeFavoriteTower(towerId);
        return false;
    }

    addFavoriteTower(towerId);
    return true;
}