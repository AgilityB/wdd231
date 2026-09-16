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
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
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

    lastModified.textContent =
        `Last Modification: ${document.lastModified}`;
}


/* -----------------------------------------
   DIRECTORY
   ----------------------------------------- */

const memberContainer =
    document.querySelector("#memberContainer");

const gridView =
    document.querySelector("#gridView");

const listView =
    document.querySelector("#listView");


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
   DISPLAY MEMBERS
   ----------------------------------------- */

function displayMembers(members) {

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
   FETCH MEMBER DATA
   ----------------------------------------- */

async function getMembers() {

    try {

        const response =
            await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {

        console.error(
            "Unable to load member data:",
            error
        );

        memberContainer.innerHTML = `
            <p class="error-message">
                Sorry, the member directory could not
                be loaded at this time.
            </p>
        `;
    }
}


/* -----------------------------------------
   GRID VIEW
   ----------------------------------------- */

if (gridView && memberContainer) {

    gridView.addEventListener("click", () => {

        memberContainer.classList.remove("member-list");

        memberContainer.classList.add("member-grid");

        gridView.classList.add("active");

        listView.classList.remove("active");

    });
}


/* -----------------------------------------
   LIST VIEW
   ----------------------------------------- */

if (listView && memberContainer) {

    listView.addEventListener("click", () => {

        memberContainer.classList.remove("member-grid");

        memberContainer.classList.add("member-list");

        listView.classList.add("active");

        gridView.classList.remove("active");

    });
}


/* -----------------------------------------
   LOAD DIRECTORY
   ----------------------------------------- */

if (memberContainer) {
    getMembers();
}