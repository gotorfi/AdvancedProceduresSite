"use strict";

// Elements

const navbar = document.querySelector(".navbar");
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarLinks = document.querySelector(".navbar-links");

// Initialize

document.addEventListener("DOMContentLoaded", () => {
    initializeNavbar();
});

// Functions

function initializeNavbar() {
    initializeMenu();
    initializeScroll();
}

// Menu

function initializeMenu() {
    if (!navbarToggle || !navbarLinks) {
        return;
    }

    navbarToggle.addEventListener("click", () => {
        navbarLinks.classList.toggle("open");
    });

    document.querySelectorAll(".navbar-links a").forEach(link => {
        link.addEventListener("click", () => {
            navbarLinks.classList.remove("open");
        });
    });
}

// Scroll

function initializeScroll() {
    window.addEventListener("scroll", updateNavbar);
    updateNavbar();
}

function updateNavbar() {
    if (!navbar) {
        return;
    }

    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}