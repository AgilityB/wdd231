import { places } from "../data/discover.mjs";

const grid = document.querySelector("#discoverGrid");
const visitMessage = document.querySelector("#visitMessage");
const visitStorageKey = "umuahiaDiscoverLastVisit";

function showVisitMessage() {
  if (!visitMessage) return;

  const now = Date.now();
  const previousVisit = Number(localStorage.getItem(visitStorageKey));

  if (!previousVisit || !Number.isFinite(previousVisit)) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const elapsed = now - previousVisit;
    const oneDay = 24 * 60 * 60 * 1000;

    if (elapsed < oneDay) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else {
      const days = Math.floor(elapsed / oneDay);
      visitMessage.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
    }
  }

  localStorage.setItem(visitStorageKey, String(now));
}

function createPlaceCard(place) {
  const card = document.createElement("article");
  card.className = "discover-card";
  card.style.gridArea = place.id;

  const title = document.createElement("h2");
  title.textContent = place.name;

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = place.image;
  image.alt = place.imageAlt;
  image.width = 300;
  image.height = 200;
  image.loading = "lazy";
  figure.append(image);

  const address = document.createElement("address");
  address.textContent = place.address;

  const description = document.createElement("p");
  description.className = "discover-description";
  description.textContent = place.description;

  const more = document.createElement("p");
  more.className = "discover-more";
  more.textContent = place.learnMore;
  more.hidden = true;

  const button = document.createElement("button");
  button.className = "button button-primary discover-button";
  button.type = "button";
  button.textContent = "Learn More";
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    more.hidden = expanded;
    button.textContent = expanded ? "Learn More" : "Show Less";
  });

  card.append(title, figure, address, description, more, button);
  return card;
}

try {
  showVisitMessage();
} catch (error) {
  // The page remains usable if browser storage is disabled.
  if (visitMessage) visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  console.warn("Visit history is unavailable in this browser.", error);
}

if (grid) {
  places.forEach((place) => grid.append(createPlaceCard(place)));
}
