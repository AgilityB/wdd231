/* =========================================
   UMUAHIA CHAMBER OF COMMERCE
   Main JavaScript
   ========================================= */


/* -----------------------------------------
   MOBILE NAVIGATION
   ----------------------------------------- */

const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");

if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("open");

        navToggle.setAttribute("aria-expanded", isOpen);
        navToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });
}


/* -----------------------------------------
   FOOTER YEAR
   ----------------------------------------- */

const currentYear = document.querySelector("#currentyear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* -----------------------------------------
   LAST MODIFIED DATE
   ----------------------------------------- */

const lastModified = document.querySelector("#lastModified");

if (lastModified) {
    lastModified.textContent = `Last Modification: ${document.lastModified}`;
}


/* -----------------------------------------
   MEMBERSHIP LEVEL
   ----------------------------------------- */

function getMembershipLevel(level) {
    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}


/* -----------------------------------------
   DIRECTORY
   ----------------------------------------- */

const memberContainer = document.querySelector("#memberContainer");
const gridView = document.querySelector("#gridView");
const listView = document.querySelector("#listView");

function displayMembers(members) {
    if (!memberContainer) {
        return;
    }

    memberContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");

        card.classList.add("member-card");

        card.innerHTML = `
            <div class="member-image">
                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                    width="300"
                    height="180">
            </div>

            <div class="member-info">
                <h2>${member.name}</h2>

                <p class="member-category">
                    ${member.category}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${member.address}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${member.phone}
                </p>

                <p>
                    <strong>Membership:</strong>
                    ${getMembershipLevel(member.membership)}
                </p>

                <p class="member-description">
                    ${member.description}
                </p>

                <a
                    href="${member.website}"
                    target="_blank"
                    rel="noopener"
                    class="member-website">
                    Visit Website
                </a>
            </div>
        `;

        memberContainer.appendChild(card);
    });
}


/* -----------------------------------------
   FETCH MEMBERS
   ----------------------------------------- */

async function fetchMembers() {
    const response = await fetch("data/members.json");

    if (!response.ok) {
        throw new Error(`Member data request failed: ${response.status}`);
    }

    return response.json();
}

async function getMembers() {
    try {
        const members = await fetchMembers();
        displayMembers(members);
    } catch (error) {
        console.error("Unable to load member data:", error);

        if (memberContainer) {
            memberContainer.innerHTML = `
                <p class="error-message">
                    Sorry, the member directory could not be loaded at this time.
                </p>
            `;
        }
    }
}


/* -----------------------------------------
   DIRECTORY VIEW CONTROLS
   ----------------------------------------- */

if (gridView && memberContainer) {
    gridView.addEventListener("click", () => {
        memberContainer.classList.remove("member-list");
        memberContainer.classList.add("member-grid");

        gridView.classList.add("active");

        if (listView) {
            listView.classList.remove("active");
        }
    });
}

if (listView && memberContainer) {
    listView.addEventListener("click", () => {
        memberContainer.classList.remove("member-grid");
        memberContainer.classList.add("member-list");

        listView.classList.add("active");

        if (gridView) {
            gridView.classList.remove("active");
        }
    });
}


/* -----------------------------------------
   LOAD DIRECTORY
   ----------------------------------------- */

if (memberContainer) {
    getMembers();
}


/* -----------------------------------------
   HOME PAGE MEMBER SPOTLIGHTS
   ----------------------------------------- */

const spotlightContainer = document.querySelector("#spotlightContainer");

function shuffleMembers(members) {
    return [...members].sort(() => Math.random() - 0.5);
}

function displaySpotlights(members) {
    if (!spotlightContainer) {
        return;
    }

    const eligibleMembers = members.filter(
        (member) => member.membership === 2 || member.membership === 3
    );

    const spotlightCount = eligibleMembers.length >= 3 ? 3 : 2;
    const selectedMembers = shuffleMembers(eligibleMembers).slice(0, spotlightCount);

    spotlightContainer.innerHTML = "";

    selectedMembers.forEach((member) => {
        const card = document.createElement("article");

        card.classList.add("business-card");

        card.innerHTML = `
            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                width="300"
                height="180"
                loading="lazy">

            <div class="business-card-content">
                <h3>${member.name}</h3>

                <p class="business-category">
                    ${member.category}
                </p>

                <p><strong>Phone:</strong> ${member.phone}</p>

                <p><strong>Address:</strong> ${member.address}</p>

                <p>
                    <strong>Membership:</strong>
                    ${getMembershipLevel(member.membership)}
                </p>

                <a
                    class="text-link"
                    href="${member.website}"
                    target="_blank"
                    rel="noopener">
                    Visit Website
                </a>
            </div>
        `;

        spotlightContainer.appendChild(card);
    });
}

