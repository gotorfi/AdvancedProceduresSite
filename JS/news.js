/* ========================================================= */
/* NEWS SYSTEM */
/* ========================================================= */

let newsData = [];
let currentNews = 0;


/* ========================================================= */
/* DATE */
/* ========================================================= */

function formatNewsDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

}


/* ========================================================= */
/* LOAD NEWS */
/* ========================================================= */

async function loadNews() {

    try {

        const response = await fetch("DATA/news.json");

        if (!response.ok) {
            throw new Error("Failed to load news.json");
        }

        newsData = await response.json();

        /*
         * Newest first
         */
        newsData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });


        /*
         * Check whether this is the news detail page
         */
        const params = new URLSearchParams(window.location.search);
        const newsId = params.get("id");


        if (newsId !== null) {

            renderNewsDetail(newsId);

        } else {

            renderNewsCarousel();

        }

    } catch (error) {

        console.error("News loading error:", error);

    }

}


/* ========================================================= */
/* CAROUSEL */
/* ========================================================= */

function renderNewsCarousel() {

    const carousel = document.getElementById("news-carousel");

    if (!carousel || newsData.length === 0) {
        return;
    }


    currentNews = 0;

    renderCarouselCards();


    const previousButton = document.getElementById("news-prev");
    const nextButton = document.getElementById("news-next");


    if (previousButton) {

        previousButton.addEventListener("click", () => {

            if (currentNews > 0) {

                currentNews--;

                renderCarouselCards();

            }

        });

    }


    if (nextButton) {

        nextButton.addEventListener("click", () => {

            if (currentNews < newsData.length - 1) {

                currentNews++;

                renderCarouselCards();

            }

        });

    }

}


/* ========================================================= */
/* RENDER CAROUSEL CARDS */
/* ========================================================= */

function renderCarouselCards() {

    const carousel = document.getElementById("news-carousel");

    if (!carousel) {
        return;
    }


    carousel.innerHTML = "";


    /*
     * Show nearby news around the current item.
     *
     * This keeps the carousel from becoming huge while
     * still showing what is next.
     */

    const start = Math.max(0, currentNews - 1);
    const end = Math.min(newsData.length - 1, currentNews + 1);


    for (let i = start; i <= end; i++) {

        const news = newsData[i];

        const card = document.createElement("article");

        card.className = "news-card";

        if (i === currentNews) {
            card.classList.add("active");
        }


        /*
         * Newest news gets NEW!
         */

        if (i === 0) {

            const badge = document.createElement("div");

            badge.className = "news-new-badge";
            badge.textContent = "NEW!";

            card.appendChild(badge);

        }


        /*
         * Image
         */

        const imageWrapper = document.createElement("div");

        imageWrapper.className = "news-card-image";


        const image = document.createElement("img");

        image.src = "IMGNEWS/" + news.thumbnail;
        image.alt = news.title;

        imageWrapper.appendChild(image);

        card.appendChild(imageWrapper);


        /*
         * Content
         */

        const content = document.createElement("div");

        content.className = "news-card-content";


        const label = document.createElement("span");

        label.className = "section-label";
        label.textContent = "NEWS";


        const title = document.createElement("h3");

        title.textContent = news.title;


        const subtitle = document.createElement("p");

        subtitle.textContent = news.subtitle;


        const date = document.createElement("span");

        date.className = "news-card-date";
        date.textContent = formatNewsDate(news.date);


        content.appendChild(label);
        content.appendChild(title);
        content.appendChild(subtitle);
        content.appendChild(date);

        card.appendChild(content);


        /*
         * Open news
         */

        card.addEventListener("click", () => {

            window.location.href = "news.html?id=" + i;

        });


        carousel.appendChild(card);

    }


    /*
     * Arrow states
     */

    const previousButton = document.getElementById("news-prev");
    const nextButton = document.getElementById("news-next");


    if (previousButton) {
        previousButton.disabled = currentNews === 0;
    }


    if (nextButton) {
        nextButton.disabled = currentNews === newsData.length - 1;
    }

}


/* ========================================================= */
/* DETAIL PAGE */
/* ========================================================= */

function renderNewsDetail(newsId) {

    const news = newsData[Number(newsId)];


    if (!news) {

        document.title = "News Not Found";

        return;

    }


    /*
     * Image
     */

    const image = document.getElementById("news-image");

    if (image) {

        image.src = "IMGNEWS/" + news.thumbnail;
        image.alt = news.title;

    }


    /*
     * NEW badge
     */

    const badge = document.getElementById("news-new");

    if (badge) {

        if (Number(newsId) === 0) {

            badge.style.display = "block";

        } else {

            badge.style.display = "none";

        }

    }


    /*
     * Title
     */

    const title = document.getElementById("news-title");

    if (title) {
        title.textContent = news.title;
    }


    /*
     * Subtitle
     */

    const subtitle = document.getElementById("news-subtitle");

    if (subtitle) {
        subtitle.textContent = news.subtitle;
    }


    /*
     * Date
     */

    const formattedDate = formatNewsDate(news.date);


    const date = document.getElementById("news-date");

    if (date) {
        date.textContent = formattedDate;
    }


    const footerDate = document.getElementById("news-footer-date");

    if (footerDate) {
        footerDate.textContent = formattedDate;
    }


    /*
     * Page title
     */

    document.title = news.title + " - Advanced Procedures";


    /*
     * Sections
     */

    const content = document.getElementById("news-content");

    if (!content) {
        return;
    }


    content.innerHTML = "";


    if (!news.sections) {
        return;
    }


    news.sections.forEach(section => {

        const sectionElement = document.createElement("div");

        sectionElement.className = "news-detail-section";


        const heading = document.createElement("h2");

        heading.textContent = section.title;


        sectionElement.appendChild(heading);


        if (Array.isArray(section.content)) {

            section.content.forEach(paragraphText => {

                const paragraph = document.createElement("p");

                paragraph.textContent = paragraphText;

                sectionElement.appendChild(paragraph);

            });

        }


        content.appendChild(sectionElement);

    });

}


/* ========================================================= */
/* START */
/* ========================================================= */

document.addEventListener("DOMContentLoaded", loadNews);