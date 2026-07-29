"use strict";

// Elements

const container = document.getElementById("procedures-container");

// Initialize

document.addEventListener("DOMContentLoaded", loadMisc);

// Functions

async function loadMisc() {

    const response = await fetch("DATA/updates.json");
    const updates = await response.json();

    const variables = [];
    const triggers = [];

    updates.forEach(update => {

        if (update.new_variables) {

            update.new_variables.forEach(variable => {

                variables.push({
                    ...variable,
                    version: update.version
                });

            });

        }

        if (update.new_triggers) {

            update.new_triggers.forEach(trigger => {

                triggers.push({
                    ...trigger,
                    version: update.version
                });

            });

        }

    });

    container.innerHTML = "";

    createSection("Variables", variables, "variable");
    createSection("Triggers", triggers, "trigger");

}

function createSection(title, data, category) {

    if (!data.length) {
        return;
    }

    const section = document.createElement("section");

    section.className = "section";

    section.innerHTML = `
        <span class="section-label">${title.toUpperCase()}</span>
        <h2>${title}</h2>
        <br>
    `;

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = `procedure-card category-${category}`;

        card.innerHTML = `
            <div class="procedure-header">

                <div class="procedure-title">
                    ${item.name}
                </div>

                <div class="procedure-tags">
                    <span class="procedure-tag tag-category">
                        v${item.version}
                    </span>
                </div>

            </div>

            <div class="procedure-description">
                ${item.description || ""}
            </div>
        `;

        section.appendChild(card);

    });

    container.appendChild(section);

}