async function getSpotlights() {
    if (!spotlightContainer) {
        return;
    }

    try {
        const members = await fetchMembers();
        displaySpotlights(members);
    } catch (error) {
        console.error("Unable to load spotlights:", error);

        spotlightContainer.innerHTML = `
            <p class="error-message">
                Member spotlights are temporarily unavailable.
            </p>
        `;
    }
}

getSpotlights();


/* -----------------------------------------
   HOME PAGE WEATHER
   OpenWeatherMap
   ----------------------------------------- */

// Add your OpenWeatherMap API key here.
// Do not share your key publicly beyond this course project.
// Restrict the key in your OpenWeather account when possible.
const OPEN_WEATHER_API_KEY = "62404267b660aa2330a9371832dee065";

const weatherCard = document.querySelector("#weatherCard");

const UMUAHIA_LATITUDE = 5.532;
const UMUAHIA_LONGITUDE = 7.489;

function formatForecastDate(timestamp) {
    return new Intl.DateTimeFormat("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric"
    }).format(new Date(timestamp * 1000));
}

function getForecastDays(forecastList) {
    const days = new Map();

    forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-CA", {
            timeZone: "Africa/Lagos"
        });

        if (!days.has(date)) {
            days.set(date, item);
        }
    });

    return Array.from(days.values()).slice(0, 3);
}

function displayWeather(current, forecast) {
    const forecastDays = getForecastDays(forecast.list);

    weatherCard.innerHTML = `
        <div class="weather-current">
            <div class="weather-today">
                <h3>Current Conditions</h3>

                <p class="weather-temperature">
                    ${Math.round(current.main.temp)}°C
                </p>

                <p class="weather-description">
                    ${current.weather[0].description}
                </p>

                <p class="weather-details">
                    Feels like ${Math.round(current.main.feels_like)}°C
                    · Humidity ${current.main.humidity}%
                </p>
            </div>

            <div class="weather-forecast">
                <h3>3-Day Temperature Forecast</h3>

                <div class="forecast-grid">
                    ${forecastDays.map((day) => `
                        <article class="forecast-day">
                            <h4>${formatForecastDate(day.dt)}</h4>
                            <p class="forecast-temperature">
                                ${Math.round(day.main.temp)}°C
                            </p>
                            <p>${day.weather[0].description}</p>
                        </article>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

async function getWeather() {
    if (!weatherCard) {
        return;
    }

    if (OPEN_WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        weatherCard.innerHTML = `
            <p class="weather-error">
                Add your OpenWeatherMap API key in
                <code>scripts/main.js</code> to display live weather.
            </p>
        `;
        return;
    }

    const currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${UMUAHIA_LATITUDE}&lon=${UMUAHIA_LONGITUDE}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${UMUAHIA_LATITUDE}&lon=${UMUAHIA_LONGITUDE}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok) {
            throw new Error(`Current weather request failed: ${currentResponse.status}`);
        }

        if (!forecastResponse.ok) {
            throw new Error(`Forecast request failed: ${forecastResponse.status}`);
        }

        const current = await currentResponse.json();
        const forecast = await forecastResponse.json();

        displayWeather(current, forecast);
    } catch (error) {
        console.error("Unable to load weather:", error);

        weatherCard.innerHTML = `
            <p class="weather-error">
                Current weather information is temporarily unavailable.
            </p>
        `;
    }
}

getWeather();


/* ---------- JOIN PAGE TIMESTAMP ---------- */
const timestampField = document.querySelector("#timestamp");
if (timestampField) {
    timestampField.value = new Date().toISOString();
}

/* ---------- MEMBERSHIP MODALS ---------- */
document.querySelectorAll(".membership-info-link").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const modal = document.querySelector(`#${link.dataset.modal}`);
        if (modal?.showModal) {
            modal.showModal();
        }
    });
});

document.querySelectorAll(".membership-modal").forEach((modal) => {
    const closeButton = modal.querySelector(".modal-close");

    closeButton?.addEventListener("click", () => {
        modal.close();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
});

/* ---------- THANK-YOU PAGE SUBMITTED DATA ---------- */
const submittedFields = {
    submittedFirstName: "firstName",
    submittedLastName: "lastName",
    submittedEmail: "email",
    submittedPhone: "phone",
    submittedOrganization: "organization",
    submittedTimestamp: "timestamp"
};

const params = new URLSearchParams(window.location.search);

Object.entries(submittedFields).forEach(([elementId, parameterName]) => {
    const element = document.querySelector(`#${elementId}`);
    if (!element) {
        return;
    }

    const value = params.get(parameterName);
    if (value) {
        if (parameterName === "timestamp") {
            const date = new Date(value);
            element.textContent = Number.isNaN(date.getTime())
                ? value
                : date.toLocaleString();
        } else {
            element.textContent = value;
        }
    }
});
