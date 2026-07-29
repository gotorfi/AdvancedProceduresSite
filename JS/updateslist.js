"use strict";

// Elements

const updatesGrid = document.getElementById("updates-grid");

// Initialize

document.addEventListener("DOMContentLoaded", loadUpdates);

// Functions

async function loadUpdates() {

    if (!updatesGrid) {
        return;
    }

    const response = await fetch("DATA/updates.json");
    const updates = await response.json();

    updates.sort((a, b) => new Date(b.date) - new Date(a.date));

    updatesGrid.innerHTML = "";

    updates.forEach(update => {
        updatesGrid.appendChild(createUpdateCard(update));
    });

}

function createUpdateCard(update) {

    const card = document.createElement("a");

    card.className = "update-card";
    card.href = `update.html?version=${encodeURIComponent(update.version)}`;

    const image = update.version.replaceAll(".", "_");

    const date = new Date(update.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    card.innerHTML = `
        <img src="IMGUPDATES/v_${image}.png" alt="v${update.version}">
        <div class="update-content">
            <span class="update-version">v${update.version}</span>
            <h3>${update.title}</h3>
            <p>${update.subtitle}</p>
            <span class="update-date">${date}</span>
        </div>
    `;

    return card;

}