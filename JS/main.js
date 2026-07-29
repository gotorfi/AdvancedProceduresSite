"use strict";

// Initialize

document.addEventListener("DOMContentLoaded", () => {
    initialize();
});

// Functions

function initialize() {
    initializeCurrentYear();
}

// Utilities

function initializeCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}