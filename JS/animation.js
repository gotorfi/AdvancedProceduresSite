"use strict";

// Elements

const animatedElements = document.querySelectorAll(".fade-in,.fade-out,.slide-up,.slide-down,.slide-left,.slide-right,.zoom-in,.zoom-out,.rotate-in,.rotate-out,.blur-in,.blur-out");

// Initialize

document.addEventListener("DOMContentLoaded", () => {
    initializeAnimations();
});

// Functions

function initializeAnimations() {
    if (animatedElements.length === 0) {
        return;
    }

    animatedElements.forEach(element => {
        element.classList.add("hidden");
    });

    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Observer

function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.remove("hidden");
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
    });
}