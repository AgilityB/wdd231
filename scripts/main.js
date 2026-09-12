const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

const courseContainer = document.getElementById("courseContainer");
const credits = document.getElementById("credits");

const allButton = document.getElementById("all");
const cseButton = document.getElementById("cse");
const wddButton = document.getElementById("wdd");

const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");


// DISPLAY COURSES
function displayCourses(courseList) {
    courseContainer.innerHTML = courseList.map(course => {
        const completedMark = course.completed ? "✓ " : "";

        return `
            <article class="course-card ${course.completed ? "completed" : ""}">
                <button class="course-button" type="button">
                    ${completedMark}${course.subject} ${course.number}
                </button>

                <div class="course-details">
                    <h3>${course.title}</h3>
                    <p><strong>Certificate:</strong> ${course.certificate}</p>
                    <p><strong>Technology:</strong> ${course.technology.join(", ")}</p>
                    <p><strong>Credits:</strong> ${course.credits}</p>
                    <p><strong>Description:</strong> ${course.description}</p>
                </div>
            </article>
        `;
    }).join("");

    const totalCredits = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    credits.textContent = `Total Credits: ${totalCredits}`;

    addCourseButtonEvents();
}
function addCourseButtonEvents() {
    const courseButtons = document.querySelectorAll(".course-button");

    courseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const details = button.nextElementSibling;

            details.classList.toggle("show");

            const isOpen = details.classList.contains("show");

            button.setAttribute("aria-expanded", isOpen);
        });
    });
}



// FILTER COURSES
function filterCourses(subject) {
    let filteredCourses;

    if (subject === "CSE") {
        filteredCourses = courses.filter(course => course.subject === "CSE");
    } else if (subject === "WDD") {
        filteredCourses = courses.filter(course => course.subject === "WDD");
    } else {
        filteredCourses = courses;
    }

    displayCourses(filteredCourses);
}

// BUTTON EVENTS
allButton.addEventListener("click", () => {
    filterCourses("ALL");
});

cseButton.addEventListener("click", () => {
    filterCourses("CSE");
});

wddButton.addEventListener("click", () => {
    filterCourses("WDD");
});


// MOBILE NAVIGATION
navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});


// CURRENT YEAR
const yearSpan = document.getElementById("currentyear");

yearSpan.textContent = new Date().getFullYear();


// LAST MODIFIED
const lastModified = document.getElementById("lastModified");

lastModified.textContent = `Last Modification: ${document.lastModified}`;


// INITIAL COURSE DISPLAY
displayCourses(courses);