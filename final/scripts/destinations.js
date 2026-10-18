import { getFavorites, toggleFavorite } from './favorites.js';

// DOM Element Selectors
const list = document.querySelector('#destination-list');
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const onlyFavorites = document.querySelector('#favorites-only');
const count = document.querySelector('#result-count');
const error = document.querySelector('#data-error');
const dialog = document.querySelector('#destination-dialog');
const content = document.querySelector('#dialog-content');

let destinations = [];

// Helper function to create text elements quickly
function makeText(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

// Main function to filter and display data
function render() {
    const term = search.value.trim().toLowerCase();
    const favorites = getFavorites();

    // Filter logic based on search term, category dropdown, and favorites checkbox
    const filtered = destinations.filter(item =>
        (category.value === 'all' || item.category === category.value) &&
        (!onlyFavorites.checked || favorites.includes(item.id)) &&
        [item.name, item.state, item.location, item.category].some(value =>
            value.toLowerCase().includes(term)
        )
    );

    // Clear the container
    list.replaceChildren();
    count.textContent = `Showing ${filtered.length} of ${destinations.length} destinations`;

    // Render cards
    filtered.forEach(item => {
        const card = document.createElement('article');
        card.className = 'destination-card';
        card.append(
            makeText('span', item.category),
            makeText('h2', item.name),
            makeText('p', `${item.location}, ${item.state}`),
            makeText('p', item.description)
        );
        card.firstChild.className = 'tag';

        // Actions container (Buttons)
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        // View Details Button
        const details = makeText('button', 'View details');
        details.type = 'button';
        details.addEventListener('click', () => {
            content.replaceChildren(
                makeText('h2', item.name),
                makeText('p', `${item.location}, ${item.state}`),
                makeText('p', `Category: ${item.category}`),
                makeText('p', item.description)
            );
            dialog.showModal();
        });

        // Favorite Toggle Button
        const isFav = favorites.includes(item.id);
        const favorite = makeText('button', isFav ? '★ Saved' : '☆ Save');
        favorite.type = 'button';
        favorite.setAttribute('aria-label', `${isFav ? 'Remove' : 'Save'} ${item.name} ${isFav ? 'from' : 'to'} favorites`);
        favorite.addEventListener('click', () => {
            toggleFavorite(item.id);
            render();
        });

        actions.append(details, favorite);
        card.append(actions);
        list.append(card);
    });

    // Empty state handling
    if (filtered.length === 0) {
        list.append(makeText('p', 'No destinations match your filters. Try another search.'));
    }
}

// Fetch data from local JSON file
async function loadDestinations() {
    try {
        const response = await fetch('data/destinations.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        if (!Array.isArray(result)) throw new Error('Unexpected data format');

        destinations = result;
        render();
    } catch (err) {
        count.textContent = '';
        error.hidden = false;
        error.textContent = 'Unable to load destinations. Please try again after serving the website through a local web server.';
        console.error('Destination loading failed:', err);
    }
}

// Event Listeners
[search, category, onlyFavorites].forEach(element =>
    element.addEventListener(element === search ? 'input' : 'change', render)
);

document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());

// Close dialog when backdrop is clicked
dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});

// Initialize
loadDestinations();
