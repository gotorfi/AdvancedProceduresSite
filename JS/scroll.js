"use strict";

// Elements

const scrollLinks = document.querySelectorAll('a[href^="#"]');

// Initialize

document.addEventListener("DOMContentLoaded", () => {
    initializeScroll();
});

// Functions

function initializeScroll() {
    initializeSmoothScroll();
}

// Smooth Scroll

function initializeSmoothScroll() {
    scrollLinks.forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}