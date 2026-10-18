const KEY = 'nigerian-travel-favorites';

export function getFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

export function toggleFavorite(id) {
    const saved = getFavorites();
    const next = saved.includes(id)
        ? saved.filter(value => value !== id)
        : [...saved, id];

    try {
        localStorage.setItem(KEY, JSON.stringify(next));

        // Optional Pro-Tip: Dispatch an event so other parts of the site know it updated
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: next }));
    } catch (error) {
        console.warn('Could not save favorites:', error);
    }

    return next;
}
